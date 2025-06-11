"use client";
import { Map, Source, Layer, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GiRadarDish } from "react-icons/gi";
import { useMemo, useState, useEffect } from "react";
import * as turf from "@turf/turf";
import type { FeatureCollection } from "geojson"; // pastikan ini di bagian import atas

const RADIUS_COLORS = {
  SMALL: "#FF0000",
  MEDIUM: "#FFFF00",
  LARGE: "#00FF00"
};

const DARK_GREEN = "#033D1A";
const DARK_YELLOW = "#D6C90C";

const MapBox = () => {
  const latitude = -6.9370568;
  const longitude = 107.6313287;

  const radiusArray = useMemo(() => [25, 50, 75, 100, 250, 500, 750, 1000, 1500, 2000, 3000], []);

  const geojsonData = useMemo(() => {
    const circleFeatures = radiusArray.map((radius) => {
      const circle = turf.circle([longitude, latitude], radius / 1000, {
        steps: 64,
        units: "kilometers",
      });

      let color = RADIUS_COLORS.LARGE;
      if (radius <= 100) color = RADIUS_COLORS.SMALL;
      else if (radius <= 750) color = RADIUS_COLORS.MEDIUM;

      circle.properties = { color };
      return circle;
    });

    const sectorFeatures = radiusArray.map((radius) => {
      const sector = turf.sector(
        [longitude, latitude],
        radius / 1000,
        -22.5,
        22.5,
        { steps: 64, units: "kilometers" }
      );

      let color = RADIUS_COLORS.LARGE;
      if (radius <= 100) color = RADIUS_COLORS.SMALL;
      else if (radius <= 750) color = RADIUS_COLORS.MEDIUM;

      sector.properties = { color };
      return sector;
    });

    const bearings = [0, 90, 180, 270];
    const labelFeatures = radiusArray.flatMap((radius) =>
      bearings.map((bearing) => {
        const labelPoint = turf.destination(
          [longitude, latitude],
          radius / 1000,
          bearing,
          { units: "kilometers" }
        );

        labelPoint.properties = {
          label: radius >= 1000 ? `${radius / 1000} km` : `${radius} m`,
        };

        return labelPoint;
      })
    );

    return {
      circles: {
        type: "FeatureCollection",
        features: circleFeatures,
      },
      sectors: {
        type: "FeatureCollection",
        features: sectorFeatures,
      },
      labels: {
        type: "FeatureCollection",
        features: labelFeatures,
      },
    };
  }, [latitude, longitude, radiusArray]);

  // 👇 Efek denyut gelombang
 
const [waveCircle, setWaveCircle] = useState<FeatureCollection | null>(null);


  useEffect(() => {
    let radius = 50;
    const maxRadius = 3000;
    const minRadius = 50;
    const step = 30;

    const interval = setInterval(() => {
      const circle = turf.circle([longitude, latitude], radius / 1000, {
        steps: 64,
        units: "kilometers",
      });

     const progress = (radius - minRadius) / (maxRadius - minRadius);
      const opacity = 0.4 + 0.4 * Math.pow(1 - progress, 1.5); 

      circle.properties = { opacity };

      setWaveCircle({
        type: "FeatureCollection",
        features: [circle],
      });

      radius += step;
      if (radius > maxRadius) radius = minRadius;
    }, 100);

    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return (
    <div className="w-full h-full">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ longitude, latitude, zoom: 17 }}
        maxBounds={[[105.5, -8.2], [115, -5.8]]}
        minZoom={5}
        maxZoom={20}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        style={{ width: "100%", height: "100%" }}
      >
        <Marker longitude={longitude} latitude={latitude}>
          <div className="text-red-500 text-3xl animate-pulse">
            <GiRadarDish />
          </div>
        </Marker>

        {/* 👇 Efek denyut gelombang */}
        {waveCircle && (
          <Source id="wave-circle" type="geojson" data={waveCircle}>
            <Layer
              id="wave-circle-fill"
              type="fill"
              paint={{
                "fill-color": "#033D1A",
                "fill-opacity": ["get", "opacity"],
              }}
            />
            <Layer
              id="wave-circle-outline"
              type="line"
              paint={{
                "line-color": "#033D1A",
                "line-opacity": ["get", "opacity"],
                "line-width": 1,
              }}
            />
          </Source>
        )}
        <Source id="radar-sectors" type="geojson" data={geojsonData.sectors}>
          <Layer
            id="radar-sector-fill"
            type="fill"
            paint={{
              "fill-color": DARK_YELLOW,
              "fill-opacity": 0.08,
            }}
          />
        </Source>

        <Source id="radar-circles" type="geojson" data={geojsonData.circles}>
          <Layer
            id="radar-outline"
            type="line"
            paint={{
              "line-color": ["get", "color"],
              "line-width": 1.2,
            }}
          />
        </Source>

        <Source id="radar-labels" type="geojson" data={geojsonData.labels}>
          <Layer
            id="radar-label-text"
            type="symbol"
            layout={{
              "text-field": ["get", "label"],
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": 13,
              "text-offset": [0, 0],
              "text-anchor": "center",
              "text-justify": "center"
            }}
            paint={{
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
            }}
          />
        </Source>
      </Map>
    </div>
  );
};

export default MapBox;
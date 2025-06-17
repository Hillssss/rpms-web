"use client";

import { Map, Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GiRadarDish } from "react-icons/gi";
import { useMapBox } from "@/hooks/useMapBox";

const MapBox = () => {
  const {
    mapRef,
    isConnected,
    isStarted,
    longitude,
    latitude,
    waveCircle,
    geojsonData,
    handleMarkerClick,
    DARK_YELLOW,
  } = useMapBox();

  return (
    <div className="w-full h-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ longitude, latitude, zoom: 17 }}
        maxBounds={[[95, -11], [141, 6]]}
        minZoom={5}
        maxZoom={20}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        style={{ width: "100%", height: "100%" }}
      >
        {isStarted && (
  <>
    {/* Marker Radar */}
    <Marker
      longitude={longitude}
      latitude={latitude}
      onClick={handleMarkerClick}
      style={{ cursor: "pointer" }}
    >
      <div className="text-red-500 text-3xl animate-pulse">
        <GiRadarDish />
      </div>
    </Marker>

    {/* Gelombang hanya saat Connected */}
    {isConnected && waveCircle && (
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

    {/* Lingkaran, sektor, dan label radar */}
    {geojsonData && (
      <>
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
              "text-justify": "center",
            }}
            paint={{
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
            }}
          />
        </Source>
      </>
    )}
  </>
)}

      </Map>
    </div>
  );
};

export default MapBox;

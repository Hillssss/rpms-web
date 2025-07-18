"use client";

import { Map, Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GiRadarDish } from "react-icons/gi";
import { useMapBox } from "@/hooks/useMapBox";
import { useEffect, useState } from "react";

type MapBoxProps = {
  onClickCoordinate?: (coord: { lat: number; lng: number }) => void;
};

const Map3DBox = ({ onClickCoordinate }: MapBoxProps) => {
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

  const [clickedLatLng, setClickedLatLng] = useState<{ lat: number; lng: number } | null>(null);

  // Tambahkan terrain + layer bangunan 3D setelah map load
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.on("load", () => {
      // 1. Tambahkan source terrain
      if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.terrain-rgb",
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      }

      // 2. Tambahkan 3D buildings
      if (!map.getLayer("3d-buildings")) {
        map.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "#aaa",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": 0.6,
            },
          },
          "waterway-label" // letakkan sebelum label air supaya 3D muncul di bawah teks
        );
      }
    });
  }, [mapRef]);

  return (
    <div className="w-full h-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude,
          latitude,
          zoom: 15,
          pitch: 60,
          bearing: -17,
        }}
        minZoom={3}
        maxZoom={20}
        mapStyle="mapbox://styles/mapbox/standard"
        style={{ width: "100%", height: "100%" }}
        scrollZoom={true}
        dragPan={true}
        touchZoomRotate={true}
        dragRotate={true}
        onClick={(e) => {
          const { lng, lat } = e.lngLat;
          const coords = { lat, lng };
          setClickedLatLng(coords);
          onClickCoordinate?.(coords); // Kirim ke page.tsx
        }}
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

export default Map3DBox;

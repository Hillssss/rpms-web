"use client";

import { Map, Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GiRadarDish } from "react-icons/gi";
import { useMapBox } from "@/hooks/useMapBox";
import { useState } from "react";

type MapBoxProps = {
  onClickCoordinate?: (coord: { lat: number; lng: number }) => void;
};

const MapBox = ({ onClickCoordinate }: MapBoxProps) => {
  const {
    mapRef,
    isConnected,
    isStarted,
    longitude,
    latitude,
    waveCircle,
    geojsonData,
    gunshotSector,
    handleMarkerClick,
    DARK_YELLOW,
  } = useMapBox();

  const [clickedLatLng, setClickedLatLng] = useState<{ lat: number; lng: number } | null>(null);

  const isValidCoordinate =
    isFinite(latitude) && !isNaN(latitude) && isFinite(longitude) && !isNaN(longitude);

  return (
    <div className="w-full h-full">
      <Map
        ref={mapRef}
        reuseMaps={true}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""}
        initialViewState={{
          longitude: isValidCoordinate ? longitude : 107.6, // default fallback ke Bandung
          latitude: isValidCoordinate ? latitude : -6.9,
          zoom: 10,
        }}
        minZoom={3}
        maxZoom={20}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        style={{ width: "100%", height: "100%" }}
        scrollZoom={true}
        dragPan={true}
        touchZoomRotate={true}
        dragRotate={true}
        onClick={(e) => {
          const { lng, lat } = e.lngLat;
          const coords = { lat, lng };
          setClickedLatLng(coords);
          onClickCoordinate?.(coords);
        }}
      >
        {isStarted && (
          <>
            {/* 📡 Radar Marker */}
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

            {/* 🌊 Radar Wave */}
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

            {/* 🔴 Gunshot Sector */}
            {isConnected && gunshotSector && (
              <Source id="gunshot-sector" type="geojson" data={gunshotSector}>
                <Layer
                  id="gunshot-sector-fill"
                  type="fill"
                  paint={{
                    "fill-color": "#FF0000",
                    "fill-opacity": ["get", "opacity"],
                  }}
                />
                <Layer
                  id="gunshot-sector-outline"
                  type="line"
                  paint={{
                    "line-color": "#FF0000",
                    "line-width": 1,
                    "line-opacity": 0.8,
                  }}
                />
              </Source>
            )}

            {/* 🟡 Radar Rings & Labels */}
            {geojsonData && (
              <>
                {/* Sektor */}
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

                {/* Lingkaran */}
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

                {/* Label */}
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

"use client";

import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapBox = () => {
  return (
    <div className="w-full h-full">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 107.609810,
          latitude: -6.914744,
          zoom: 17,
        }}
        maxBounds={[[95, -11], [141, 6]]}
        minZoom={5}
        maxZoom={20}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};


export default MapBox;
"use client";
import { createContext, useContext, useRef } from "react";
import type { MapRef } from "react-map-gl";


type MapContextType = {
  mapRef: React.MutableRefObject<MapRef | null>;
};

const MapContext = createContext<MapContextType>({
  mapRef: { current: null },
});

export const useMapContext = () => useContext(MapContext);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const mapRef = useRef<MapRef | null>(null);

  return (
    <MapContext.Provider value={{ mapRef }}>
      {children}
    </MapContext.Provider>
  );
};

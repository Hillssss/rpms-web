"use client";
import { createContext, useContext, useState } from "react";

type Koordinat = {
  latitude: string;
  longitude: string;
  altitude: string;
};

type OperasiState = {
  namaOperasi: string;
  radar: Koordinat;
  gunshot: Koordinat;
  idOperasi: string;
  isStarted: boolean;
  isConnected: boolean;
  setOperasi: (data: Partial<OperasiState>) => void;
  setStarted: (value: boolean) => void;
  setConnected: (value: boolean) => void;
};

const defaultState: OperasiState = {
  namaOperasi: "",
  radar: { latitude: "", longitude: "", altitude: "" },
  gunshot: { latitude: "", longitude: "", altitude: "" },
  idOperasi: "",
  isStarted: false,
  isConnected: false,
  setOperasi: () => {},
  setStarted: () => {},
  setConnected: () => {},
};
const OperasiContext = createContext<OperasiState>(defaultState);

export const useOperasi = () => useContext(OperasiContext);

export const OperasiProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<Omit<OperasiState, "setOperasi" | "setStarted" | "setConnected" | "isStarted" | "isConnected">>({
    namaOperasi: "",
    radar: { latitude: "", longitude: "", altitude: "" },
    gunshot: { latitude: "", longitude: "", altitude: "" },
    idOperasi: "",
  });

  const [isStarted, setStarted] = useState(false);
  const [isConnected, setConnected] = useState(false);

  const setOperasi = (data: Partial<OperasiState>) => {
  setState((prev) => ({
    ...prev,
    ...data,
    radar: {
      ...prev.radar,
      ...(data.radar ?? {}),
    },
    gunshot: {
      ...prev.gunshot,
      ...(data.gunshot ?? {}),
    },
  }));
};

  return (
    <OperasiContext.Provider
      value={{ ...state, isStarted, isConnected, setOperasi, setStarted, setConnected }}
    >
      {children}
    </OperasiContext.Provider>
  );
};

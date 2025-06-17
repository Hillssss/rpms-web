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
  activate: boolean;
   setActivate: (value: boolean) => void;
  setOperasi: (data: Partial<OperasiState>) => void;
  setStarted: (value: boolean) => void;
  setConnected: (value: boolean) => void;
};

const defaultState: OperasiState = {
  namaOperasi: "",
  radar: { latitude: "", longitude: "", altitude: "" },
  gunshot: { latitude: "", longitude: "", altitude: "" },
  idOperasi: "",
  activate:false,
  isStarted: false,
  isConnected: false,
  setActivate: () => {},
  setOperasi: () => {},
  setStarted: () => {},
  setConnected: () => {},
};
const OperasiContext = createContext<OperasiState>(defaultState);

export const useOperasi = () => useContext(OperasiContext);

export const OperasiProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<Omit<OperasiState, "setOperasi" | "setStarted" | "setConnected" | "isStarted" | "isConnected" | "activate" | "setActivate">>({
    namaOperasi: "",
    radar: { latitude: "", longitude: "", altitude: "" },
    gunshot: { latitude: "", longitude: "", altitude: "" },
    idOperasi: "",
  });

  const [isStarted, setStarted] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [activate, setActivate] = useState(false);

  const setOperasi = (data: Partial<Omit<OperasiState, "setOperasi" | "setStarted" | "setConnected" | "setActivate" | "isStarted" | "isConnected" | "activate">> & { activate?: boolean }) => {
  if (typeof data.activate === "boolean") {
    setActivate(data.activate);
  }

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
      value={{ ...state, isStarted, isConnected,activate, setOperasi, setStarted, setConnected, setActivate , }}
    >
      {children}
    </OperasiContext.Provider>
  );
};

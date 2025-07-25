"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchKoneksiState, fetchCurrentOperasi } from "@/lib/api";
import { useMqtt } from "@/contexts/MqttContext";

// Types

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
  inputRadar: Koordinat;
  setInputRadar: (data: Koordinat) => void;
  inputGunshot: Koordinat;
  setInputGunshot: (data: Koordinat) => void;
};

const defaultState: OperasiState = {
  namaOperasi: "",
  radar: { latitude: "", longitude: "", altitude: "" },
  gunshot: { latitude: "", longitude: "", altitude: "" },
  idOperasi: "",
  isStarted: false,
  isConnected: false,
  activate: false,
  setActivate: () => {},
  setOperasi: () => {},
  setStarted: () => {},
  setConnected: () => {},
  inputRadar: { latitude: "", longitude: "", altitude: "" },
  setInputRadar: () => {},
  inputGunshot: { latitude: "", longitude: "", altitude: "" },
  setInputGunshot: () => {},
};

const OperasiContext = createContext<OperasiState>(defaultState);
export const useOperasi = () => useContext(OperasiContext);

const getInitialState = (): Omit<
  OperasiState,
  | "setOperasi"
  | "setStarted"
  | "setConnected"
  | "isStarted"
  | "isConnected"
  | "activate"
  | "setActivate"
  | "inputRadar"
  | "setInputRadar"
  | "inputGunshot"
  | "setInputGunshot"
> => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("operasiState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          namaOperasi: parsed.namaOperasi || "",
          idOperasi: parsed.idOperasi || "",
          radar: parsed.radar || { latitude: "", longitude: "", altitude: "" },
          gunshot: parsed.gunshot || { latitude: "", longitude: "", altitude: "" },
        };
      } catch {
        return defaultState;
      }
    }
  }
  return defaultState;
};

export const OperasiProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(getInitialState);
  const [isStarted, setStarted] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [activate, setActivate] = useState(false);

  const [inputRadar, setInputRadar] = useState<Koordinat>({
    latitude: "",
    longitude: "",
    altitude: "",
  });
  const [inputGunshot, setInputGunshot] = useState<Koordinat>({
    latitude: "",
    longitude: "",
    altitude: "",
  });

  const { refreshSignal } = useMqtt();

  const setOperasi = (
    data: Partial<Omit<
      OperasiState,
      | "setOperasi"
      | "setStarted"
      | "setConnected"
      | "setActivate"
      | "isStarted"
      | "isConnected"
      | "activate"
      | "inputRadar"
      | "setInputRadar"
      | "inputGunshot"
      | "setInputGunshot"
    >>
  ) => {
    setState((prev) => ({
      ...prev,
      ...data,
      radar: { ...prev.radar, ...(data.radar ?? {}) },
      gunshot: { ...prev.gunshot, ...(data.gunshot ?? {}) },
    }));
  };

  useEffect(() => {
    const toSave = {
      ...state,
      isStarted,
      isConnected,
      activate,
    };
    localStorage.setItem("operasiState", JSON.stringify(toSave));
  }, [state, isStarted, isConnected, activate]);

  useEffect(() => {
    const syncConnectionState = async () => {
      const result = await fetchKoneksiState();
      setConnected(result);

      const saved = localStorage.getItem("operasiState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          parsed.isConnected = result;
          localStorage.setItem("operasiState", JSON.stringify(parsed));
        } catch {}
      }
    };

    if (isStarted) {
      syncConnectionState();
    }
  }, [isStarted]);

  useEffect(() => {
  if (!state.idOperasi) return;

  const syncStatus = async () => {
    const result = await fetchCurrentOperasi(Number(state.idOperasi));

    const aktif = result.status === "success";
    setStarted(aktif);

    // ✅ TAMBAHKAN INI: update radar dan gunshot dari server
    if (result.radar && result.gunshot) {
      setOperasi({
        radar: {
          latitude: String(result.radar.latitude),
          longitude: String(result.radar.longitude),
          altitude: "",
        },
        gunshot: {
          latitude: String(result.gunshot.latitude),
          longitude: String(result.gunshot.longitude),
          altitude: "",
        },
      });
    }
  };

  syncStatus();
}, [refreshSignal, state.idOperasi]);
  

  return (
    <OperasiContext.Provider
      value={{
        ...state,
        isStarted,
        isConnected,
        activate,
        setOperasi,
        setStarted,
        setConnected,
        setActivate,
        inputRadar,
        setInputRadar,
        inputGunshot,
        setInputGunshot,
      }}
    >
      {children}
    </OperasiContext.Provider>
  );
};

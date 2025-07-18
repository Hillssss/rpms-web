"use client";
import { createContext, useContext, useEffect, useState, } from "react";
import { fetchKoneksiState } from "@/lib/api"; // pastikan path ini benar

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
  refreshValue: boolean,
  setRefreshValue: (value: boolean) => void
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
  refreshValue: false,
  setRefreshValue: () => {}
};

const OperasiContext = createContext<OperasiState>(defaultState);
export const useOperasi = () => useContext(OperasiContext);

// 🔁 Ambil data awal dari localStorage
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
  | "refreshValue"
  | "setRefreshValue"
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
  const [refreshValue, setRefreshValue] = useState(false);

  const [isStarted, setStarted] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("operasiState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.isStarted || false;
        } catch {}
      }
    }
    return false;
  });

  const [isConnected, setConnected] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("operasiState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.isConnected || false;
        } catch {}
      }
    }
    return false;
  });

  const [activate, setActivate] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("operasiState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.activate || false;
        } catch {}
      }
    }
    return false;
  });

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
      | "refreshValue"
      | "setRefreshValue"
    >>
  ) => {
    setState((prev) => ({
      ...prev,
      ...data,
      radar: { ...prev.radar, ...(data.radar ?? {}) },
      gunshot: { ...prev.gunshot, ...(data.gunshot ?? {}) },
    }));
  };

  // 💾 Simpan semua ke localStorage saat berubah
  useEffect(() => {
    const toSave = {
      ...state,
      isStarted,
      isConnected,
      activate,
    };
    localStorage.setItem("operasiState", JSON.stringify(toSave));
  }, [state, isStarted, isConnected, activate]);

  // 🌐 Sinkronisasi status koneksi dari server
  useEffect(() => {
    const syncConnectionState = async () => {
      const result = await fetchKoneksiState();
      setConnected(result);

      // Simpan juga ke localStorage agar konsisten
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
        refreshValue,
        setRefreshValue
      }}
    >
      {children}
    </OperasiContext.Provider>
  );
};

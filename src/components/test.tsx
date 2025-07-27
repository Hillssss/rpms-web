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

        // ⛔️ Kosongkan idOperasi agar tidak auto-fetch saat startup
        return {
          namaOperasi: "",
          idOperasi: "", // <== bikin kosong
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
 const [isStarted, setStarted] = useState(() => false); // Force false saat init
const [isConnected, setConnected] = useState(() => false); // Force false saat init
  const [activate, setActivate] = useState(false);

  console.log("🏁 OperasiContext INIT:", { 
  isStarted, 
  isConnected, 
  idOperasi: state.idOperasi 
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
    try {
      // Cek status operasi
       console.log("🔄 SYNC START for operasi:", state.idOperasi);
      const result = await fetchCurrentOperasi(Number(state.idOperasi));
      const aktif = result.status === 200;
      
      // Cek status koneksi
      const connected = await fetchKoneksiState();

       console.log("📊 BACKEND RESPONSE:", { aktif, connected, result });
      
      // Update state bersamaan
      setStarted(aktif);
      setConnected(connected);


      console.log("✅ STATE UPDATED:", { aktif, connected });

      // Update koordinat jika ada
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
    } catch (error) {
      console.error("❌ Sync error:", error);
      setStarted(false);
      setConnected(false);
    }
  };

  syncStatus();
}, [refreshSignal, state.idOperasi]);

// Tambahkan setelah useEffect terakhir (sekitar baris 175)
useEffect(() => {
  if (!state.idOperasi) return;

  const interval = setInterval(async () => {
    try {
      const result = await fetchCurrentOperasi(Number(state.idOperasi));
      const aktif = result.status === 200;
      
      const connected = await fetchKoneksiState();
      
      // Jika backend restart, reset state
      if (!aktif && !connected) {
        setStarted(false);
        setConnected(false);
      }
    } catch (error) {
      // API error = reset state
      setStarted(false);
      setConnected(false);
    }
  }, 3000); // Cek setiap 5 detik

  return () => clearInterval(interval);
}, [state.idOperasi]);

// ✅ INITIAL SYNC saat component pertama kali mount (setelah refresh)
useEffect(() => {
  const initialSync = async () => {
    if (!state.idOperasi) return;
    
    try {
      console.log("🔄 Initial sync after refresh/mount...");
      
      // Cek kondisi backend yang sebenarnya
      const result = await fetchCurrentOperasi(Number(state.idOperasi));
      const aktif = result.status === 200;
      
      const connected = await fetchKoneksiState();
      
      console.log("📊 Backend state:", { aktif, connected });
      
      // Update state sesuai kondisi backend
      setStarted(aktif);
      setConnected(connected);
      
      console.log("✅ Initial sync completed");
    } catch (error) {
      console.error("❌ Initial sync error:", error);
      // Jika API error, pastikan state reset
      setStarted(false);
      setConnected(false);
    }
  };

  // Jalankan initial sync
  initialSync();
}, [state.idOperasi]); // Empty dependency = hanya run sekali saat component mount

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
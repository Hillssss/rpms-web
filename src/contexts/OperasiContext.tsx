"use client";
import { createContext, useContext, useCallback, useEffect, useState } from "react";
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

export const OperasiProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(() => ({
    namaOperasi: "",
    idOperasi: "",
    radar: { latitude: "", longitude: "", altitude: "" },
    gunshot: { latitude: "", longitude: "", altitude: "" },
  }));
  const [isStarted, setStarted] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [activate, setActivate] = useState(false);
  const [inputRadar, setInputRadar] = useState<Koordinat>({ latitude: "", longitude: "", altitude: "" });
  const [inputGunshot, setInputGunshot] = useState<Koordinat>({ latitude: "", longitude: "", altitude: "" });

  const { refreshSignal } = useMqtt();

  const setOperasi = useCallback(
    (data: Partial<Omit<OperasiState,
      "setOperasi" | "setStarted" | "setConnected" | "setActivate" |
      "isStarted" | "isConnected" | "activate" |
      "inputRadar" | "setInputRadar" | "inputGunshot" | "setInputGunshot"
    >>) => {
      setState((prev) => ({
        ...prev,
        ...data,
        radar: { ...prev.radar, ...(data.radar ?? {}) },
        gunshot: { ...prev.gunshot, ...(data.gunshot ?? {}) },
      }));
    },
    []
  );

  // ✅ Restore dari localStorage jika idOperasi valid di backend
  useEffect(() => {
    const restoreOperasiIfValid = async () => {
      const saved = localStorage.getItem("operasiState");
      if (!saved) return;

      try {
        const parsed = JSON.parse(saved);
        const id = parsed?.idOperasi;

        if (!id) return;

        const result = await fetchCurrentOperasi(Number(id));
        const aktif = result.status === 200;

        if (!aktif) return; // ❌ Skip jika tidak valid di backend

        console.log("🟢 Restore operasi dari localStorage:", id);
        setOperasi({
          idOperasi: id,
          namaOperasi: parsed.namaOperasi || "",
          radar: parsed.radar || { latitude: "", longitude: "", altitude: "" },
          gunshot: parsed.gunshot || { latitude: "", longitude: "", altitude: "" },
        });
      } catch (err) {
        console.error("❌ Gagal restore operasi:", err);
      }
    };

    restoreOperasiIfValid();
  }, [setOperasi]);

  // ✅ Simpan ke localStorage jika state berubah
  useEffect(() => {
    const toSave = {
      ...state,
      isStarted,
      isConnected,
      activate,
    };
    localStorage.setItem("operasiState", JSON.stringify(toSave));
  }, [state, isStarted, isConnected, activate]);

  // ✅ Hanya sync koneksi backend
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

    if (isStarted) syncConnectionState();
  }, [isStarted]);

  // ✅ Sync operasi (dengan MQTT signal, interval, atau mount)
  const syncBackendStatus = useCallback(
    async (source: string) => {
      if (!state.idOperasi) return;

      try {
        console.log(`🔄 SYNC (${source}) for operasi:`, state.idOperasi);
        const result = await fetchCurrentOperasi(Number(state.idOperasi));
        const aktif = result.status === 200;
        const connected = await fetchKoneksiState();

        setStarted(aktif);
        setConnected(connected);

        console.log("✅ STATE UPDATED:", { aktif, connected });

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
    },
    [state.idOperasi, setOperasi]
  );

  useEffect(() => {
    syncBackendStatus("refreshSignal");
  }, [refreshSignal, syncBackendStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      syncBackendStatus("interval");
    }, 3000);
    return () => clearInterval(interval);
  }, [syncBackendStatus]);

  useEffect(() => {
    syncBackendStatus("initialMount");
  }, [syncBackendStatus]);

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

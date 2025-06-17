"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrentOperasi } from "@/lib/api";
import { useOperasi } from "@/contexts/OperasiContext";

export type TrackerPoint = {
  altitude: number;
  id: string;
  latitude: number;
  longitude: number;
  time: number;
};

export type DeteksiItem = {
  action: string;
  altitude: number;
  created_at: number;
  direction: number;
  distance: number;
  id_deteksi: number;
  id_operasi: number;
  id_radar: number;
  keterangan: string;
  latitude: number;
  longitude: number;
  tracker: TrackerPoint[][];
};

type DeteksiContextType = {
  deteksi: DeteksiItem[];
  setDeteksi: React.Dispatch<React.SetStateAction<DeteksiItem[]>>;
};

const DeteksiContext = createContext<DeteksiContextType | undefined>(undefined);

export const DeteksiProvider = ({ children }: { children: React.ReactNode }) => {
  const [deteksi, setDeteksi] = useState<DeteksiItem[]>([]);
  const { idOperasi } = useOperasi(); // dari context operasi

  useEffect(() => {
    const load = async () => {
      if (!idOperasi) return;
      try {
        const data = await fetchCurrentOperasi(parseInt(idOperasi));
        setDeteksi(data.deteksi ?? []); // ambil dari data.deteksi
      } catch (err) {
        console.error("Gagal mengambil data deteksi:", err);
      }
    };

    load();
  }, [idOperasi]);

  return (
    <DeteksiContext.Provider value={{ deteksi, setDeteksi }}>
      {children}
    </DeteksiContext.Provider>
  );
};

export const useDeteksi = () => {
  const context = useContext(DeteksiContext);
  if (!context) {
    throw new Error("useDeteksi must be used within a DeteksiProvider");
  }
  return context;
};

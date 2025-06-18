"use client";

import { useState, useEffect } from "react";
import { fetchCurrentOperasi } from "@/lib/api";
import { useOperasi } from "@/contexts/OperasiContext"; // untuk ambil ID operasi

interface DetectionData {
  id: number;
  distance: string;
  time: string;
  angle: string;
  latitude: string;
  longitude: string;
  id_radar: number;
  source: string;
}

export const useOverlaysLeft = () => {
  const [showOdsContent, setShowOdsContent] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DetectionData | null>(null);
  const [detectionData, setDetectionData] = useState<DetectionData[]>([]);

  const { idOperasi } = useOperasi(); // ambil dari context

  useEffect(() => {
    const fetchData = async () => {
      if (!idOperasi) {
        setSelectedItem(null);
        setDetectionData([]);
        return;
      }

      try {
        const result = await fetchCurrentOperasi(parseInt(idOperasi));
        const converted: DetectionData[] = result.deteksi.map((item: any) => ({
          id: item.id_deteksi,
          distance: `${item.distance} m`,
          time: new Date(item.created_at * 1000).toLocaleTimeString("id-ID", {
            hour12: false,
          }),
          angle: `${item.direction}°`,
          latitude: `${item.latitude}`,
          longitude: `${item.longitude}`,
          id_radar: item.id_radar,
          source: item.keterangan,
        }));
        setDetectionData(converted);
        setSelectedItem(null);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, [idOperasi]); // rerun kalau ID berubah

  return {
    showOdsContent,
    setShowOdsContent,
    selectedItem,
    setSelectedItem,
    detectionData,
  };
};

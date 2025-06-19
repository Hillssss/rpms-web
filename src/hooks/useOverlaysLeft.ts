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

  const { idOperasi } = useOperasi();

  // 1️⃣ Load dari localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("detectionData");
    const savedItem = localStorage.getItem("selectedItem");
    if (savedData) {
      setDetectionData(JSON.parse(savedData));
      console.log("Load detectionData dari localStorage:", JSON.parse(savedData));
    }
    if (savedItem) {
      setSelectedItem(JSON.parse(savedItem));
      console.log("Load selectedItem dari localStorage:", JSON.parse(savedItem));
    }
  }, []);

  // 2️⃣ Hanya fetch dari API kalau idOperasi memang ADA
  useEffect(() => {
    const fetchData = async () => {
      if (!idOperasi) {
        // ✅ Jika tidak ada idOperasi, JANGAN reset detectionData
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
  }, [idOperasi]);

  // 3️⃣ Simpan ke localStorage
  useEffect(() => {
    if (detectionData.length > 0) {
      localStorage.setItem("detectionData", JSON.stringify(detectionData));
    }
  }, [detectionData]);

  useEffect(() => {
    if (selectedItem) {
      localStorage.setItem("selectedItem", JSON.stringify(selectedItem));
    }
  }, [selectedItem]);

  return {
    showOdsContent,
    setShowOdsContent,
    selectedItem,
    setSelectedItem,
    detectionData,
  };
};

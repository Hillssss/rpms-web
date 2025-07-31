"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchCurrentOperasi } from "@/lib/api";
import { useOperasi } from "@/contexts/OperasiContext";
import { useMqtt } from "@/contexts/MqttContext"; // ✅ Ambil refreshSignal dari context

interface DetectionData {
  id: number;
  distance: string;
  time: string;
  angle: string;
  latitude: string;
  longitude: string;
  id_radar: number;
  source: string;
  created_at: number;
  caliber?: string;
}

export const useOverlaysLeft = () => {
  const [showOdsContent, setShowOdsContent] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DetectionData | null>(null);
  const [detectionData, setDetectionData] = useState<DetectionData[]>([]);
  const [gunshotData, setGunshotData] = useState<DetectionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshSignal } = useMqtt();
  const { idOperasi } = useOperasi();

  const lastApiLoadTime = useRef<number>(0);

  const isGunshotData = useCallback((keterangan: string): boolean => {
    const keywords = ["7.62MM", "5.56MM", "12.7MM", "7.62", "5.56", "12.7"];
    return keywords.some(keyword =>
      keterangan?.toUpperCase().includes(keyword.toUpperCase())
    );
  }, []);

  const transformApiData = useCallback((item: any): DetectionData => {
    const keterangan = item.keterangan || "";
    const isGunshot = isGunshotData(keterangan);

    return {
      id: item.id_deteksi,
      distance: `${item.distance || 0}m`,
      time: new Date(item.created_at * 1000).toLocaleTimeString("id-ID", { hour12: false }),
      angle: `${item.direction || 0}°`,
      latitude: `${item.latitude || 0}`,
      longitude: `${item.longitude || 0}`,
      id_radar: item.id_radar || 0,
      source: isGunshot ? "gunshot" : "radar",
      created_at: item.created_at,
      caliber: isGunshot ? keterangan : undefined,
    };
  }, [isGunshotData]);

  const loadDataFromAPI = useCallback(async () => {
    if (!idOperasi) {
      setSelectedItem(null);
      setDetectionData([]);
      setGunshotData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchCurrentOperasi(parseInt(idOperasi));
      if (result.status === 'error') {
        setError('Gagal mengambil data dari server');
        return;
      }

      const allData: DetectionData[] = result.deteksi.map(transformApiData);

      const radarData = allData.filter(item => item.source === "radar");
      const gunshotFromApi = allData.filter(item => item.source === "gunshot");

      setDetectionData(radarData.slice(0, 100));

      setGunshotData(prev => {
        const apiGunshotIds = new Set(gunshotFromApi.map(item => item.id));
        const existing = prev.filter(item => !apiGunshotIds.has(item.id));
        return [...gunshotFromApi, ...existing]
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, 100);
      });

      if (allData.length > 0) {
        lastApiLoadTime.current = Math.max(...allData.map(item => item.created_at));
      }

      setSelectedItem(null);
    } catch (error) {
      console.error("❌ Gagal mengambil data:", error);
      setError("Gagal mengambil data deteksi");
    } finally {
      setIsLoading(false);
    }
  }, [idOperasi, transformApiData]);

  const refreshData = useCallback(async () => {
    lastApiLoadTime.current = 0;
    await loadDataFromAPI();
  }, [loadDataFromAPI]);

  // ✅ Sinkron dari MQTT context
  useEffect(() => {
    if (refreshSignal) {
      console.log("🔁 OverlayLeft refresh from MQTT:", refreshSignal);
      loadDataFromAPI();
    }
  }, [refreshSignal, loadDataFromAPI]);

  // ⏱ Initial load saat mount
  useEffect(() => {
    loadDataFromAPI();
  }, [loadDataFromAPI]);

  // 🔄 Polling fallback (opsional)
  useEffect(() => {
    if (!idOperasi) return;
    const interval = setInterval(() => {
      loadDataFromAPI();
    }, 10000); // 10 detik
    return () => clearInterval(interval);
  }, [idOperasi, loadDataFromAPI]);

  // 🔄 Reset saat ganti operasi
  useEffect(() => {
  if (!idOperasi) return;

  console.log("[OverlayLeft] Reset karena idOperasi berubah atau refreshSignal");

  setDetectionData([]);
  setGunshotData([]);
  setSelectedItem(null);
  setError(null);
  lastApiLoadTime.current = 0;
}, [idOperasi, refreshSignal]); // ✅ tambahkan refreshSignal juga!


  const getLatestDetections = useCallback(() => {
    return {
      radar: detectionData.slice(0, 10),
      gunshot: gunshotData.slice(0, 10),
      all: [...detectionData, ...gunshotData]
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, 20),
    };
  }, [detectionData, gunshotData]);

  const clearSelectedItem = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const selectItem = useCallback((item: DetectionData) => {
    setSelectedItem(item);
  }, []);

  return {
    showOdsContent,
    setShowOdsContent,
    selectedItem,
    setSelectedItem,
    detectionData,
    gunshotData,
    isLoading,
    error,
    refreshData,
    getLatestDetections,
    clearSelectedItem,
    selectItem,
    totalDetections: detectionData.length + gunshotData.length,
    hasData: detectionData.length > 0 || gunshotData.length > 0,
  };
};

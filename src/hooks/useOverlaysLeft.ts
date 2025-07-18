"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchCurrentOperasi } from "@/lib/api";
import { useOperasi,} from "@/contexts/OperasiContext";
import { useGunshotMQTT } from "./useGunshotMQTT";

interface DetectionData {
  id: number;
  distance: string;
  time: string;
  angle: string;
  latitude: string;
  longitude: string;
  id_radar: number;
  source: string;
  created_at: number; // Tambahkan untuk sorting dan filtering
  caliber?: string; // Tambahkan untuk info kaliber gunshot

}

export const useOverlaysLeft = () => {
  const [showOdsContent, setShowOdsContent] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DetectionData | null>(null);
  const [detectionData, setDetectionData] = useState<DetectionData[]>([]);
  const [gunshotData, setGunshotData] = useState<DetectionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const { idOperasi, refreshValue, setRefreshValue} = useOperasi();
  const { gunshot: mqttGunshot, resetGunshot, isConnected } = useGunshotMQTT();

  // Refs untuk tracking data yang sudah diproses
  const processedGunshotIds = useRef<Set<number>>(new Set());
  const lastApiLoadTime = useRef<number>(0);

  // Fungsi untuk mengubah format data MQTT ke DetectionData
  const transformMqttData = useCallback((mqttData: any): DetectionData => {
    const timestamp = mqttData.created_at || Math.floor(Date.now() / 1000);
    
    return {
      id: Math.floor(timestamp * 1000), // Gunakan timestamp sebagai ID unik
      distance: "N/A",
      time: new Date(timestamp * 1000).toLocaleTimeString("id-ID", {
        hour12: false,
      }),
      angle: `${mqttData.direction || 0}°`,
      latitude: "N/A",
      longitude: "N/A",
      id_radar: 0,
      source: "gunshot",
      created_at: timestamp,
    };
  }, []);

  // Fungsi untuk mendeteksi apakah data adalah gunshot berdasarkan keterangan
  const isGunshotData = useCallback((keterangan: string): boolean => {
    const gunshotKeywords = ["7.62MM", "5.56MM", "12.7MM", "7.62", "5.56", "12.7"];
    return gunshotKeywords.some(keyword => 
      keterangan?.toUpperCase().includes(keyword.toUpperCase())
    );
  }, []);

  // Fungsi untuk transform data API ke DetectionData
  const transformApiData = useCallback((item: any): DetectionData => {
    const keterangan = item.keterangan || "";
    const isGunshot = isGunshotData(keterangan);
    
    return {
      id: item.id_deteksi,
      distance: `${item.distance || 0}m`,
      time: new Date(item.created_at * 1000).toLocaleTimeString("id-ID", {
        hour12: false,
      }),
      angle: `${item.direction || 0}°`,
      latitude: `${item.latitude || 0}`,
      longitude: `${item.longitude || 0}`,
      id_radar: item.id_radar || 0,
      source: isGunshot ? "gunshot" : "radar",
      created_at: item.created_at,
      caliber: isGunshot ? keterangan : undefined, // Simpan info kaliber untuk gunshot
    };
  }, [isGunshotData]);

  // Fungsi untuk load data dari API
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

      // Transform semua data dari API
      const allData: DetectionData[] = result.deteksi.map(transformApiData);

      // Pisahkan data berdasarkan source
      const radarData = allData.filter(item => item.source === "radar");
      const gunshotFromApi = allData.filter(item => item.source === "gunshot");

      // Update radar data - selalu replace dengan data terbaru dari API
      setDetectionData(radarData.slice(0, 50));

      // Update gunshot data - gabungkan data dari API dengan data MQTT yang sudah ada
      setGunshotData(prev => {
        // Ambil data gunshot dari MQTT yang belum ada di API
        const apiGunshotIds = new Set(gunshotFromApi.map(item => item.id));
        const mqttOnlyGunshot = prev.filter(item => !apiGunshotIds.has(item.id));

        // Gabungkan data dari API dengan data MQTT yang unik
        const combinedGunshot = [...gunshotFromApi, ...mqttOnlyGunshot];

        // Sort berdasarkan created_at terbaru dan ambil 50 teratas
        return combinedGunshot
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, 50);
      });

      // Update last load time
      if (allData.length > 0) {
        lastApiLoadTime.current = Math.max(...allData.map(item => item.created_at));
      }

      setSelectedItem(null);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setError('Gagal mengambil data deteksi');
    } finally {
      setIsLoading(false);
    }
  }, [idOperasi, transformApiData]);

  // Fungsi untuk refresh data manual
  const refreshData = useCallback(async () => {
    lastApiLoadTime.current = 0;
    processedGunshotIds.current.clear();
    await loadDataFromAPI();
  }, [loadDataFromAPI]);

  // Effect untuk load data awal
  useEffect(() => {
    loadDataFromAPI();
  }, [loadDataFromAPI, refreshValue, setRefreshValue]);

  // Effect untuk data MQTT real-time
  useEffect(() => {
    // 🔥 Hanya proses data gunshot MQTT jika sudah terhubung
    if (mqttGunshot && idOperasi && isConnected) {
      const timestamp = mqttGunshot.created_at || Math.floor(Date.now() / 1000);
      const detectionId = Math.floor(timestamp * 1000);

      // Cek apakah gunshot ini sudah diproses
      if (processedGunshotIds.current.has(detectionId)) {
        return;
      }

      const newGunshot = transformMqttData(mqttGunshot);

      setGunshotData(prev => {
        // Cek duplikasi berdasarkan ID
        const existingIds = new Set(prev.map(item => item.id));
        if (existingIds.has(newGunshot.id)) {
          return prev;
        }

        // Tambahkan ke set processed IDs
        processedGunshotIds.current.add(detectionId);

        // Tambahkan data baru ke awal array dan sort
        const updated = [newGunshot, ...prev]
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, 50);
        
        return updated;
      });

      // Reset gunshot setelah diproses
      resetGunshot();
    }
  }, [mqttGunshot, idOperasi, isConnected, transformMqttData, resetGunshot]);

  // Polling untuk update data berkala
  useEffect(() => {
    if (!idOperasi) return;

    const interval = setInterval(() => {
      loadDataFromAPI();
    }, 30000); // Polling setiap 30 detik

    return () => clearInterval(interval);
  }, [idOperasi, loadDataFromAPI]);

  // Reset state ketika operasi berubah
  useEffect(() => {
    if (idOperasi) {
      setDetectionData([]);
      setGunshotData([]);
      setSelectedItem(null);
      setError(null);
      lastApiLoadTime.current = 0;
      processedGunshotIds.current.clear();
    }
  }, [idOperasi]);

  // Fungsi helper untuk mendapatkan data terbaru
  const getLatestDetections = useCallback(() => {
    return {
      radar: detectionData.slice(0, 10), // 10 data radar terbaru
      gunshot: gunshotData.slice(0, 10), // 10 data gunshot terbaru
      all: [...detectionData, ...gunshotData]
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, 20) // 20 data terbaru dari semua source
    };
  }, [detectionData, gunshotData]);

  // Fungsi untuk clear selected item
  const clearSelectedItem = useCallback(() => {
    setSelectedItem(null);
  }, []);

  // Fungsi untuk select item
  const selectItem = useCallback((item: DetectionData) => {
    setSelectedItem(item);
  }, []);

  return {
    // State original
    showOdsContent,
    setShowOdsContent,
    selectedItem,
    setSelectedItem,
    detectionData,
    gunshotData,
    
    // State baru
    isLoading,
    error,
    
    // Functions
    refreshData,
    getLatestDetections,
    clearSelectedItem,
    selectItem,
    
    // Computed values
    totalDetections: detectionData.length + gunshotData.length,
    hasData: detectionData.length > 0 || gunshotData.length > 0,
    
    // Expose connection status
    isConnected,
  };
};
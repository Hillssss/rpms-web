"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { fetchCurrentOperasi } from "@/lib/api";
import { useOperasi } from "@/contexts/OperasiContext";
import { useGunshotMQTT } from "@/hooks/useGunshotMQTT";

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
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
};

const DeteksiContext = createContext<DeteksiContextType | undefined>(undefined);

export const DeteksiProvider = ({ children }: { children: React.ReactNode }) => {
  const [deteksi, setDeteksi] = useState<DeteksiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { idOperasi } = useOperasi();
  const { gunshot, resetGunshot } = useGunshotMQTT();
  
  // Ref untuk tracking data yang sudah ada
  const lastApiLoadTime = useRef<number>(0);
  const processedGunshotIds = useRef<Set<number>>(new Set());

  // Transform data MQTT ke format DeteksiItem
  const transformGunshotData = useCallback((mqttData: any): DeteksiItem => {
    const detectionId = Math.floor((mqttData.created_at || Date.now()/1000) * 1000);
    
    return {
      action: mqttData.action || 'DETECTED',
      altitude: 0,
      created_at: mqttData.created_at || Math.floor(Date.now()/1000),
      direction: mqttData.direction || 0,
      distance: 0,
      id_deteksi: detectionId,
      id_operasi: parseInt(idOperasi || '0'),
      id_radar: 0,
      keterangan: mqttData.keterangan || 'Gunshot',
      latitude: 0,
      longitude: 0,
      tracker: []
    };
  }, [idOperasi]);

  // Function untuk load data dari API
  const loadDataFromAPI = useCallback(async () => {
    if (!idOperasi) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchCurrentOperasi(parseInt(idOperasi));
      
      if (data.status === 'error') {
        setError('Gagal mengambil data dari server');
        return;
      }
      
      // Filter data yang lebih baru dari last load time untuk menghindari duplikasi
      const newData = data.deteksi.filter((item: DeteksiItem) => 
        item.created_at > lastApiLoadTime.current
      );
      
      if (newData.length > 0) {
        setDeteksi(prev => {
          // Gabungkan data baru dengan data existing, hindari duplikasi
          const existingIds = new Set(prev.map(item => item.id_deteksi));
          const filteredNewData = newData.filter((item: DeteksiItem) => 
            !existingIds.has(item.id_deteksi)
          );
          
          return [...filteredNewData, ...prev].slice(0, 100);
        });
        
        lastApiLoadTime.current = Math.max(...newData.map((item: DeteksiItem) => item.created_at));
      }
      
    } catch (err) {
      console.error("Gagal mengambil data deteksi:", err);
      setError('Gagal mengambil data deteksi');
    } finally {
      setIsLoading(false);
    }
  }, [idOperasi]);

  // Function untuk refresh data (bisa dipanggil dari luar)
  const refreshData = useCallback(async () => {
    lastApiLoadTime.current = 0; // Reset untuk load ulang semua data
    processedGunshotIds.current.clear();
    await loadDataFromAPI();
  }, [loadDataFromAPI]);

  // Load data awal dari API
  useEffect(() => {
    loadDataFromAPI();
  }, [loadDataFromAPI]);

  // Tambahkan data MQTT real-time
  useEffect(() => {
    if (gunshot && idOperasi) {
      const detectionId = Math.floor((gunshot.created_at || Date.now()/1000) * 1000);
      
      // Cek apakah gunshot ini sudah diproses
      if (processedGunshotIds.current.has(detectionId)) {
        return;
      }
      
      const newDetection = transformGunshotData(gunshot);
      
      setDeteksi(prev => {
        // Cek apakah detection dengan ID yang sama sudah ada
        const existingIds = new Set(prev.map(item => item.id_deteksi));
        if (existingIds.has(newDetection.id_deteksi)) {
          return prev;
        }
        
        // Tambahkan ke set processed IDs
        processedGunshotIds.current.add(detectionId);
        
        // Tambahkan detection baru di awal array
        return [newDetection, ...prev].slice(0, 100);
      });
      
      // Reset gunshot setelah diproses
      resetGunshot();
    }
  }, [gunshot, idOperasi, transformGunshotData, resetGunshot]);

  // Polling untuk update data dari API secara berkala (opsional)
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
      setDeteksi([]);
      setError(null);
      lastApiLoadTime.current = 0;
      processedGunshotIds.current.clear();
    }
  }, [idOperasi]);

  return (
    <DeteksiContext.Provider value={{ 
      deteksi, 
      setDeteksi, 
      isLoading, 
      error, 
      refreshData 
    }}>
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
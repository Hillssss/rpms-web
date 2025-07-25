"use client";
import { useState, useEffect } from "react";
import {
  connectOperasi,
  disconnectOperasi,
  selesaiOperasi,
  startGunshot, 
  stopGunshot
} from "@/lib/api";
import { useOperasi } from "@/contexts/OperasiContext";
import { toast } from "sonner";
import { useMqtt } from "@/contexts/MqttContext";
import { fetchCurrentOperasi } from "@/lib/api"; // ⬅️
import { fetchKoneksiState } from "@/lib/api";

export const useRadarConnect = () => {
  const {
    radar,
    idOperasi,
    isStarted,
    isConnected,
    setConnected,
    setStarted,
  } = useOperasi();

   const { refreshSignal } = useMqtt();
  const [isLoading, setIsLoading] = useState(false);

  const toggleConnection = async () => {
    if (!isStarted) {
      toast.warning("Operasi belum dimulai");
      return;
    }

    setIsLoading(true);

    try {
      if (!isConnected) {
        const res = await connectOperasi(radar.latitude, radar.longitude);
        if (res.status === 200) {
          await startGunshot();
          setConnected(true);
          
        }
      } else {
        const res = await disconnectOperasi();
        if (res.status === 200) {
           await stopGunshot();
          setConnected(false);    
          setStarted(false);      
         

          if (idOperasi) {
            await selesaiOperasi(idOperasi);
           
          }
        }
      }
    } catch (err) {
      console.error("Gagal menghubungkan radar:", err);
      toast.error("Terjadi kesalahan saat menghubungkan radar");
      setConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
  if (!refreshSignal || !idOperasi) return;

  const syncStatus = async () => {
    const connected = await fetchKoneksiState();
    setConnected(connected);
    console.log("[SYNC] isConnected:", connected);

    const result = await fetchCurrentOperasi(Number(idOperasi));
    console.log("[SYNC] fetchCurrentOperasi result:", result);

   const isActive = result.status === 200;
    console.log("[SYNC] isActive (start):", isActive);

    setStarted(isActive);
  };

  syncStatus();
}, [refreshSignal, idOperasi, setConnected, setStarted]);

  
  return {
    isLoading,
    isConnected,
    isOperasiSiap: isStarted,
    toggleConnection,
  };
};

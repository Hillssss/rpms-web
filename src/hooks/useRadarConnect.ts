"use client";
import { useState } from "react";
import {
  connectOperasi,
  disconnectOperasi,
  selesaiOperasi,
} from "@/lib/api";
import { useOperasi } from "@/contexts/OperasiContext";
import { toast } from "sonner";

export const useRadarConnect = () => {
  const {
    radar,
    idOperasi,
    isStarted,
    isConnected,
    setConnected,
  } = useOperasi();

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
          setConnected(true);
          
        }
      } else {
        const res = await disconnectOperasi();
        if (res.status === 200) {
          setConnected(false);
         

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

  return {
    isLoading,
    isConnected,
    isOperasiSiap: isStarted,
    toggleConnection,
  };
};

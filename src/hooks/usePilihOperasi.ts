"use client";

import { useState, useRef } from "react";
import { pindahOperasi, fetchCurrentOperasi } from "@/lib/api";
import { useOperasi } from "@/contexts/OperasiContext";
import { useDeteksi } from "@/contexts/DeteksiContext";
import { toast } from "sonner";

type OperasiItem = {
  id_operasi: number;
  nama_operasi: string;
  radar: {
    latitude: number;
    longitude: number;
  };
  gunshot: {
    latitude: number;
    longitude: number;
  };
};

const usePilihOperasi = (onSuccess?: () => void) => {
  const [selectingId, setSelectingId] = useState<number | null>(null);
  const { setOperasi, setStarted } = useOperasi();
  const { setDeteksi } = useDeteksi(); // ✅ ganti dari setDataDeteksi ke setDeteksi
  const effectRan = useRef(false); // Tambahkan ini

  const handlePilihOperasi = async (item: OperasiItem) => {
      if (effectRan.current) return; // Tambahkan pengecekan
    effectRan.current = true;
    setSelectingId(item.id_operasi);
    try {
      await pindahOperasi(item.id_operasi);

      setOperasi({
        namaOperasi: item.nama_operasi,
        idOperasi: String(item.id_operasi),
        radar: {
          latitude: String(item.radar.latitude),
          longitude: String(item.radar.longitude),
          altitude: "",
        },
        gunshot: {
          latitude: String(item.gunshot.latitude),
          longitude: String(item.gunshot.longitude),
          altitude: "",
        },
        activate: true,
      });

      setStarted(true);

      // ✅ Ambil data deteksi dari API dan update context
      const result = await fetchCurrentOperasi(item.id_operasi);
      setDeteksi(result.deteksi ?? []); // ambil hanya array `deteksi`

      toast.success("Operasi berhasil dipilih");
      onSuccess?.();
    } catch (err) {
      console.error("Gagal memilih operasi:", err);
      toast.error("Gagal memilih operasi");
    } finally {
      setSelectingId(null);
    }
  };

  return { handlePilihOperasi, selectingId };
};

export default usePilihOperasi;

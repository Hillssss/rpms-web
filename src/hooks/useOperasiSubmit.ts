"use client";

import { useOperasi } from "../contexts/OperasiContext";
import { startOperasi, pindahOperasi } from "@/lib/api";
import { toast } from "sonner";

export const useOperasiSubmit = (onSuccess?: () => void) => {
  const { namaOperasi, radar, gunshot, setOperasi, setStarted, setActivate } = useOperasi();

  const handleSubmit = async () => {
    if (!namaOperasi || namaOperasi.trim() === "") {
     toast.error("NAMA OPERASI KOSONG", {
        description: "Silakan isi nama operasi sebelum melanjutkan.",
      });
      return;
    }

    console.log("[Submit] Mulai membuat operasi...");

    try {
      const response = await startOperasi({
        nama_operasi: namaOperasi,
        radar,
        gunshot,
      });

      console.log("[Submit] Response dari startOperasi:", response);

      const data = response?.data?.data;

      if (data?.id_operasi) {
        console.log("[Submit] ID Operasi:", data.id_operasi);
        console.log("[Submit] Activate (awal):", data.activate);

        setOperasi({
          idOperasi: String(data.id_operasi),
          activate: data.activate ?? false,
        });

        setStarted(true);
        

        // 🔥 Kirim ke endpoint pindahOperasi
        console.log("[Submit] Mengirim ke endpoint pindahOperasi...");
        const pindahRes = await pindahOperasi(data.id_operasi);

        console.log("[Submit] Response dari pindahOperasi:", pindahRes);

        if (pindahRes?.data?.data === true) {
          setActivate(true);
          toast.success(pindahRes.data.message || "Operasi berhasil diaktifkan");
        } else {
          toast.error("Gagal mengaktifkan operasi.");
        }

        onSuccess?.();
      } else {
        toast.error("Gagal mengambil ID operasi dari response.");
      }
    } catch (error) {
      console.error("[Submit] Error saat mengirim data operasi:", error);
      toast.error("Gagal mengirim data operasi.");
    }
  };

  return { handleSubmit };
};

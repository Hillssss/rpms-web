"use client";

import { useOperasi } from "../contexts/OperasiContext";
import { startOperasi, pindahOperasi } from "@/lib/api";
import { toast } from "sonner";

export const useOperasiSubmit = (onSuccess?: () => void) => {
  const {
    namaOperasi,
    inputRadar,
    inputGunshot,
    setOperasi,
    setStarted,
    setActivate,
    setInputRadar,
    setInputGunshot,
  } = useOperasi();

  

  const handleSubmit = async () => {
    if (
      !inputRadar.latitude ||
      !inputRadar.longitude ||
      !namaOperasi.trim()
    ) {
      toast.error("Harap lengkapi nama operasi dan koordinat radar");
      return;
    }

    // Simpan input manual ke state utama
    setOperasi({
      radar: inputRadar,
      gunshot: inputGunshot,
      namaOperasi,
    });

    console.log("[Submit] Mulai membuat operasi...");

    try {
      const response = await startOperasi({
        nama_operasi: namaOperasi,
        radar: inputRadar,
        gunshot: inputGunshot,
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

        console.log("[Submit] Mengirim ke endpoint pindahOperasi...");
        const pindahRes = await pindahOperasi(data.id_operasi);

        console.log("[Submit] Response dari pindahOperasi:", pindahRes);

        if (pindahRes?.data?.data === true) {
          setActivate(true);
          toast.success(pindahRes.data.message || "Operasi berhasil diaktifkan");

          // ✅ Reset input manual setelah berhasil
          setInputRadar({ latitude: "", longitude: "", altitude: "" });
          setInputGunshot({ latitude: "", longitude: "", altitude: "" });
          setOperasi({ namaOperasi: "" });

          onSuccess?.();
        } else {
          toast.error("Gagal mengaktifkan operasi.");
        }
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


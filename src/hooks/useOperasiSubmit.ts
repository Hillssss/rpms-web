"use client";

import { useOperasi } from "../contexts/OperasiContext";
import { startOperasi } from "@/lib/api";
import { toast } from "sonner";

export const useOperasiSubmit = (onSuccess?: () => void) => {
  const { namaOperasi, radar, gunshot, setOperasi, setStarted } = useOperasi();

  const handleSubmit = async () => {
    if (!namaOperasi || namaOperasi.trim() === "") {
      toast.error("NAMA TIDAK BOLEH KOSONG!");
      return;
    }

    try {
      const response = await startOperasi({
        nama_operasi: namaOperasi,
        radar,
        gunshot,
      });

      const idOperasi = response?.data?.data?.id_operasi;
      if (idOperasi) {
        setOperasi({ idOperasi }); // simpan ke context
        setStarted(true);
        toast.success("Operasi berhasil dimulai!");
        onSuccess?.();
      } else {
        toast.error("Gagal mengambil ID operasi dari response.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengirim data operasi.");
    }
  };

  return { handleSubmit };
};

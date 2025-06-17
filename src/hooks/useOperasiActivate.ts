"use client";

import { useOperasi } from "@/contexts/OperasiContext";
import { pindahOperasi } from "@/lib/api";
import { toast } from "sonner";

export const useOperasiActive = () => {
  const { idOperasi, setActivate } = useOperasi();

  const activateOperasi = async () => {
    if (!idOperasi) {
      toast.error("ID operasi tidak ditemukan.");
      return;
    }

    try {
      const response = await pindahOperasi(idOperasi);
      const isSuccess = response?.data?.data;

      if (isSuccess) {
        setActivate(true); // update context
        toast.success("Operasi berhasil diaktifkan!");
      } else {
        toast.error("Gagal mengaktifkan operasi.");
      }
    } catch (err) {
      console.error("Gagal mengaktifkan operasi:", err);
      toast.error("Terjadi kesalahan saat mengaktifkan operasi.");
    }
  };

  return {
    activateOperasi,
  };
};

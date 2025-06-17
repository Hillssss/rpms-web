// hooks/useRiwayatOperasi.ts
import { useEffect, useState } from "react";
import { fetchRiwayatOperasi } from "@/lib/api";

type OperasiItem = {
  id_operasi: number;
  nama_operasi: string;
  activate: boolean;
  radar: {
    latitude: number;
    longitude: number;
  };
  gunshot: {
    latitude: number;
    longitude: number;
  };
  waktu_mulai: number;
  waktu_selesai: number;
};

const formatUnixToDateTime = (unix: number) => {
  const date = new Date(unix * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const useRiwayatOperasi = () => {
  const [data, setData] = useState<OperasiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRiwayat = async () => {
      try {
        const res = await fetchRiwayatOperasi();
        const parsed = Object.values(res) as OperasiItem[];
        setData(parsed);
      } catch (err) {
        console.error("Gagal mengambil data riwayat:", err);
      } finally {
        setLoading(false);
      }
    };

    getRiwayat();
  }, []);

  return { data, loading, formatUnixToDateTime };
};

export default useRiwayatOperasi;
"use client";


import { useEffect, useState } from "react";
import { fetchRiwayatOperasi } from "@/lib/api";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OperasiItem = {
  id_operasi: number;
  nama_operasi: string;
  radar: {
    latitude: number;
    longitude: number;
  };
  waktu_mulai: number;
  waktu_selesai: number;
};

const ContentRiwayat = () => {
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

  const formatUnixToDateTime = (unix: number) => {
  const date = new Date(unix * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
    return (
  <div className="border border-white rounded-md p-4 bg-[#1a1a1a]">
    {/* Scroll vertikal bila lebih dari 10 row */}
    <div className="w-full overflow-x-auto">
      <div className="max-h-[320px] overflow-y-auto"> {/* <= tinggi 10 row-an */}
        <Table>
          <TableHeader className="bg-white text-black whitespace-nowrap text-center">
            <TableRow>
              <TableHead className="min-w-[60px] text-center">Id</TableHead>
              <TableHead className="min-w-[160px] text-center">Nama Operasi</TableHead>
              <TableHead className="min-w-[180px] text-center">Koordinat</TableHead>
              <TableHead className="min-w-[180px] text-center">Waktu Mulai</TableHead>
              <TableHead className="min-w-[180px] text-center">Waktu Selesai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id_operasi} className="text-white text-center">
                  <TableCell className="text-center">{item.id_operasi}</TableCell>
                  <TableCell className="text-center">{item.nama_operasi}</TableCell>
                  <TableCell className="text-center">
                    {item.radar?.latitude != null && item.radar?.longitude != null
                      ? `${item.radar.latitude.toFixed(6)}, ${item.radar.longitude.toFixed(6)}`
                      : "–"}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatUnixToDateTime(item.waktu_mulai)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatUnixToDateTime(item.waktu_selesai)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
);

};

export default ContentRiwayat;
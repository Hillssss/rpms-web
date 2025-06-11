"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dummyData = [
  {
    id: 1,
    nama: "Operasi A",
    koordinat: "-6.200, 106.816",
    mulai: "2025-06-08 12:00",
    selesai: "2025-06-08 14:00",
  },
  {
    id: 2,
    nama: "Operasi B",
    koordinat: "-6.210, 106.822",
    mulai: "2025-06-08 15:00",
    selesai: "2025-06-08 17:00",
  },
];

const ContentRiwayat = () => {
    return (
        <div className="border border-white rounded-md p-4 bg-[#1a1a1a]">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-white text-black whitespace-nowrap">
            <TableRow>
              <TableHead className="min-w-[60px]">Id</TableHead>
              <TableHead className="min-w-[160px]">Nama Operasi</TableHead>
              <TableHead className="min-w-[180px]">Koordinat</TableHead>
              <TableHead className="min-w-[180px]">Waktu Mulai</TableHead>
              <TableHead className="min-w-[180px]">Waktu Selesai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyData.length > 0 ? (
              dummyData.map((item) => (
                <TableRow key={item.id} className="text-white">
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.koordinat}</TableCell>
                  <TableCell>{item.mulai}</TableCell>
                  <TableCell>{item.selesai}</TableCell>
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
    );
};

export default ContentRiwayat;
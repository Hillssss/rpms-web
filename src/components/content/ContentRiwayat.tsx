"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import useRiwayatOperasi from "@/hooks/useRiwayatOperasi";
import usePilihOperasi from "@/hooks/usePilihOperasi";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useOperasi } from "@/contexts/OperasiContext";

interface ContentRiwayatProps {
  onSelect?: () => void;
}

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

const ContentRiwayat = ({ onSelect }: ContentRiwayatProps) => {
  const { data, loading, formatUnixToDateTime } = useRiwayatOperasi();
  const { handlePilihOperasi, selectingId } = usePilihOperasi(onSelect);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOperasi, setSelectedOperasi] = useState<OperasiItem | null>(null);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const { 
    isConnected, 
    activate, 
    setConnected, 
    setActivate,
    namaOperasi,
    setOperasi
  } = useOperasi();

  const handleSelectClick = (item: OperasiItem) => {
    if (isConnected || activate) {
      setSelectedOperasi(item);
      setDisconnectDialogOpen(true);
    } else {
      setSelectedOperasi(item);
      setDialogOpen(true);
    }
  };

  const handleConfirmSelect = async () => {
    if (selectedOperasi) {
      await handlePilihOperasi(selectedOperasi);
      setDialogOpen(false);
    }
  };

  const handleDisconnectAndSelect = async () => {
    // Proses disconnect
    setConnected(false);
    setActivate(false);
    
    // Reset state operasi
    setOperasi({
      namaOperasi: "",
      idOperasi: "",
      radar: { latitude: "", longitude: "", altitude: "" },
      gunshot: { latitude: "", longitude: "", altitude: "" },
      activate: false
    });

    // Jika ada operasi yang dipilih, pilih operasi baru
    if (selectedOperasi) {
      await handlePilihOperasi(selectedOperasi);
    }
    setDisconnectDialogOpen(false);
  };

  return (
    <div className="border border-white rounded-md p-4 bg-[#1a1a1a]">
      <div className="w-full overflow-x-auto">
        <div className="max-h-[320px] overflow-y-auto">
          <Table>
            <TableHeader className="bg-white text-black whitespace-nowrap text-center">
              <TableRow>
                <TableHead className="min-w-[40px] text-center">Id</TableHead>
                <TableHead className="min-w-[160px] text-center">Nama Operasi</TableHead>
                <TableHead className="min-w-[100px] text-center">Pilih Operasi</TableHead>
                <TableHead className="min-w-[180px] text-center">Koordinat</TableHead>
                <TableHead className="min-w-[180px] text-center">Waktu Mulai</TableHead>
                <TableHead className="min-w-[180px] text-center">Waktu Selesai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400">
                    Memuat...
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id_operasi} className="text-white text-center">
                    <TableCell>{item.id_operasi}</TableCell>
                    <TableCell>{item.nama_operasi}</TableCell>
                    <TableCell>
                      <Button
                        variant={
                          item.activate 
                            ? "default" 
                            : isConnected 
                              ? "outline" 
                              : "secondary"
                        }
                        className={
                          item.activate
                            ? "bg-green-600 hover:bg-green-700"
                            : isConnected
                              ? "cursor-not-allowed opacity-75 text-black"
                              : "hover:bg-blue-700"
                        }
                        onClick={() => handleSelectClick(item)}
                        disabled={item.activate || selectingId === item.id_operasi || isConnected}
                      >
                        {selectingId === item.id_operasi ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Memilih...
                          </span>
                        ) : item.activate ? (
                          "Aktif"
                        ) : isConnected ? (
                          "Select"
                        ) : (
                          "Select"
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {item.radar?.latitude != null && item.radar?.longitude != null
                        ? `${item.radar.latitude.toFixed(6)}, ${item.radar.longitude.toFixed(6)}`
                        : "–"}
                    </TableCell>
                    <TableCell>{formatUnixToDateTime(item.waktu_mulai)}</TableCell>
                    <TableCell>{formatUnixToDateTime(item.waktu_selesai)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog Konfirmasi Pilih Operasi */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pilihan Operasi</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin memilih operasi: <strong>{selectedOperasi?.nama_operasi}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSelect}
              disabled={selectingId !== null}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {selectingId === selectedOperasi?.id_operasi ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Konfirmasi"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Konfirmasi Disconnect */}
      <AlertDialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader >
            <AlertDialogTitle>Sedang Terhubung <strong>{namaOperasi}</strong>.</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin memilih operasi: <strong>{selectedOperasi?.nama_operasi}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnectAndSelect}
              className="bg-red-600 hover:bg-red-700"
            >
              Konfirmasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentRiwayat;
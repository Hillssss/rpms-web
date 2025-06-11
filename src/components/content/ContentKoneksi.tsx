"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ContentKoneksi = () => {
    const [ip, setIp] = useState("");
  const [error, setError] = useState("");

  const validateIp = (value: string) => {
    const parts = value.split(".");
    if (parts.length !== 4) return false;
    return parts.every((part) => {
      const num = Number(part);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  };

  const handleCheck = () => {
    if (validateIp(ip)) {
      setError("");
      alert(`IP Address valid: ${ip}`);
      // lanjutkan proses cek koneksi
    } else {
      setError("IP Address tidak valid.");
    }
  };

    return(
         <div className="max-h-[50vh] overflow-y-auto pr-2">
    <div className="space-y-6">
        <div className="border border-gray-700 p-6">
               <div className="mb-2">
        <Label className="text-black text-md">Setting Kamera</Label>
      </div>
  <div className="flex gap-4 items-end">
  <div className="flex-1">
    <Label className="text-black text-md">URL WEBSOCKET</Label>
    <Input className="bg-[#2d3748] border-gray-700 text-white mt-2" />
  </div>
  <div className="w-[180px]">
    <Label className="text-black text-md">Cek Koneksi dari Kamera</Label>
    <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white mt-2">
      Cek Koneksi
    </Button>
  </div>
</div>
        </div>
         <div className="border border-gray-700 p-6">
               <div className="mb-2">
        <Label className="text-black text-md">Jaringan Server</Label>
      </div>
  <div className="flex gap-4 items-end">
  <div className="flex-1">
    <Label className="text-black text-md">IP Jaringan</Label>
     <Input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.1"
            className="bg-[#2d3748] border-gray-700 text-white mt-2 text-center"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
    <div className="flex-1">
   <Input className="bg-[#2d3748] border-gray-700 text-white mt-2 text-center" />
  </div>

</div>
<div>
            <Button
          onClick={handleCheck}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white mt-2"
        >
          Cek Koneksi
        </Button>

  </div>
        </div>
        </div>
    </div>
    );
};

export default ContentKoneksi;
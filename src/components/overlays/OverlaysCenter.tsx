"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OverlaysCenter = () => {
  return (
    <div className="absolute top-8 sm:top-8 md:top-4 left-1/2 -translate-x-1/2 z-10 p-4 rounded-md bg-transparent">
      <div className="grid grid-cols-9 gap-3 text-[clamp(0.7rem,2vw,0.875rem)] font-semibold text-white text-center">
  {/* Baris 1 */}
  <div className="bg-black bg-opacity-60 px-2 py-1 rounded">LAT</div>
  <div className="bg-black bg-opacity-60 px-2 py-1 rounded col-span-2 text-center">-</div>
  <div className="bg-black bg-opacity-60 px-2 py-1 rounded">LONG</div>
  <div className="bg-black bg-opacity-60 px-2 py-1 rounded col-span-2 text-center">-</div>
  <div className="bg-black bg-opacity-60 px-2 py-1 rounded">ALT</div>
  <div className="bg-black bg-opacity-60 px-2 py-1 rounded col-span-2 text-center">-</div>

  {/* Baris 2 */}
  <div className="bg-black bg-opacity-60 px-2 py-1 rounded">-</div>
  <div className="bg-black bg-opacity-60 px-2 py-1 rounded col-span-2 text-center">-</div>
  <div className="bg-black bg-opacity-60 px-2 py-1 rounded">-</div>
  <div className="bg-black bg-opacity-60 px-2 py-1 rounded col-span-2 text-center">-</div>

  {/* Dropdown */}
  <div className="col-span-3">
    <Select defaultValue="geo">
      <SelectTrigger className="w-full h-full bg-indigo-700 text-white font-bold text-sm rounded-md flex items-center justify-center">
        <SelectValue placeholder="Pilih Mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="geo">GEO</SelectItem>
        <SelectItem value="utm">UTM</SelectItem>
        <SelectItem value="mgrs">MGRS</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
    </div>
  );
};

export default OverlaysCenter;

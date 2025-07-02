"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import * as utm from "utm";

type OverlaysCenterProps = {
  lat?: number;
  lng?: number;
};

const toDMS = (deg: number) => {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
  return `${degrees}° ${minutes}' ${seconds}"`;
};

const OverlaysCenter = ({ lat, lng }: OverlaysCenterProps) => {
  const [mode, setMode] = useState<"geo" | "utm" | "DMS">("geo");

  const renderCoordinates = () => {
  if (lat === undefined || lng === undefined) return ["-", "-", "-"];

  switch (mode) {
    case "geo":
      return [lat.toFixed(6), lng.toFixed(6), "-"];
    case "utm": {
      const { easting, northing, zoneNum, zoneLetter } = utm.fromLatLon(lat, lng);
      return [
        `${easting.toFixed(2)} E`,
        `${northing.toFixed(2)} N`,
        `${zoneNum}${zoneLetter}`,
      ];
    }
    case "DMS":
      return [toDMS(lat), toDMS(lng), "-"];
    default:
      return ["-", "-", "-"];
  }
};

const labelsByMode: Record<"geo" | "utm" | "DMS", [string, string, string]> = {
  geo: ["LAT", "LONG", "ALT"],
  utm: ["X", "Y", "ZONE"],
  DMS: ["LAT", "LONG", "ALT"],
};

const [val1, val2, val3] = renderCoordinates();
const [label1, label2, label3] = labelsByMode[mode];

  return (
    <div className="absolute top-8 sm:top-8 md:top-4 left-1/2 -translate-x-1/2 z-10 px-4 w-[95vw] max-w-3xl">
      <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 sm:gap-3 text-[clamp(0.6rem,2vw,0.875rem)] font-semibold text-white text-center">
       {/* Baris 1 */}
        <div className="bg-black bg-opacity-60 px-2 py-1 rounded truncate">{label1}</div>
        <div className="bg-black bg-opacity-60 px-2 py-1 rounded col-span-2 truncate">{val1}</div>

        <div className="bg-black bg-opacity-60 px-2 py-1 rounded truncate">{label2}</div>
        <div className="bg-black bg-opacity-60 px-2 py-1 rounded col-span-2 truncate">{val2}</div>

        <div className="bg-black bg-opacity-60 px-2 py-1 rounded truncate">{label3}</div>
        <div className="bg-black bg-opacity-60 px-2 py-1 rounded col-span-2 truncate">{val3}</div>

        {/* Baris 2 */}
        <div className="bg-black bg-opacity-60 px-2 py-1 rounded truncate">-</div>
        <div className="bg-black bg-opacity-60 px-2 py-1 rounded col-span-2 truncate">-</div>
        <div className="bg-black bg-opacity-60 px-2 py-1 rounded truncate">-</div>
        <div className="bg-black bg-opacity-60 px-2 py-1 rounded col-span-2 truncate">-</div>

        {/* Dropdown */}
        <div className="col-span-3 sm:col-span-3">
          <Select defaultValue="geo" onValueChange={(val) => setMode(val as any)}>
            <SelectTrigger className="w-full h-full bg-indigo-700 text-white font-bold text-[clamp(0.65rem,2vw,0.875rem)] rounded-md flex items-center justify-center">
              <SelectValue placeholder="Pilih Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geo">GEO</SelectItem>
              <SelectItem value="utm">UTM</SelectItem>
              <SelectItem value="DMS">DMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default OverlaysCenter;

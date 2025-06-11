"use client";

import { FaBroadcastTower, FaSyncAlt } from "react-icons/fa";
import MapBox from "@/components/MapBox";

export default function Home() {
  return (
    <main className="relative w-full h-full">
  {/* Map */}
  <div className="h-full w-full z-0">
    <MapBox />
  </div>

  {/* Overlay kiri */}
  <div className="absolute top-24 sm:top-24 md:top-16 left-4 w-fit min-w-[200px] max-w-sm bg-gray-200 text-black rounded-md p-4 z-10 space-y-3">
    {/* Status ODS */}
    <div className="bg-gray-400 rounded-md p-3 flex items-center space-x-3 w-full">
      <div className="bg-white rounded-full p-2 flex-shrink-0">
        {/* Ikon responsive dengan clamp */}
        <FaBroadcastTower className="text-gray-700" style={{ width: "clamp(1.5rem, 6vw, 2.5rem)", height: "clamp(1.5rem, 6vw, 2.5rem)" }} />
      </div>
      {/* Teks responsive */}
      <div className="text-white font-bold leading-tight text-[clamp(0.75rem,3vw,1rem)]">
        ODS BELUM<br />TERHUBUNG
      </div>
    </div>
  </div>
  
</main>
  );
}

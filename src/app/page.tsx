"use client";

import { FaBroadcastTower, FaSyncAlt } from "react-icons/fa";
import MapBox from "@/components/MapBox";
import OverlaysLeft from "@/components/overlays/OverlaysLeft";
import OverlaysCenter from "@/components/overlays/OverlaysCenter";
import OverlaysRight from "@/components/overlays/OverlaysRight";

export default function Home() {
  return (
    <main className="relative w-full h-full">
  {/* Map */}
  <div className="h-full w-full z-0">
    <MapBox />
  </div>

    <OverlaysLeft />
    <OverlaysCenter />
    <OverlaysRight />
  
</main>
  );
}

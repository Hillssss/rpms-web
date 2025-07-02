"use client";

import { useEffect, useState } from "react";
import OverlaysLeft from "@/components/overlays/OverlaysLeft";
import OverlaysCenter from "@/components/overlays/OverlaysCenter";
import OverlaysRight from "@/components/overlays/OverlaysRight";
import MapBox from "@/components/MapBox";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentOverlay, setCurrentOverlay] = useState<"left" | "center" | "right">("center");
  const [clickedLatLng, setClickedLatLng] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderOverlays = () => (
    <>
      <div className={`${currentOverlay === "left" ? "block" : "hidden"}`}>
        <OverlaysLeft />
      </div>
      <div className={`${currentOverlay === "center" ? "block" : "hidden"}`}>
        <OverlaysCenter lat={clickedLatLng?.lat} lng={clickedLatLng?.lng} />
      </div>
      <div className={`${currentOverlay === "right" ? "block" : "hidden"}`}>
        <OverlaysRight />
      </div>
    </>
  );

  return (
    <main className="relative w-full h-full">
      <div className="h-full w-full z-0 touch-auto">
        <MapBox onClickCoordinate={setClickedLatLng} />
      </div>

      {isMobile ? (
        <>
          <div className="absolute top-0 left-0 right-0 z-10 p-2">
            {renderOverlays()}
          </div>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-3 z-10">
            {["left", "center", "right"].map((pos) => (
              <button
                key={pos}
                onClick={() => setCurrentOverlay(pos as "left" | "center" | "right")}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentOverlay === pos ? "bg-white scale-110" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <OverlaysLeft />
          <OverlaysCenter lat={clickedLatLng?.lat} lng={clickedLatLng?.lng} />
          <OverlaysRight />
        </>
      )}
    </main>
  );
}


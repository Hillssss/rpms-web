"use client";

import { useOverlaysLeft } from "@/hooks/useOverlaysLeft";
import { FaBroadcastTower } from "react-icons/fa";
import { RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";

const OverlaysLeft = () => {
  const {
    showOdsContent,
    setShowOdsContent,
    selectedItem,
    setSelectedItem,
    detectionData, // ✅ pakai ini
  } = useOverlaysLeft();

  const getSourceType = (id_radar: number) => {
    return id_radar === 0 ? "Manusia" : "Kendaraan";
  };

  return (
    <>
      {/* Status ODS */}
      <div className="absolute top-4 left-4 w-[280px] z-20">
        <div className="bg-gray-400 rounded-md p-3 flex items-center space-x-3 justify-center">
          <div className="bg-white rounded-full p-2 flex-shrink-0">
            <FaBroadcastTower
              className="text-gray-700"
              style={{
                width: "clamp(1.5rem, 6vw, 2.5rem)",
                height: "clamp(1.5rem, 6vw, 2.5rem)",
              }}
            />
          </div>
          <div className="text-white font-bold leading-tight text-[clamp(0.75rem,3vw,1rem)]">
            ODS BELUM<br />TERHUBUNG
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="absolute top-24 left-4 w-[280px] bg-black/80 text-white rounded-md p-2 z-10 space-y-2 mt-2">
        <button
          onClick={() => setShowOdsContent(!showOdsContent)}
          className="w-full relative bg-[#2e2e4e] text-sm font-bold py-1 rounded flex items-center justify-center px-2"
        >
          <span>DATA DETEKSI ODS ({detectionData.length})</span>
          <div className="absolute right-2">
            {showOdsContent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showOdsContent && (
          <>
            {selectedItem && (
              <div className="border border-lime-400 p-2 rounded-sm text-[0.4rem] leading-tight space-y-1 bg-[#2d2d2d]">
                <div className="flex justify-between items-center font-bold text-xs">
                  <span>{selectedItem.id}</span>
                  <span>{selectedItem.distance}</span>
                  <span>{selectedItem.time}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{selectedItem.angle}</span>
                  <span>{getSourceType(selectedItem.id_radar)}</span>
                </div>
                <div className="text-xs text-center">
                  lat: {selectedItem.latitude}, lon: {selectedItem.longitude}
                </div>
              </div>
            )}

            {/* List of Detections */}
            <div className="bg-[#1e1e1e] max-h-40 overflow-y-auto rounded-sm border border-neutral-700">
              {detectionData.length === 0 ? (
                <div className="p-2 text-center text-xs text-gray-400">
                  Tidak ada deteksi
                </div>
              ) : (
                detectionData.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 border-b border-neutral-700 text-xs text-white hover:bg-neutral-800 cursor-pointer ${
                      selectedItem?.id === item.id ? "bg-neutral-700" : ""
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex justify-between items-center font-bold text-xs">
                      <span>{item.id}</span>
                      <span>{item.distance}</span>
                      <span>{item.time}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>{item.angle}</span>
                      <span>{getSourceType(item.id_radar)}</span>
                    </div>
                    <div className="text-xs text-center">
                      lat: {item.latitude}, lon: {item.longitude}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Gunshot Placeholder */}
            <div className="flex items-center justify-center bg-[#2e2e4e] text-white font-bold text-sm rounded px-2 py-1 h-8 text-center">
              <RefreshCcw className="w-4 h-4 mr-2" />
              DATA DETEKSI GUNSHOT (0)
            </div>

            <div className="bg-[#1e1e1e] max-h-40 overflow-y-auto rounded-sm border border-neutral-700">
              <div className="p-2 text-center text-xs text-gray-400">
                Belum ada data gunshot
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OverlaysLeft;

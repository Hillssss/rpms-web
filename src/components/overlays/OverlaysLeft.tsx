"use client";

import { useOverlaysLeft } from "@/hooks/useOverlaysLeft";
import { useOperasi } from "@/contexts/OperasiContext";
import { FaBroadcastTower } from "react-icons/fa";
import { RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";

const OverlaysLeft = () => {
  const { idOperasi } = useOperasi(); // ✅ Ambil idOperasi

  // ⛔️ Kalau belum pilih operasi, jangan render apa-apa


  const {
    showOdsContent,
    setShowOdsContent,
    selectedItem,
    selectItem,
    detectionData,
    gunshotData,
    isLoading,
    error,
    refreshData,
    totalDetections,
    hasData,
  } = useOverlaysLeft();

    if (!idOperasi) return null;

  const getSourceType = (id_radar: number) => {
    return id_radar === 0 ? "Manusia" : "Kendaraan";
  };

  const formatGunshotId = (item: any) => {
    if (item.source === "gunshot") {
      if (item.id_radar === 0 && !item.caliber) {
        return `GS-${new Date(item.created_at * 1000).toLocaleTimeString("id-ID", {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}`;
      }
      return item.id;
    }
    return item.id;
  };

  const getGunshotLabel = (item: any) => {
    if (item.source === "gunshot") {
      return item.caliber || "GUNSHOT";
    }
    return item.source.toUpperCase();
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
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/70 border border-red-600 p-2 rounded-sm text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-red-200">⚠️ {error}</span>
                  <button
                    onClick={refreshData}
                    className="text-red-200 hover:text-white text-xs underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="bg-blue-900/70 border border-blue-600 p-2 rounded-sm text-xs">
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCcw className="w-3 h-3 animate-spin" />
                  <span className="text-blue-200">Loading data...</span>
                </div>
              </div>
            )}

            {/* Selected Item */}
            {selectedItem && (
              <div className="border border-lime-400 p-2 rounded-sm text-[0.4rem] leading-tight space-y-1 bg-[#2d2d2d]">
                <div className="flex justify-between items-center font-bold text-xs">
                  <span>
                    {selectedItem.source === "gunshot" ? formatGunshotId(selectedItem) : selectedItem.id}
                  </span>
                  <span>{selectedItem.distance}</span>
                  <span>{selectedItem.time}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{selectedItem.angle}</span>
                  <span>
                    {selectedItem.source === "gunshot" ? (
                      <span className="bg-red-600 text-white px-1 rounded text-[10px]">
                        {getGunshotLabel(selectedItem)}
                      </span>
                    ) : (
                      getSourceType(selectedItem.id_radar)
                    )}
                  </span>
                </div>
                <div className="text-xs text-center">
                  {selectedItem.latitude !== "N/A" && selectedItem.longitude !== "N/A" ? (
                    <>lat: {selectedItem.latitude}, lon: {selectedItem.longitude}</>
                  ) : (
                    <span className="text-gray-400">Lokasi: Tidak tersedia</span>
                  )}
                </div>
              </div>
            )}

            {/* Radar Data */}
            <div className="bg-[#1e1e1e] max-h-40 overflow-y-auto rounded-sm border border-neutral-700">
              {detectionData.length === 0 ? (
                <div className="p-2 text-center text-xs text-gray-400">
                  {isLoading ? "Memuat data radar..." : "Tidak ada deteksi radar"}
                </div>
              ) : (
                detectionData.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 border-b border-neutral-700 text-xs text-white hover:bg-neutral-800 cursor-pointer transition-colors ${
                      selectedItem?.id === item.id ? "bg-neutral-700" : ""
                    }`}
                    onClick={() => selectItem(item)}
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

            {/* Gunshot Section */}
            <div className="flex items-center justify-center bg-[#2e2e4e] text-white font-bold text-sm rounded px-2 py-1 h-8 text-center mt-2 relative">
              <RefreshCcw 
                className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} 
                onClick={refreshData}
                style={{ cursor: 'pointer' }}
              />
              <span>DATA DETEKSI GUNSHOT ({gunshotData.length})</span>
              {gunshotData.length > 0 && (
                <div className="absolute right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>

            <div className="bg-[#1e1e1e] max-h-40 overflow-y-auto rounded-sm border border-neutral-700">
              {gunshotData.length === 0 ? (
                <div className="p-2 text-center text-xs text-gray-400">
                  {isLoading ? "Memuat data gunshot..." : "Belum ada data gunshot"}
                </div>
              ) : (
                gunshotData.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 border-b border-neutral-700 text-xs text-white hover:bg-neutral-800 cursor-pointer transition-colors ${
                      selectedItem?.id === item.id ? "bg-neutral-700" : ""
                    }`}
                    onClick={() => selectItem(item)}
                  >
                    <div className="flex justify-between items-center font-bold text-xs">
                      <span>{formatGunshotId(item)}</span>
                      <span>{item.distance}</span>
                      <span>{item.time}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Arah: {item.angle}</span>
                      <span className="bg-red-600 text-white px-1 rounded text-[10px]">
                        {getGunshotLabel(item)}
                      </span>
                    </div>
                    {item.latitude !== "N/A" && item.longitude !== "N/A" ? (
                      <div className="text-xs text-center">
                        lat: {item.latitude}, lon: {item.longitude}
                      </div>
                    ) : (
                      <div className="text-xs text-center text-gray-400">
                        Lokasi: Tidak tersedia
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Stats Summary */}
            {hasData && (
              <div className="bg-[#1a1a1a] p-2 rounded-sm border border-neutral-700 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-green-400">Radar: {detectionData.length}</span>
                  <span className="text-red-400">Gunshot: {gunshotData.length}</span>
                  <span className="text-blue-400">Total: {totalDetections}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OverlaysLeft;

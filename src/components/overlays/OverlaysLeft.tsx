"use client";
import { useState } from "react";
import { FaBroadcastTower } from "react-icons/fa";
import { RefreshCcw } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";

const OverlaysLeft = () => {
  const [showOdsContent, setShowOdsContent] = useState(true);

  return (
    <>
      {/* Status ODS */}
      <div className="absolute top-4 left-4 w-[320px] z-20">
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
      <div className="absolute top-24 left-4 w-[320px] bg-black/80 text-white rounded-md p-2 z-10 space-y-2 mt-2">

        {/* Header Toggle Button */}
       <button
  onClick={() => setShowOdsContent(!showOdsContent)}
  className="w-full relative bg-[#2e2e4e] text-sm font-bold py-1 rounded flex items-center justify-end px-2"
>
  {/* Teks center absolut */}
  <span className="absolute left-1/2 -translate-x-1/2">
    DATA DETEKSI ODS (0)
  </span>
  
  {/* Ikon toggle kanan */}
  {showOdsContent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
</button>


        {/* Toggle Content */}
        {showOdsContent && (
          <>
            <div className="border border-lime-400 p-2 rounded-sm text-[0.75rem] leading-tight space-y-1 bg-[#2d2d2d]">
              <div className="flex justify-between items-center font-bold text-xl">
                <span>17</span>
                <span className="text-sm">533. m</span>
                <span className="text-sm">07:00:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>0°</span>
                <span>Manusia</span>
              </div>
              <div className="text-xs text-center">
                lat: 6° 57 47.3380 S, lon: 107° 42 44.5756 E
              </div>
            </div>

            <div className="bg-[#1e1e1e] max-h-40 overflow-y-auto rounded-sm border border-neutral-700">
              {[...Array(10)].map((_, idx) => (
                <div key={idx} className="p-2 border-b border-neutral-700 text-xs text-white hover:bg-neutral-800 cursor-pointer">
                  
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center bg-[#2e2e4e] text-white font-bold text-sm rounded px-2 py-1 h-8 text-center">
          <RefreshCcw className="w-4 h-4 mr-2" />
          DATA DETEKSI GUNSHOT (0)
        </div>

        <div className="bg-[#1e1e1e] max-h-40 overflow-y-auto rounded-sm border border-neutral-700">
          {[...Array(10)].map((_, idx) => (
            <div key={idx} className="p-2 border-b border-neutral-700 text-xs text-white hover:bg-neutral-800 cursor-pointer">
              
            </div>
          ))}
        </div>
          </>
        )}

        {/* Gunshot Section */}
        
      </div>
    </>
  );
};

export default OverlaysLeft;

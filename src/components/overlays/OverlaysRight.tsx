"use client";

import { Maximize2, Settings } from "lucide-react";
import MapControlCircle from "../MapControlCircle";
import { useState } from "react";

const OverlaysRight = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="absolute top-8 sm:top-8 md:top-4 right-4 z-10 space-y-4">
      {/* Wrapper Frame Cameras + Settings */}
      <div className="bg-transparent p-2 rounded-lg space-y-2">
        {/* Frame Camera 1 */}
        <div className="relative w-[300px] h-[150px] bg-black rounded-md overflow-hidden">
          <button
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded hover:bg-opacity-75"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Frame Camera 2 */}
        <div className="relative w-[300px] h-[150px] bg-black rounded-md overflow-hidden">
          <button
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded hover:bg-opacity-75"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Icon */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white hover:text-gray-300"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Map Control Circle */}
      <div className="flex justify-center">
        <MapControlCircle />
      </div>

      {/* Modal Settings */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            {/* Isi setting-mu di sini */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverlaysRight;

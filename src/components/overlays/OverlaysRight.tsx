"use client";

import { Maximize2, Settings, Bot } from "lucide-react";
import MapControlCircle from "../MapControlCircle";
import { useState } from "react";
import CameraSettingsModal from "../CameraSettingsModal";

const OverlaysRight = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDroneFrame, setShowDroneFrame] = useState(false);

  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
  const [offsetCamera, setOffsetCamera] = useState("0");
  const [elevationCamera, setElevationCamera] = useState("0");
  const [elevationRadar, setElevationRadar] = useState("0");
  const [radarFollowsCamera, setRadarFollowsCamera] = useState(false);

  return (
    <div className="absolute top-6 sm:top-6 md:top-2 right-4 z-10 space-y-4">
      <div className="bg-transparent p-2 rounded-lg space-y-2">
        {/* Frame Camera 1 */}
        <div className="relative w-full max-w-[280px] h-[35vw] md:h-[125px] md:max-h-none max-h-[105px] md:w-[300px] aspect-[2/1] bg-black rounded-md overflow-hidden">
          <button className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded hover:bg-opacity-75" title="Fullscreen">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>


        {/* Frame Camera 2 */}
       <div className="relative w-full max-w-[280px] h-[35vw] md:h-[125px] md:max-h-none max-h-[105px] md:w-[300px] aspect-[2/1] bg-black rounded-md overflow-hidden">
          <button className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded hover:bg-opacity-75" title="Fullscreen">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Buttons: Settings & Drone */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white hover:text-gray-300"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowDroneFrame((prev) => !prev)}
            className={`text-white hover:text-gray-300 transition ${showDroneFrame ? "text-blue-400" : ""}`}
            title="Toggle Drone Frame"
          >
            <Bot className="w-6 h-6" />
          </button>
        </div>

        {/* Frame Drone */}
        {showDroneFrame && (
         <div className="relative w-full max-w-[280px] h-[35vw] md:h-[125px] md:max-h-none max-h-[105px] md:w-[300px] aspect-[2/1] bg-black rounded-md overflow-hidden">
            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded hover:bg-opacity-75"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Map Control Circle */}
      <div className="flex justify-center">
        <MapControlCircle />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CameraSettingsModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedAngle={selectedAngle}
          setSelectedAngle={setSelectedAngle}
          offsetCamera={offsetCamera}
          setOffsetCamera={setOffsetCamera}
          elevationCamera={elevationCamera}
          setElevationCamera={setElevationCamera}
          elevationRadar={elevationRadar}
          setElevationRadar={setElevationRadar}
          radarFollowsCamera={radarFollowsCamera}
          setRadarFollowsCamera={setRadarFollowsCamera}
        />
      )}
    </div>
  );
};

export default OverlaysRight;

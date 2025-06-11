"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ContentRadar = () => {
    const [angle, setAngle] = useState(52.6)

 const max = 360
const step = 0.1

// Untuk tick marks, kita tampilkan tiap 10 derajat
const tickInterval = 10
const ticks = Array.from({ length: max / tickInterval + 1 }, (_, i) => i * tickInterval);

  return (
     <div className="max-h-[50vh] overflow-y-auto pr-2">
    <div className="space-y-6">
        <div className="border border-gray-700 p-6">
      <h2 className="text-lg font-semibold mb-2 text-center">Setting Radar</h2>

      <div className="mb-6">
        <Label className="text-black text-md">Sudut</Label>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-full">
          <Slider
            defaultValue={[angle]}
            max={max}
            step={step}
            className="mb-2"
            onValueChange={(val) => setAngle(val[0])}
          />

          {/* Tick marks */}
          <div className="w-full h-4 flex justify-between items-end mb-4">
                {ticks.map((tick, idx) => (
                    <div
                    key={idx}
                    className="w-px h-3 bg-black"
                    style={{ flex: "0 0 auto" }}
                    />
                ))}
                </div>
        </div>

        <div className="w-[60px] text-right text-black font-mono">
          {angle.toFixed(1)}°
        </div>
      </div>

     <div className="flex gap-4 items-end">
  <div className="flex-1">
    <Label className="text-black text-md">URL WEBSOCKET</Label>
    <Input className="bg-[#2d3748] border-gray-700 text-white mt-2" />
  </div>
  <div className="w-[180px]">
    <Label className="text-black text-md">Cek Koneksi dari Radar</Label>
    <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white mt-2">
      Cek Koneksi
    </Button>
  </div>
</div>
    </div>

    <div className="border border-gray-700 p-6">
  <h2 className="text-lg font-semibold mb-4 text-center">Data Waterpass</h2>

  <div className="flex gap-4 text-center">
    {/* Pitch */}
    <div className="flex-1">
      <Label className="text-black text-md">Pitch</Label>
      <Input className="bg-[#2d3748] border-gray-700 text-white mt-2 text-center" />
    </div>

    {/* Roll */}
    <div className="flex-1">
      <Label className="text-black text-md">Roll</Label>
      <Input className="bg-[#2d3748] border-gray-700 text-white mt-2 text-center" />
    </div>

    {/* Yaw */}
    <div className="flex-1 mb-6">
      <Label className="text-black text-md">Yaw</Label>
      <Input className="bg-[#2d3748] border-gray-700 text-white mt-2 text-center" />
    </div>
  </div>
    <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white">
            AMBIL DATA GPS
          </Button>
</div>
    </div>
    </div>
    );
};

export default ContentRadar;
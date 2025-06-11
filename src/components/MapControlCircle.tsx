"use client";

import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Plus, Minus, RotateCcw } from "lucide-react";

const MapControlCircle = () => {
  return (
    <div className="w-60 h-60 bg-black/70 rounded-full flex items-center justify-center relative">
      {/* Pan Arrows */}
      <button className="absolute top-2 left-1/2 -translate-x-1/2">
        <ChevronUp className="text-white w-8 h-8" />
      </button>
      <button className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <ChevronDown className="text-white w-8 h-8" />
      </button>
      <button className="absolute left-2 top-1/2 -translate-y-1/2">
        <ChevronLeft className="text-white w-8 h-8" />
      </button>
      <button className="absolute right-2 top-1/2 -translate-y-1/2">
        <ChevronRight className="text-white w-8 h-8" />
      </button>

      {/* Zoom + Rotate */}
      <div className="flex flex-col items-center justify-center space-y-1">
        <Plus className="text-white w-6 h-6 cursor-pointer" />
        <RotateCcw className="text-white w-6 h-6 cursor-pointer" />
        <Minus className="text-white w-6 h-6 cursor-pointer" />
      </div>
    </div>
  );
};

export default MapControlCircle;

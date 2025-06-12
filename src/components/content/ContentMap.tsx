"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ContentMap = () => {
    return(
        <div className="max-h-[50vh] overflow-y-auto pr-2">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Jenis Koordinat dan Peta */}
        <div className="w-full lg:w-1/2 border border-gray-700 p-6">
          <div className="mb-4">
            <label className="block text-black mb-2 text-sm text-center">Jenis Koordinat dan Peta</label>
            <Select defaultValue="geo">
              <SelectTrigger className="w-full bg-[#2d3748] text-white border-gray-700">
                <SelectValue placeholder="GEO" />
              </SelectTrigger>
              <SelectContent className="bg-[#2d3748] text-white border-gray-700">
                <SelectItem value="geo">GEO</SelectItem>
                <SelectItem value="utm">UTM</SelectItem>
                <SelectItem value="dms">DMS</SelectItem>
                <SelectItem value="lco">LCO</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Select defaultValue="satelit">
              <SelectTrigger className="w-full bg-[#2d3748] text-white border-gray-700">
                <SelectValue placeholder="SATELIT" />
              </SelectTrigger>
              <SelectContent className="bg-[#2d3748] text-white border-gray-700">
                <SelectItem value="satelit">SATELIT</SelectItem>
                <SelectItem value="topografi">TOPOGRAFI</SelectItem>
                <SelectItem value="jalan">JALAN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <Select defaultValue="meter">
                <SelectTrigger className="w-full bg-[#2d3748] text-white border-gray-700">
                  <SelectValue placeholder="METER" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d3748] text-white border-gray-700">
                  <SelectItem value="meter">METER</SelectItem>
                  <SelectItem value="km">KM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Select defaultValue="360">
                <SelectTrigger className="w-full bg-[#2d3748] text-white border-gray-700">
                  <SelectValue placeholder="360" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d3748] text-white border-gray-700">
                  <SelectItem value="360">360</SelectItem>
                  <SelectItem value="6400">6400</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white">
            AMBIL DATA GPS
          </Button>
        </div>

        {/* Plotting Radar */}
        <div className="w-full lg:w-1/2 border border-gray-700 p-6">
          <div className="mb-2">
            <label className="block text-black mb-2 text-sm text-center">Plotting Radar</label>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {["Latitude", "Longitude", "Altitude"].map((label) => (
                <div key={label}>
                  <label className="block text-black mb-2 text-sm text-center">{label}</label>
                  <Input className="bg-[#2d3748] border-gray-700 text-white" />
                </div>
              ))}
            </div>

            <label className="block text-black mb-2 text-sm text-center">Plotting Gunshot</label>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {["Latitude", "Longitude", "Altitude"].map((label) => (
                <div key={`gun-${label}`}>
                  <label className="block text-black mb-2 text-sm text-center">{label}</label>
                  <Input className="bg-[#2d3748] border-gray-700 text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border border-gray-700 p-6">
        <label className="block text-black mb-2 text-sm text-center">Nama Operasi</label>
        <Input
          placeholder="Masukkan nama operasi"
          className="bg-[#2d3748] border-gray-700 text-white text-center"
        />
      </div>
    </div>
    );
};

export default ContentMap;
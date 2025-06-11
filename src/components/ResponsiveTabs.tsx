"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ContentMap from "./content/ContentMap";
import ContentRadar from "./content/ContentRadar";
import ContentKoneksi from "./content/ContentKoneksi";
import ContentRiwayat from "./content/ContentRiwayat";

const ResponsiveTabs = () => {
  const [tabValue, setTabValue] = useState("map");

  const tabs = ["map", "radar", "koneksi", "riwayat"];

  return (
    <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
      {/* SELECT (MOBILE) */}
      <div className="block sm:hidden mb-4">
        <Select value={tabValue} onValueChange={setTabValue}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Tab" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab} value={tab}>
                {tab.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TABLIST (DESKTOP) */}
      <div className="hidden sm:block overflow-x-auto scrollbar-hide">
        <TabsList className="flex w-max min-w-full border-b border-gray-700 p-0 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="min-w-[100px] px-4 py-3 text-black whitespace-nowrap data-[state=active]:border-b-2 data-[state=active]:border-black"
            >
              {tab.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* KONTEN TIAP TAB */}
      <TabsContent value="map">
        <ContentMap />
      </TabsContent>
      <TabsContent value="radar">
        <ContentRadar />
      </TabsContent>
      <TabsContent value="koneksi">
        <ContentKoneksi />
      </TabsContent>
      <TabsContent value="riwayat">
        <ContentRiwayat />
      </TabsContent>
    </Tabs>
  );
};

export default ResponsiveTabs;

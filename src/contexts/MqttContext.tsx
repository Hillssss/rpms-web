// src/contexts/MqttContext.tsx
"use client";

import { createContext, useContext } from "react";
import { useGunshotMQTT } from "@/hooks/useGunshotMQTT";

interface MqttContextType {
  refreshSignal: number | null;
  isConnected: boolean;
  triggerRefresh: () => void; // ✅ Tambahkan ini
}

const MqttContext = createContext<MqttContextType | null>(null);

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const { refreshSignal, isConnected, triggerRefresh } = useGunshotMQTT(); // ✅ pastikan triggerRefresh ada

  return (
    <MqttContext.Provider value={{ refreshSignal, isConnected, triggerRefresh }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const ctx = useContext(MqttContext);
  if (!ctx) throw new Error("useMqtt must be used within MqttProvider");
  return ctx;
};

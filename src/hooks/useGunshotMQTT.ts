"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import mqtt, { MqttClient } from "mqtt";

export interface GunshotData {
  action: string;
  direction: number;
  keterangan: string;
  created_at: number;
}

const BROADCAST_CHANNEL_NAME = "mqtt-refresh";

export const useGunshotMQTT = (onRefresh?: () => void) => {
  const clientRef = useRef<MqttClient | null>(null);
  const [gunshot, setGunshot] = useState<GunshotData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState<number | null>(null);

  const onRefreshRef = useRef(onRefresh);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const resetGunshot = () => setGunshot(null);

  const triggerRefresh = useCallback(() => {
    const now = Date.now();
    setRefreshSignal(now);
    channelRef.current?.postMessage(now);
    if (onRefreshRef.current) onRefreshRef.current(); // opsional trigger callback manual
  }, []);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    const clientId = `gunshotClient_${Math.floor(Math.random() * 1000)}`;

    const options = {
      clientId,
      username: '',
      password: '',
      port: 9001,
      rejectUnauthorized: false,
      protocol: 'ws' as const,
    };

    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_HOST;
    if (!brokerUrl) {
      console.error("❌ MQTT broker URL not found in .env.local (NEXT_PUBLIC_MQTT_HOST)");
      return;
    }

    const client = mqtt.connect(brokerUrl, options);
    clientRef.current = client;
    console.log("[MQTT] Attempting Gunshot MQTT connection...");

    client.on("connect", () => {
      console.log("[MQTT] ✅ Connected to Gunshot MQTT");
      setIsConnected(true);
      client.subscribe("rpms/direction");
      client.subscribe("rpms/logs");
    });

    client.on("message", (topic, message) => {
      const msg = message.toString();
      console.log(`[MQTT] 📩 Message on ${topic}:`, msg);

      if (topic === "rpms/direction") {
        try {
          const data: GunshotData = JSON.parse(msg);
          setGunshot(data);
        } catch (err) {
          console.error("[MQTT] ❌ Failed to parse gunshot message:", err);
        }
      } else if (topic === "rpms/logs") {
        const now = Date.now();
        setRefreshSignal(now);
        channelRef.current?.postMessage(now);
        if (onRefreshRef.current) onRefreshRef.current();
      }
    });

    client.on("close", () => {
      console.warn("[MQTT] ⚠️ Connection closed");
      setIsConnected(false);
    });

    client.on("error", (err) => {
      console.error("[MQTT] ❌ Error:", err);
    });

    // Reconnect logic
    const interval = setInterval(() => {
      if (!client.connected) {
        console.log("[MQTT] 🔄 Reconnecting...");
        client.reconnect();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      client.end();
    };
  }, []);

  // BroadcastChannel antar tab
  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const received = event.data;
      console.log("🔁 BroadcastChannel received:", received);
      setRefreshSignal(received);
      if (onRefreshRef.current) onRefreshRef.current();
    };

    return () => channel.close();
  }, []);

  return {
    gunshot,
    isConnected,
    resetGunshot,
    refreshSignal,
    triggerRefresh,
  };
};

"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import mqtt, { MqttClient } from "mqtt";

export interface GunshotData {
  action: string;
  direction: number;
  keterangan: string;
  created_at: number;
}

export const useGunshotMQTT = (onRefresh?: () => void) => {
  const clientRef = useRef<MqttClient | null>(null);
  const [gunshot, setGunshot] = useState<GunshotData | null>(null);
  const resetGunshot = () => setGunshot(null);
  const [isConnected, setIsConnected] = useState(false);
   const [refreshSignal, setRefreshSignal] = useState<number | null>(null);
  // ⬇️ simpan onRefresh di ref supaya gak perlu masuk array dependency
  const onRefreshRef = useRef(onRefresh);

  const triggerRefresh = useCallback(() => {
    setRefreshSignal(Date.now()); // ubah timestamp untuk memicu useEffect
  }, []);


  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    let client: MqttClient;

    const options = {
      clientId: `gunshotClient_${Math.floor(Math.random() * 1000)}`,
      username: '',
      password: '',
      port: 9001,
      rejectUnauthorized: false,
      protocol: 'ws' as const,
    };

    const connectMQTT = () => {
      client = mqtt.connect('ws://192.168.1.50', options);
      console.log('[MQTT] Attempting Gunshot MQTT connection...');
      clientRef.current = client;

      client.on('connect', () => {
        console.log('[MQTT] Connected to Gunshot MQTT');
        setIsConnected(true);
        client.subscribe('rpms/direction');
        client.subscribe('rpms/logs');
      });

      client.on('message', (topic, message) => {
        const msg = message.toString();
        console.log(`[MQTT] Message on ${topic}:`, msg);

        if (topic === 'rpms/direction') {
          try {
            const data: GunshotData = JSON.parse(msg);
            setGunshot(data);
          } catch (err) {
            console.error('[MQTT] Failed to parse gunshot message:', err);
          }
        } else if (topic === 'rpms/logs') {
          try {
            setRefreshSignal(Date.now()); // pakai timestamp
            if (onRefreshRef.current) onRefreshRef.current(); // trigger onRefresh
          } catch (err) {
            console.error('[MQTT] Failed to parse refresh message:', err);
          }
        }
      });

      client.on('close', () => {
        console.warn('[MQTT] Gunshot MQTT connection closed');
        setIsConnected(false);
      });

      client.on('error', (err) => {
        console.error('[MQTT] Error:', err);
      });
    };

    connectMQTT();

    const interval = setInterval(() => {
      const client = clientRef.current;
      if (!client || client.disconnected) {
        console.log('[MQTT] Gunshot MQTT disconnected, reconnecting...');
        connectMQTT();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clientRef.current?.end();
    };
  }, []);

  return { gunshot, isConnected, resetGunshot, refreshSignal,  triggerRefresh,  };
};

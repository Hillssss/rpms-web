import { useEffect, useRef, useState } from "react";
import mqtt, { MqttClient } from "mqtt";
import { useOperasi,} from "@/contexts/OperasiContext";

export interface GunshotData {
  action: string;
  direction: number;
  keterangan: string;
  created_at: number;
}

export const useGunshotMQTT = () => {
  const clientRef = useRef<MqttClient | null>(null);
  const [gunshot, setGunshot] = useState<GunshotData | null>(null);
  const resetGunshot = () => setGunshot(null); // 🔥 Tambahkan ini
  const [isConnected, setIsConnected] = useState(false);
   const {refreshValue, setRefreshValue} = useOperasi();

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
      client = mqtt.connect('ws://192.168.0.188', options);
      console.log('[MQTT] Attempting Gunshot MQTT connection...');

      clientRef.current = client;

      client.on('connect', () => {
        console.log('[MQTT] Connected to Gunshot MQTT');
        setIsConnected(true);
        clientRef.current?.subscribe('rpms/direction');
      });

      client.on('message', (topic, message) => {
        console.log(`[MQTT] Message on ${topic}:`, message.toString());
        if (topic === 'rpms/direction') {
          try {
            const data: GunshotData = JSON.parse(message.toString());
            setGunshot(data);
          } catch (err) {
            console.error('[MQTT] Failed to parse gunshot message:', err);
          }
        } else if (topic === "rpms/logs") {
          try {
            const data = JSON.parse(message.toString());
            if (data.data) {
              setRefreshValue(!refreshValue)
            }
          } catch (err) {
            console.error('[MQTT] Failed to parse gunshot message:', err);
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

    // connect langsung
    connectMQTT();

    // Reconnect logic
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
  }, [refreshValue, setRefreshValue]);

  return { gunshot, isConnected, resetGunshot, refreshValue, setRefreshValue}; // 🔥

};

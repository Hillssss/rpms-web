"use client";

import { useRef, useState, useEffect } from "react";
import type { MapRef } from "react-map-gl";
import * as turf from "@turf/turf";
import type { FeatureCollection } from "geojson";
import { useOperasi } from "@/contexts/OperasiContext";
import { toast } from "sonner";
import { useMqtt } from "@/contexts/MqttContext";
import { useGunshotMQTT } from "@/hooks/useGunshotMQTT";
import { fetchCurrentOperasi } from "@/lib/api";


const RADIUS_COLORS = {
  SMALL: "#FF0000",
  MEDIUM: "#FFFF00",
  LARGE: "#00FF00",
};

const DARK_YELLOW = "#D6C90C";

export const useMapBox = () => {
  const mapRef = useRef<MapRef>(null);
  const prevLat = useRef<number | null>(null);
  const prevLon = useRef<number | null>(null);

  const { radar, isConnected, isStarted } = useOperasi();
  const { gunshot, resetGunshot } = useGunshotMQTT();
  const { refreshSignal } = useMqtt();

  const latitude = Number(radar.latitude);
  const longitude = Number(radar.longitude);
  const isValidCoordinate =
    isFinite(latitude) && isFinite(longitude) && !isNaN(latitude) && !isNaN(longitude);

  const handleMarkerClick = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [longitude, latitude], zoom: 19, speed: 1.2, curve: 1 });
    }
  };

  const [geojsonData, setGeojsonData] = useState<{
    circles: FeatureCollection;
    sectors: FeatureCollection;
    labels: FeatureCollection;
  } | null>(null);

  const [waveCircle, setWaveCircle] = useState<FeatureCollection | null>(null);
  const [gunshotSector, setGunshotSector] = useState<FeatureCollection | null>(null);

  // 🟡 1. generate circle, sector, label
  useEffect(() => {
    const radiusArray = [25, 50, 75, 100, 250, 500, 750, 1000, 1500, 2000, 3000];
    if (!isValidCoordinate || !isStarted) return;

    const circleFeatures = radiusArray.map((r) => {
      const circle = turf.circle([longitude, latitude], r / 1000, { steps: 64, units: "kilometers" });
      const color = r <= 100 ? RADIUS_COLORS.SMALL : r <= 750 ? RADIUS_COLORS.MEDIUM : RADIUS_COLORS.LARGE;
      circle.properties = { color };
      return circle;
    });

    const sectorFeatures = radiusArray.map((r) => {
      const sector = turf.sector([longitude, latitude], r / 1000, -22.5, 22.5, { steps: 64, units: "kilometers" });
      const color = r <= 100 ? RADIUS_COLORS.SMALL : r <= 750 ? RADIUS_COLORS.MEDIUM : RADIUS_COLORS.LARGE;
      sector.properties = { color };
      return sector;
    });

    const bearings = [0, 90, 180, 270];
    const labelFeatures = radiusArray.flatMap((r) =>
      bearings.map((b) => {
        const point = turf.destination([longitude, latitude], r / 1000, b, { units: "kilometers" });
        point.properties = { label: r >= 1000 ? `${r / 1000} km` : `${r} m` };
        return point;
      })
    );

    setGeojsonData({
      circles: { type: "FeatureCollection", features: circleFeatures },
      sectors: { type: "FeatureCollection", features: sectorFeatures },
      labels: { type: "FeatureCollection", features: labelFeatures },
    });
  }, [latitude, longitude, isStarted, isValidCoordinate, refreshSignal]);

  // 🔴 2. gunshot sector
  useEffect(() => {
    if (!gunshot || !isValidCoordinate || !isConnected) return;

    const angle = gunshot.direction;
    const width = 15;
    const radius = 3;

    const sector = turf.sector([longitude, latitude], radius, angle - width, angle + width, {
      steps: 64,
      units: "kilometers",
    });

    sector.properties = { color: "#FF0000", opacity: 0.5 };
    setGunshotSector({ type: "FeatureCollection", features: [sector] });

    const timeout = setTimeout(() => setGunshotSector(null), 4000);
    return () => clearTimeout(timeout);
  }, [gunshot, isValidCoordinate, latitude, longitude, isConnected, refreshSignal]);

  // 🎯 3. fly to new lokasi saat refreshSignal atau pindah operasi
  useEffect(() => {
    if (
      isStarted &&
      isValidCoordinate &&
      mapRef.current &&
      (prevLat.current !== latitude || prevLon.current !== longitude)
    ) {
      const timeout = setTimeout(() => {
        mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 18, speed: 1.2, curve: 1 });
        prevLat.current = latitude;
        prevLon.current = longitude;
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isStarted, isValidCoordinate, latitude, longitude, refreshSignal]);

  useEffect(() => {
  if (isStarted && isValidCoordinate && mapRef.current) {
    const timeout = setTimeout(() => {
      mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 18, speed: 1.2, curve: 1 });
      prevLat.current = latitude;
      prevLon.current = longitude;
    }, 300);
    return () => clearTimeout(timeout);
  }
}, [isStarted, isValidCoordinate, latitude, longitude, refreshSignal]);



  // 🟢 4. animasi radar pulse
  useEffect(() => {
    if (!isConnected || !isValidCoordinate) {
      setWaveCircle(null);
      return;
    }

    let radius = 50;
    const maxRadius = 3000;
    const minRadius = 50;
    const step = 30;

    const interval = setInterval(() => {
      const circle = turf.circle([longitude, latitude], radius / 1000, {
        steps: 64,
        units: "kilometers",
      });

      const progress = (radius - minRadius) / (maxRadius - minRadius);
      const opacity = 0.4 + 0.4 * Math.pow(1 - progress, 1.5);
      circle.properties = { opacity };

      setWaveCircle({ type: "FeatureCollection", features: [circle] });

      radius += step;
      if (radius > maxRadius) radius = minRadius;
    }, 100);

    return () => clearInterval(interval);
  }, [latitude, longitude, isConnected, isValidCoordinate, refreshSignal]);

  // ⚠️ 5. koordinat error
  useEffect(() => {
    const latStr = typeof radar.latitude === "string" ? radar.latitude.trim() : String(radar.latitude).trim();
    const lonStr = typeof radar.longitude === "string" ? radar.longitude.trim() : String(radar.longitude).trim();

    const isLatTyping = /^-?\d*\.?\d*$/.test(latStr);
    const isLonTyping = /^-?\d*\.?\d*$/.test(lonStr);

    if (!isValidCoordinate && !isLatTyping && !isLonTyping) {
      toast.error("Koordinat tidak valid");
    }
  }, [radar.latitude, radar.longitude, isValidCoordinate]);

  // 🔄 6. reset sektor jika disconnect / stop
  useEffect(() => {
    if (!isStarted || !isConnected) {
      setGunshotSector(null);
      resetGunshot();
    }
  }, [isStarted, isConnected, resetGunshot, refreshSignal]);
  

  return {
    mapRef,
    isConnected,
    isStarted,
    longitude,
    latitude,
    waveCircle,
    geojsonData,
    handleMarkerClick,
    DARK_YELLOW,
    gunshotSector,
  };
};

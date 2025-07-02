"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import type { MapRef } from "react-map-gl";
import * as turf from "@turf/turf";
import type { FeatureCollection } from "geojson";
import { useOperasi } from "@/contexts/OperasiContext";
import { toast } from "sonner";

const RADIUS_COLORS = {
  SMALL: "#FF0000",
  MEDIUM: "#FFFF00",
  LARGE: "#00FF00",
};

const DARK_YELLOW = "#D6C90C";

export const useMapBox = () => {
  const mapRef = useRef<MapRef>(null);
  const { radar, isConnected, isStarted } = useOperasi();

  const latitude = Number(radar.latitude);
  const longitude = Number(radar.longitude);

  const isValidCoordinate =
    isFinite(latitude) && isFinite(longitude) && !isNaN(latitude) && !isNaN(longitude);

  const handleMarkerClick = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 19,
        speed: 1.2,
        curve: 1,
      });
    }
  };

  
  const [waveCircle, setWaveCircle] = useState<FeatureCollection | null>(null);

  const radiusArray = useMemo(() => [25, 50, 75, 100, 250, 500, 750, 1000, 1500, 2000, 3000], []);

  const geojsonData = useMemo(() => {
  if (!isValidCoordinate || !isStarted) return null;

  const circleFeatures = radiusArray.map((radius) => {
    const circle = turf.circle([longitude, latitude], radius / 1000, {
      steps: 64,
      units: "kilometers",
    });

    let color = RADIUS_COLORS.LARGE;
    if (radius <= 100) color = RADIUS_COLORS.SMALL;
    else if (radius <= 750) color = RADIUS_COLORS.MEDIUM;

    circle.properties = { color };
    return circle;
  });

  const sectorFeatures = radiusArray.map((radius) => {
    const sector = turf.sector([longitude, latitude], radius / 1000, -22.5, 22.5, {
      steps: 64,
      units: "kilometers",
    });

    let color = RADIUS_COLORS.LARGE;
    if (radius <= 100) color = RADIUS_COLORS.SMALL;
    else if (radius <= 750) color = RADIUS_COLORS.MEDIUM;

    sector.properties = { color };
    return sector;
  });

  const bearings = [0, 90, 180, 270];
  const labelFeatures = radiusArray.flatMap((radius) =>
    bearings.map((bearing) => {
      const labelPoint = turf.destination([longitude, latitude], radius / 1000, bearing, {
        units: "kilometers",
      });

      labelPoint.properties = {
        label: radius >= 1000 ? `${radius / 1000} km` : `${radius} m`,
      };

      return labelPoint;
    })
  );

  return {
    circles: {
      type: "FeatureCollection",
      features: circleFeatures,
    },
    sectors: {
      type: "FeatureCollection",
      features: sectorFeatures,
    },
    labels: {
      type: "FeatureCollection",
      features: labelFeatures,
    },
  };
}, [latitude, longitude, radiusArray, isStarted, isValidCoordinate]);


  // Fly to radar location once operasi is started
  useEffect(() => {
    if (isStarted && isValidCoordinate && mapRef.current) {
      const timeout = setTimeout(() => {
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 18,
          speed: 1.2,
          curve: 1,
        });
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isStarted, isValidCoordinate, latitude, longitude]);
  console.log("[useMapBox] isStarted:", isStarted, "radar:", latitude, longitude);

  // Wavecircle animation only when connected
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

      setWaveCircle({
        type: "FeatureCollection",
        features: [circle],
      });

      radius += step;
      if (radius > maxRadius) radius = minRadius;
    }, 100);

    return () => clearInterval(interval);
  }, [latitude, longitude, isConnected, isValidCoordinate]);

  useEffect(() => {
    const latStr = radar.latitude.trim();
    const lonStr = radar.longitude.trim();

    const isLatTyping = /^-?\d*\.?\d*$/.test(latStr);
    const isLonTyping = /^-?\d*\.?\d*$/.test(lonStr);

    if (!isValidCoordinate && !isLatTyping && !isLonTyping) {
      toast.error("Koordinat tidak valid");
    }
  }, [radar.latitude, radar.longitude, isValidCoordinate]);

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
  };
};

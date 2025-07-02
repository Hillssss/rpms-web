declare module "utm" {
  export function fromLatLon(
    lat: number,
    lon: number
  ): {
    easting: number;
    northing: number;
    zoneNum: number;
    zoneLetter: string;
  };

  export function toLatLon(
    easting: number,
    northing: number,
    zoneNum: number,
    zoneLetter: string
  ): {
    latitude: number;
    longitude: number;
  };
}

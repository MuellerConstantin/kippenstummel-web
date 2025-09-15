export function tileToLatLon(
  x: number,
  y: number,
  z: number,
): { longitude: number; latitude: number } {
  const longitude = (x / Math.pow(2, z)) * 360 - 180;

  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  const latitude =
    (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

  return { longitude, latitude };
}

export function latLonToTile(
  lat: number,
  lon: number,
  z: number,
): { x: number; y: number; z: number } {
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, z));

  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
      ) /
        Math.PI) /
      2) *
      Math.pow(2, z),
  );

  return { x, y, z };
}

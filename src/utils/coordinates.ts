import { Campaign, Point } from "../types";

type MapDimensions = Pick<Campaign, "mapWidth" | "mapHeight">;

export interface GeoPoint {
  longitude: number;
  latitude: number;
}

export const getMapCenterPoint = (map: MapDimensions): Point => ({
  x: map.mapWidth / 2,
  y: map.mapHeight / 2,
});

export const mapPointToGeo = (point: Point, map: MapDimensions): GeoPoint => {
  const center = getMapCenterPoint(map);
  return {
    // Longitude: east/west from center; Latitude: north/south from center.
    longitude: Math.round(point.x - center.x),
    latitude: Math.round(center.y - point.y),
  };
};

export const mapPointToPan = (point: Point, map: MapDimensions): Point => {
  const center = getMapCenterPoint(map);
  return {
    x: -(point.x - center.x),
    y: -(point.y - center.y),
  };
};

export const formatSignedCoordinate = (value: number): string =>
  value > 0 ? `+${value}` : `${value}`;

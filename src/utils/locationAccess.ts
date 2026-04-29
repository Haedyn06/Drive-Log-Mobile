import { getDistance } from "geolib";
import * as Location from 'expo-location';

import type { Coords } from "@/types/CoordinateType";
import type { SessionRoutePoint } from "@/types/dbObj/routePointType";

export const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
};

export const compressRouteByDistance = (totalDistanceMeters: number, routepoints: SessionRoutePoint[]): SessionRoutePoint[] => {
    if (!routepoints.length) return [];

    const distanceKm = totalDistanceMeters / 1000;

    let minDistance = 50;

    if (distanceKm < 25) minDistance = 50;
    else if (distanceKm < 65) minDistance = 75;
    else if (distanceKm < 100) minDistance = 100;
    else if (distanceKm < 250) minDistance = 250;
    else if (distanceKm < 400) minDistance = 400;
    else minDistance = 800;

    const compressed: SessionRoutePoint[] = [routepoints[0]];
    let lastSaved = routepoints[0];

    for (let i = 1; i < routepoints.length; i++) {
        const point = routepoints[i];
        const dist = getDistance(lastSaved.location, point.location);

        if (dist >= minDistance) {
            compressed.push(point);
            lastSaved = point;
        }
    }

    const lastPoint = routepoints[routepoints.length - 1];
    const finalPoint = compressed[compressed.length - 1];

    const isSame =
        Math.abs(finalPoint.location.latitude - lastPoint.location.latitude) < 1e-6 &&
        Math.abs(finalPoint.location.longitude - lastPoint.location.longitude) < 1e-6;

    if (!isSame) compressed.push(lastPoint);

    return compressed;
};

export const getLocationName = async (coords?: Coords) => {
    if (!coords) return "";

    try {
        const result = await Location.reverseGeocodeAsync({
            latitude: coords.latitude,
            longitude: coords.longitude,
        });

        const addr = result[0];
        if (!addr) return "";

        return [
            addr.name,
            addr.street,
            addr.city,
            addr.region,
            addr.country,
        ]
            .filter(Boolean)
            .join(", ");
    } catch (e) {
        console.log("Reverse geocode error:", e);
        return "";
    }    
}
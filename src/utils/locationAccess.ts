import { getDistance } from "geolib";
import * as Location from 'expo-location';

import type { Coords } from "@/types/sessionObj/LocationType";

export const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
};

export const compressRouteByDistance = (totalDistanceMeters: number, points: Coords[]) => {
    if (!points.length) return [];

    const distanceKm = totalDistanceMeters / 1000;

    let minDistance = 50;

    if (distanceKm < 25) minDistance = 50;
    else if (distanceKm < 65) minDistance = 75;
    else if (distanceKm < 100) minDistance = 100;
    else if (distanceKm < 250) minDistance = 250;
    else if (distanceKm < 400) minDistance = 400;
    else minDistance = 800;

    const compressed: Coords[] = [points[0]];
    let lastSaved = points[0];

    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        const dist = getDistance(lastSaved, point);

        if (dist >= minDistance) {
            compressed.push(point);
            lastSaved = point;
        }
    }

    const lastPoint = points[points.length - 1];
    const finalPoint = compressed[compressed.length - 1];

    const isSame = Math.abs(finalPoint.latitude - lastPoint.latitude) < 1e-6 && 
        Math.abs(finalPoint.longitude - lastPoint.longitude) < 1e-6;

    if (!isSame) compressed.push(lastPoint);

    return compressed;
};
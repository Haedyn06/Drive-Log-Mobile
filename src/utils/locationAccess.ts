import { getDistance } from "geolib";
import * as Location from 'expo-location';

import type { Coords } from "@/types/sessionObj/LocationType";

export const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
};

export const compressRouteByDistance = (points: Coords[], minDistance = 15) => {
    if (points.length === 0) return [];

    const compressed: Coords[] = [points[0]];
    let lastSaved = points[0];

    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        const distance = getDistance(lastSaved, point);

        if (distance >= minDistance) {
            compressed.push(point);
            lastSaved = point;
        }
    }

    const lastPoint = points[points.length - 1];
    const finalPoint = compressed[compressed.length - 1];

    if (finalPoint.latitude !== lastPoint.latitude || finalPoint.longitude !== lastPoint.longitude)
        compressed.push(lastPoint);

    return compressed;
};
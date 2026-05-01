import { getDistance } from "geolib";
import { Platform, Linking } from "react-native";
import * as Location from 'expo-location';

import type { Coords } from "@/types/CoordinateType";
import type { SessionRoutePoint } from "@/types/dbObj/mapPointTypes";


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

export const getLocationParts = async (coords?: Coords) => {
    if (!coords) return null;

    try {
        const result = await Location.reverseGeocodeAsync({
            latitude: coords.latitude,
            longitude: coords.longitude,
        });

        const addr = result[0];
        if (!addr) return null;

        return {
            name: addr.name,
            street: addr.street,
            city: addr.city,
            region: addr.region,
            country: addr.country,
        };
    } catch (e) {
        console.log("Reverse geocode error:", e);
        return null;
    }
};

export const navigateMapLocation = async (lat:number, lon:number) => {
    const url = Platform.select({
        ios: `http://maps.apple.com/?daddr=${lat},${lon}`,
        android: `google.navigation:q=${lat},${lon}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
    });

    if (!url) return;

    await Linking.openURL(url);
};
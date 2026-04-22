import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

import { requestPermission } from '@/utils/locationAccess';

import type { Coord } from '@/types/Coord';

type UseLocationTrackingProps = {
    setSpeedKmh: React.Dispatch<React.SetStateAction<number>>;
    setMaxSpeedKmh: React.Dispatch<React.SetStateAction<number>>;
    setRoute: React.Dispatch<React.SetStateAction<Coord[]>>;
    setDistanceMeters: React.Dispatch<React.SetStateAction<number>>;
    setAltitudeMeters: React.Dispatch<React.SetStateAction<number>>;
    setMaxAltitudeMeters: React.Dispatch<React.SetStateAction<number>>;
    setAltitudeGainMeters: React.Dispatch<React.SetStateAction<number>>;
};

export function useLocationTracking({
    setSpeedKmh, setMaxSpeedKmh, setRoute, setDistanceMeters, 
    setAltitudeMeters, setMaxAltitudeMeters, setAltitudeGainMeters
}: UseLocationTrackingProps) {
    const [watchSubscription, setWatchSubscription] =
        useState<Location.LocationSubscription | null>(null);

    useEffect(() => {
        return () => watchSubscription?.remove();
    }, [watchSubscription]);

    const startTracking = async () => {
        const granted = await requestPermission();

        if (!granted) {
            console.log('Permission denied');
            return;
        }

        const subscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.BestForNavigation,
                timeInterval: 1000,
                distanceInterval: 1
            },
            (location) => {
                const altitude = location.coords.altitude ?? 0;

                const newPoint = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    altitude
                };

                const rawSpeed = location.coords.speed ?? 0;
                const safeSpeed = rawSpeed < 0 ? 0 : rawSpeed * 3.6;

                setSpeedKmh(safeSpeed);
                setMaxSpeedKmh((prev) => Math.max(prev, safeSpeed));

                setAltitudeMeters(altitude);
                setMaxAltitudeMeters((prev) => Math.max(prev, altitude));

                setRoute((prevRoute) => {
                    if (prevRoute.length === 0) return [newPoint];

                    const lastPoint = prevRoute[prevRoute.length - 1];
                    const segmentDistance = getDistance(lastPoint, newPoint);

                    if (segmentDistance >= 5) {
                        setDistanceMeters((prev) => prev + segmentDistance);

                        const lastAltitude = lastPoint.altitude ?? 0;
                        const altitudeDiff = altitude - lastAltitude;

                        if (altitudeDiff > 0) {
                            setAltitudeGainMeters((prev) => prev + altitudeDiff);
                        }

                        return [...prevRoute, newPoint];
                    }

                    return prevRoute;
                });
            }
        );

        setWatchSubscription(subscription);
    };

    const stopTracking = async () => {
        if (watchSubscription) {
            watchSubscription.remove();
            setWatchSubscription(null);
        }

        const granted = await requestPermission();
        if (!granted) {
            console.log('Permission denied');
            return;
        }

        setSpeedKmh(0);
    };

    return { startTracking, stopTracking };
}
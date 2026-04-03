import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

import { requestPermission } from '../utils/locationAccess';
import type { Coord } from '../types/Coord';

type UseLocationTrackingProps = {
    setSpeedKmh: React.Dispatch<React.SetStateAction<number>>;
    setRoute: React.Dispatch<React.SetStateAction<Coord[]>>;
    setDistanceMeters: React.Dispatch<React.SetStateAction<number>>;
};

export function useLocationTracking({ setSpeedKmh, setRoute, setDistanceMeters }: UseLocationTrackingProps) {
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
            { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
            
            (location) => {
                const newPoint = { latitude: location.coords.latitude, longitude: location.coords.longitude };

                const rawSpeed = location.coords.speed ?? 0;
                const safeSpeed = rawSpeed < 0 ? 0 : rawSpeed * 3.6;
                setSpeedKmh(safeSpeed);

                setRoute((prevRoute) => {
                    if (prevRoute.length === 0) return [newPoint];

                    const lastPoint = prevRoute[prevRoute.length - 1];
                    const segmentDistance = getDistance(lastPoint, newPoint);

                    if (segmentDistance >= 3) {
                        setDistanceMeters((prev) => prev + segmentDistance);
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
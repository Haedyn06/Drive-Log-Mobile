import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

import { requestPermission } from '@/utils/locationAccess';

import type { Coords } from '@/types/sessionObj/LocationType';
import type { TopSpeed, TopAltitude } from '@/types/sessionObj/MetricsType';

type UseLocationTrackingProps = {
    setSpeedSession: React.Dispatch<React.SetStateAction<number>>;
    setTopSpeedSession: React.Dispatch<React.SetStateAction<TopSpeed | null>>;
    setAltitudeSession: React.Dispatch<React.SetStateAction<number>>;
    setTopAltitudeSession: React.Dispatch<React.SetStateAction<TopAltitude | null>>;
    setAltitudeGainSession: React.Dispatch<React.SetStateAction<number>>;
    setDistanceSession: React.Dispatch<React.SetStateAction<number>>;
    setMapRoute: React.Dispatch<React.SetStateAction<Coords[]>>;
    
};

export function useLocationTracking({
    setSpeedSession, setTopSpeedSession, 
    setAltitudeSession, setTopAltitudeSession, setAltitudeGainSession,
    setDistanceSession, setMapRoute
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
                // Altitude
                const altitude = location.coords.altitude ?? 0;

                // Routing
                const newPoint = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    altitude
                };

                // Speed
                const rawSpeed = location.coords.speed ?? 0;
                const safeSpeed = rawSpeed < 0 ? 0 : rawSpeed * 3.6;

                setSpeedSession(safeSpeed);
                setTopSpeedSession((prev) => {
                    if (!prev || safeSpeed > prev.speed) 
                        return { speed: safeSpeed, location: newPoint };
                    return prev;
                });


                // Altitude
                setAltitudeSession(altitude);
                setTopAltitudeSession((prev) => {
                    if (!prev || altitude > prev.altitude) 
                        return { altitude, location: newPoint };
                    return prev;
                });


                // Mapped Routes
                setMapRoute((prevRoute) => {
                    if (prevRoute.length === 0) return [newPoint];

                    const lastPoint = prevRoute[prevRoute.length - 1];
                    const segmentDistance = getDistance(lastPoint, newPoint);

                    if (segmentDistance >= 5) {
                        setDistanceSession((prev) => prev + segmentDistance);

                        const lastAltitude = lastPoint.altitude ?? 0;
                        const altitudeDiff = altitude - lastAltitude;

                        if (altitudeDiff > 0) setAltitudeGainSession((prev) => prev + altitudeDiff);

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

        setSpeedSession(0);
    };

    return { startTracking, stopTracking };
}
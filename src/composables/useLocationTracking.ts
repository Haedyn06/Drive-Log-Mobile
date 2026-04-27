import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

import { requestPermission } from '@/utils/locationAccess';

import type { Coords } from '@/types/sessionObj/LocationType';
import type { TopSpeed, TopAltitude } from '@/types/sessionObj/MetricsType';
import type { SessionStopPoint } from '@/types/sessionObj/StopPointType';




type UseLocationTrackingProps = {
    setSpeedSession: React.Dispatch<React.SetStateAction<number>>;
    setTopSpeedSession: React.Dispatch<React.SetStateAction<TopSpeed | null>>;
    setAltitudeSession: React.Dispatch<React.SetStateAction<number>>;
    setTopAltitudeSession: React.Dispatch<React.SetStateAction<TopAltitude | null>>;
    setAltitudeGainSession: React.Dispatch<React.SetStateAction<number>>;
    setDistanceSession: React.Dispatch<React.SetStateAction<number>>;
    setMapRoute: React.Dispatch<React.SetStateAction<Coords[]>>;
    setStopSession: React.Dispatch<React.SetStateAction<SessionStopPoint[]>>;
};

export function useLocationTracking({
    setSpeedSession, setTopSpeedSession, 
    setAltitudeSession, setTopAltitudeSession, setAltitudeGainSession,
    setDistanceSession, setMapRoute, setStopSession
}: UseLocationTrackingProps) {

    const [watchSubscription, setWatchSubscription] = useState<Location.LocationSubscription | null>(null);
    
    // Stop Detections
    const stopTrigSpeed = 5; //5kmh
    const stopTrigSec = 12_000; //10sec

    const possibleStopStart = useRef<number | null>(null);
    const possibleStopLocation = useRef<Coords | null>(null);
    const isStopped = useRef(false);

    useEffect(() => {
        return () => watchSubscription?.remove();
    }, [watchSubscription]);


    const handleSpeed = (safeSpeed: number, newPoint: Coords) => {
        setSpeedSession(safeSpeed);

        setTopSpeedSession((prev) => {
            if (!prev || safeSpeed > prev.speed)
                return { speed: safeSpeed, location: newPoint, timestamp: Date.now() };
            
            return prev;
        });
    };


    const handleAltitude = (altitude: number, newPoint: Coords) => {
        setAltitudeSession(altitude);

        setTopAltitudeSession((prev) => {
            if (!prev || altitude > prev.altitude) 
                return { altitude, location: newPoint, timestamp: Date.now() };

            return prev;
        });
    };


    const handleRoute = (newPoint: Coords, altitude: number) => {
        const routeDraw = 25;

        setMapRoute((prevRoute) => {
            if (prevRoute.length === 0) return [newPoint];

            const lastPoint = prevRoute[prevRoute.length - 1];
            const segmentDistance = getDistance(lastPoint, newPoint);

            if (segmentDistance >= routeDraw) {
                setDistanceSession((prev) => prev + segmentDistance);

                const lastAltitude = lastPoint.altitude ?? 0;
                const altitudeDiff = altitude - lastAltitude;

                if (altitudeDiff > 0) setAltitudeGainSession((prev) => prev + altitudeDiff);
                return [...prevRoute, newPoint];
            }

            return prevRoute;
        });
    };

    const handleStop = (safeSpeed: number, newPoint: Coords) => {
        const now = Date.now();

        if (safeSpeed <= stopTrigSpeed) {
            if (!possibleStopStart.current) {
                possibleStopStart.current = now;
                possibleStopLocation.current = newPoint;
            }

            const duration = now - possibleStopStart.current;

            if ( duration >= stopTrigSec && !isStopped.current && possibleStopLocation.current) {
                isStopped.current = true;
                console.log('currently stopped');
                setStopSession((prev) => [...prev, {
                        location: possibleStopLocation.current!,
                        timestamp: possibleStopStart.current!,
                        duration
                    },
                ]);
            }
        } else {
            // reset when moving again
            possibleStopStart.current = null;
            possibleStopLocation.current = null;
            isStopped.current = false;
        }
    };


    const startTracking = async () => {
        const granted = await requestPermission();

        if (!granted) {
            console.log('Permission denied');
            return;
        }

        const subscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1},
            (location) => {
                const altitude = location.coords.altitude ?? 0;

                const newPoint = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    altitude,
                };

                const rawSpeed = location.coords.speed ?? 0;
                const safeSpeed = rawSpeed < 0 ? 0 : rawSpeed * 3.6;

                handleSpeed(safeSpeed, newPoint);
                handleAltitude(altitude, newPoint);
                handleRoute(newPoint, altitude);
                handleStop(safeSpeed, newPoint);
            }
        );

        setWatchSubscription(subscription);
    };



    const stopTracking = async () => {
        if (watchSubscription) {
            watchSubscription.remove();
            setWatchSubscription(null);
        }

        setSpeedSession(0);
    };


    const getLocationName = async (coords?: Coords) => {
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
    };

    return { startTracking, stopTracking, getLocationName };
}
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

import { requestPermission } from '@/utils/locationAccess';

import { Coords } from '@/types/CoordinateType';
import type { SessionRoutePoint } from '@/types/dbObj/routePointType';
import type { SessionTopSpeed, SessionTopAltitude } from "@/types/dbObj/topMetrics";
import type { SessionStopPoint } from '@/types/dbObj/stopPointType';

type UseLocationTrackingProps = {
    setSpeedSession: React.Dispatch<React.SetStateAction<number>>;
    setTopSpeedSession: React.Dispatch<React.SetStateAction<SessionTopSpeed | null>>;
    setAltitudeSession: React.Dispatch<React.SetStateAction<number>>;
    setTopAltitudeSession: React.Dispatch<React.SetStateAction<SessionTopAltitude | null>>;
    setAltitudeGainSession: React.Dispatch<React.SetStateAction<number>>;
    setDistanceSession: React.Dispatch<React.SetStateAction<number>>;
    setSessionRoutePoints: React.Dispatch<React.SetStateAction<SessionRoutePoint[]>>;
    setSessionStopPoints: React.Dispatch<React.SetStateAction<SessionStopPoint[]>>;
};

export function useLocationTracking({
    setSpeedSession, setTopSpeedSession, 
    setAltitudeSession, setTopAltitudeSession, setAltitudeGainSession,
    setDistanceSession, setSessionRoutePoints, setSessionStopPoints
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


    // Speed
    const handleSpeed = (safeSpeed: number, newPoint: Coords) => {
        setSpeedSession(safeSpeed);

        setTopSpeedSession((prev) => {
            if (!prev || safeSpeed > prev.speed)
                return { speed: safeSpeed, location: newPoint, timestamp: Date.now() };
            
            return prev;
        });
    };

    // Altitude
    const handleAltitude = (altitude: number, newPoint: Coords) => {
        setAltitudeSession(altitude);

        setTopAltitudeSession((prev) => {
            if (!prev || altitude > prev.altitude) 
                return { altitude, location: newPoint, timestamp: Date.now() };

            return prev;
        });
    };

    // Route
    const handleRoute = (newCoords: Coords, altitude: number) => {
       // const routeDraw = 25;
        const routeDraw = 5;

        const newPoint: SessionRoutePoint = {
            location: { ...newCoords, altitude },
            timestamp: Date.now(),
        };

        setSessionRoutePoints((prevRoute) => {
            if (prevRoute.length === 0) return [newPoint];

            const lastPoint = prevRoute[prevRoute.length - 1];

            const segmentDistance = getDistance(lastPoint.location, newPoint.location);

            if (segmentDistance >= routeDraw) {
                setDistanceSession((prev) => prev + segmentDistance);

                const lastAltitude = lastPoint.location.altitude ?? 0;
                const altitudeDiff = altitude - lastAltitude;

                if (altitudeDiff > 0) setAltitudeGainSession((prev) => prev + altitudeDiff);

                return [...prevRoute, newPoint];
            }

            return prevRoute;
        });
    };

    // Stop
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
                setSessionStopPoints((prev) => [...prev, {
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

    return { startTracking, stopTracking };
}
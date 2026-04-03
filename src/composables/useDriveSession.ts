import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

import { addSession } from '../services/localStoreService';

import { requestPermission, compressRouteByDistance } from '../utils/locationAccess';
import { useLocationTracking } from './useLocationTracking';

import { Coord } from '../types/location';


export function useDriveSession() {

    // Initial Session
    const [isStart, setIsStart] = useState(false);
    const [locStart, setLocStart] = useState<Coord | null>(null);
    const [timeStampStart, setTimeStampStart] = useState<number | null>(null);

    // Live Session
    const [elapsed, setElapsed] = useState(0);
    const [speedKmh, setSpeedKmh] = useState(0);
    const [distanceMeters, setDistanceMeters] = useState(0);
    const [route, setRoute] = useState<Coord[]>([]);

    // End Session
    const [locEnd, setLocEnd] = useState<Coord | null>(null);
    const [timeStampEnd, setTimeStampEnd] = useState<number | null>(null);

    // Save
    const [titleModalVisible, setTitleModalVisible] = useState(false);
    const [sessionTitle, setSessionTitle] = useState('');

    const { startTracking, stopTracking } = useLocationTracking({ setSpeedKmh, setRoute, setDistanceMeters });

    // Use Effects
    useEffect(() => {
        if (!isStart || timeStampStart === null) return;

        const interval = setInterval(() => {
            setElapsed(Date.now() - timeStampStart);
        }, 50);

        return () => clearInterval(interval);
    }, [isStart, timeStampStart]);


    // Session Handlings

    const handleStartSession = async () => {
        const granted = await requestPermission();
        if (!granted) {
            console.log('Permission denied');
            return false;
        }

        const location = await Location.getCurrentPositionAsync({});
        const startPoint = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        const now = Date.now();

        resetVars();

        setLocStart(startPoint);
        setTimeStampStart(now);
        setRoute([startPoint]);

        return true;
    };



    const handleSession = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (isStart) {
            setIsStart(false);
            await stopTracking();
        } else {
            const started = await handleStartSession();
            if (!started) return;

            setIsStart(true);
            await startTracking();
        }
    };


    const handleEndSession = async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        if (!isStart) {
            // already stopped, just open title prompt
            setTitleModalVisible(true);
            return;
        }

        setIsStart(false);
        await stopTracking();
        setTitleModalVisible(true);
    };


    const handleSaveSession = async () => {
        console.log('1. save pressed');

        try {
            const trimmedTitle = sessionTitle.trim();
            console.log('2. title ok');

            const compressedRoute = compressRouteByDistance(route, 10);
            console.log('3. route compressed', route.length, compressedRoute.length);

            const avgSpeed =
            elapsed > 0 ? (distanceMeters / (elapsed / 1000)) * 3.6 : 0;

            console.log('4. avg speed calculated', avgSpeed);

            const newSession = {
                id: Date.now().toString(),
                title: trimmedTitle || 'Untitled Drive',
                date: new Date().toISOString(),
                startTime: timeStampStart,
                endTime: timeStampEnd ?? Date.now(),
                startLocation: locStart,
                endLocation: locEnd,
                durationMs: elapsed,
                distanceMeters,
                averageSpeedKmh: avgSpeed,
                route: compressedRoute,
            };

            console.log('5. session object created');
            console.log('6. session json size', JSON.stringify(newSession).length);

            await addSession(newSession);
            console.log('7. addSession done');

            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log('8. haptic success done');

            setTitleModalVisible(false);
            console.log('9. modal closed');
            
            resetVars();

            console.log('10. state reset done');
        } catch (e) {
            console.log('SAVE ERROR', e);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    function resetVars() {
        setSessionTitle('');
        setIsStart(false);
        setElapsed(0);
        setLocStart(null);
        setTimeStampStart(null);
        setLocEnd(null);
        setTimeStampEnd(null);
        setSpeedKmh(0);
        setDistanceMeters(0);
        setRoute([]);
    }

    return {
        // Vars
        isStart, locStart, timeStampStart, //start
        elapsed, speedKmh, distanceMeters, route, //live
        locEnd, timeStampEnd, //end
        titleModalVisible, sessionTitle, //save

        // Set
        setSpeedKmh, setRoute, setDistanceMeters, //locations
        setSessionTitle, setTitleModalVisible, //title
        
        // Functions
        handleSession, handleEndSession, handleSaveSession,
    };
}


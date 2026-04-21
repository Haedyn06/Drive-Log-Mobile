import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { addSession } from '../services/localStoreService';

import { requestPermission, compressRouteByDistance } from '../utils/locationAccess';
import { useLocationTracking } from './useLocationTracking';

import { Coord } from '../types/Coord';


export function useDriveSession() {

    // Initial Session
    const [isStart, setIsStart] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [locStart, setLocStart] = useState<Coord | null>(null);
    const [timeStampStart, setTimeStampStart] = useState<number | null>(null);

    // Live Session
    const [elapsed, setElapsed] = useState(0);
    const [pauseTime, setPauseTime] = useState<number | null>(null);
    const [speedKmh, setSpeedKmh] = useState(0);
    const [distanceMeters, setDistanceMeters] = useState(0);
    const [route, setRoute] = useState<Coord[]>([]);
    const [maxSpeedKmh, setMaxSpeedKmh] = useState(0);
    // End Session
    const [locEnd, setLocEnd] = useState<Coord | null>(null);
    const [timeStampEnd, setTimeStampEnd] = useState<number | null>(null);

    // Save
    const [titleModalVisible, setTitleModalVisible] = useState(false);
    const [sessionTitle, setSessionTitle] = useState('');

    const [altitudeMeters, setAltitudeMeters] = useState(0);
    const [maxAltitudeMeters, setMaxAltitudeMeters] = useState(0);
    const [altitudeGainMeters, setAltitudeGainMeters] = useState(0);


    const [startLocationLabel, setStartLocationLabel] = useState('');
    const [endLocationLabel, setEndLocationLabel] = useState('');
    const [selectedCarId, setSelectedCarId] = useState('');
    const [notes, setNotes] = useState('');
    
    const { startTracking, stopTracking } = useLocationTracking({
        setSpeedKmh,
        setMaxSpeedKmh,
        setRoute,
        setDistanceMeters,
        setAltitudeMeters,
        setMaxAltitudeMeters,
        setAltitudeGainMeters
    });

    // Use Effects
    useEffect(() => {
        if (!isStart || isPaused || timeStampStart === null) return;

        const interval = setInterval(() => {
            setElapsed(Date.now() - timeStampStart);
        }, 50);

        return () => clearInterval(interval);
    }, [isStart, isPaused, timeStampStart]);


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

        resetSession();

        setLocStart(startPoint);
        setTimeStampStart(now);
        setRoute([startPoint]);

        return true;
    };

    const handleSession = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // pause
        if (isStart) {
            setIsStart(false);
            setIsPaused(true);
            setPauseTime(Date.now());
            await stopTracking();
            return;
        }

        // resume
        if (isPaused && pauseTime !== null && timeStampStart !== null) {
            const pausedDuration = Date.now() - pauseTime;
            setTimeStampStart(timeStampStart + pausedDuration);

            setIsPaused(false);
            setIsStart(true);
            await startTracking();
            return;
        }

        // brand new start
        const started = await handleStartSession();
        if (!started) return;

        setIsStart(true);
        setIsPaused(false);
        await startTracking();
    };

    const handleEndSession = async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        if (isStart) {
            setIsStart(false);
            await stopTracking();
        }

        const granted = await requestPermission();
            if (!granted) {
            console.log('Permission denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocEnd({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        setTimeStampEnd(Date.now());

        setIsPaused(false);
        setPauseTime(null);
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
                startLocationLabel: startLocationLabel.trim(),
                endLocationLabel: endLocationLabel.trim(),
                carId: selectedCarId || undefined,
                durationMs: elapsed,
                distanceMeters,
                averageSpeedKmh: avgSpeed,
                maxSpeedKmh,
                maxAltitudeMeters,
                altitudeGainMeters,
                route: compressedRoute,
                notes: notes.trim(),
            };

            console.log('5. session object created');
            console.log('6. session json size', JSON.stringify(newSession).length);

            await addSession(newSession);
            console.log('7. addSession done');

            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log('8. haptic success done');

            setTitleModalVisible(false);
            console.log('9. modal closed');
            
            resetSession();

            console.log('10. state reset done');
        } catch (e) {
            console.log('SAVE ERROR', e);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleCancelSave = () => {
        setTitleModalVisible(false);
        setIsPaused(true);
        setPauseTime(Date.now());
    };

    function resetSession() {
        setSessionTitle('');
        setIsStart(false);
        setIsPaused(false);
        setPauseTime(null);

        setElapsed(0);
        setLocStart(null);
        setTimeStampStart(null);
        setLocEnd(null);
        setTimeStampEnd(null);

        setSpeedKmh(0);
        setDistanceMeters(0);
        setRoute([]);

        setMaxSpeedKmh(0);

        setAltitudeMeters(0);
        setMaxAltitudeMeters(0);
        setAltitudeGainMeters(0);

        setStartLocationLabel('');
        setEndLocationLabel('');
        setSelectedCarId('');
        setNotes('');
    }

    return {
        // Vars
        isStart, locStart, isPaused, timeStampStart,
        elapsed, speedKmh, distanceMeters, route,
        altitudeMeters, maxAltitudeMeters, altitudeGainMeters,
        locEnd, timeStampEnd,
        titleModalVisible, sessionTitle,

        startLocationLabel,
        endLocationLabel,
        selectedCarId,
        notes,
        setNotes,
        // Set
        setSpeedKmh, setRoute, setDistanceMeters,
        setSessionTitle, setTitleModalVisible,

        setStartLocationLabel,
        setEndLocationLabel,
        setSelectedCarId,
        

        // Functions
        handleSession, handleEndSession, handleSaveSession, resetSession, handleCancelSave
    };
}


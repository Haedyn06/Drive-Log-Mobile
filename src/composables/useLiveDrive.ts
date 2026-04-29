import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { v4 as uuidv4 } from 'uuid';

import { saveSession } from '@/database/methods';
import { requestPermission, compressRouteByDistance } from '@/utils/locationAccess';
import { avgSpeedCalc } from '@/utils/metricsCalc';

import { useLocationTracking } from '@/composables/useLocationTracking';

import type { Coords } from '@/types/CoordinateType';
import type { DriveSession } from "@/types/dbObj/driveSessionType";
import type { SessionCheckpoint } from "@/types/dbObj/checkPointType";
import type { SessionRoutePoint } from "@/types/dbObj/routePointType";
import type { SessionStopPoint } from '@/types/dbObj/stopPointType';
import type { SessionTopSpeed, SessionTopAltitude } from "@/types/dbObj/topMetrics";

import type { VehicleObj } from '@/types/vehicleObj/VehicleType';

export function useLiveDrive() {
    // Live Sessions    
    const [liveStatusSession, setLiveStatusSession] = useState('notstart'); // playing || paused || notstart

    const [elapsedSession, setElapsedSession] = useState(0);
    const [distanceSession, setDistanceSession] = useState(0);
    const [altitudeSession, setAltitudeSession] = useState(0);
    const [altitudeGainSession, setAltitudeGainSession] = useState(0);
    const [speedSession, setSpeedSession] = useState(0);

    const [sessionRoutePoints, setSessionRoutePoints] = useState<SessionRoutePoint[]>([]);
    const [sessionCheckPoints, setSessionCheckPoints] = useState<SessionCheckpoint[]>([]);
    const [sessionStopPoints, setSessionStopPoints] = useState<SessionStopPoint[]>([]);
    
    // Top
    const [topAltitudeSession, setTopAltitudeSession] = useState<SessionTopAltitude | null>(null);
    const [topSpeedSession, setTopSpeedSession] = useState<SessionTopSpeed | null>(null);

    // Initial Session
    const [locationStart, setLocationStart] = useState<Coords | null>(null);
    const [timeStampStart, setTimeStampStart] = useState(0);

    // End Session
    const [locationEnd, setLocationEnd] = useState<Coords | null>(null);
    const [timeStampEnd, setTimeStampEnd] = useState(0);
    const [onSessionForm, setOnSessionForm] = useState(false);

    
    const { startTracking, stopTracking, getLocationName } = useLocationTracking({
        setSpeedSession, setTopSpeedSession,
        setAltitudeSession, setTopAltitudeSession, setAltitudeGainSession,
        setDistanceSession, setSessionRoutePoints, setSessionStopPoints
    });

    // Use Effects
    useEffect(() => {
        if (liveStatusSession === 'notstart' || liveStatusSession === 'paused' || timeStampStart === null) return;

        const elapsedTime = setInterval(() => setElapsedSession(Date.now() - timeStampStart), 50);

        return () => clearInterval(elapsedTime);
    }, [liveStatusSession, timeStampStart]);




    // Session Handlings

    // Start Session
    async function handleStartSession() {
        const granted = await requestPermission();
        if (!granted) {
            console.log('Permission denied');
            return false;
        }

        const location = await Location.getCurrentPositionAsync({});
        const currentCoords = { 
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude,
            altitude: location.coords.altitude ?? undefined
        };

        handleResetSession();

        const sessionRoutePoint: SessionRoutePoint = {
            location: currentCoords,
            timestamp: Date.now()
        };

        setLocationStart(currentCoords);
        setSessionRoutePoints([sessionRoutePoint]);
        setTimeStampStart(Date.now());

        return true;
    };


    async function handleLiveSession() {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (liveStatusSession === 'playing') {
            await stopTracking();
            setLiveStatusSession('paused');
            return;
        }

        if (liveStatusSession === 'paused') {
            await startTracking();
            setLiveStatusSession('playing');
            return;
        }

        if (liveStatusSession === 'notstart') {
            const started = await handleStartSession();

            if (!started) return;

            await startTracking();
            setLiveStatusSession('playing');
        }
    }



    async function handleEndSession() {
        // Pause
        if (liveStatusSession === 'playing') {
            setLiveStatusSession('paused');
            await stopTracking();
        }

        // Check Perms
        const granted = await requestPermission();
        if (!granted) {
            console.log('Permission denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const currentCoords = { 
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude,
            altitude: location.coords.altitude ?? undefined
        };

        setLocationEnd(currentCoords);
        setTimeStampEnd(Date.now());
        setOnSessionForm(true);
    };



    async function handleSaveSession(sessionTitle:string, startLocName: string, endLocName: string, noteSession: string, vehicleSession?: VehicleObj) {
        try {
            const startName = startLocName.trim() || (locationStart ? await getLocationName(locationStart) : "");

            const endName = endLocName.trim() || (locationEnd ? await getLocationName(locationEnd) : "");

            const driveSession: DriveSession = {
                id: uuidv4(),
                title: sessionTitle || 'Drive',
                date: Date.now(),
                notes: noteSession.trim(),

                elapsedTime: elapsedSession,
                timestampStart: timeStampStart,
                timestampEnd: timeStampEnd,

                startLocationName: startName,
                locationStart: locationStart ?? { latitude: 0, longitude: 0 },

                endLocationName: endName,
                locationEnd: locationEnd ?? { latitude: 0, longitude: 0 },

                averageSpeed: avgSpeedCalc(elapsedSession, distanceSession),
                altitudeGained: altitudeGainSession,
                distance: distanceSession,

                vehicleId: vehicleSession?.id ?? undefined
            }

            saveSession(driveSession, sessionCheckPoints, sessionRoutePoints, sessionStopPoints, topSpeedSession, topAltitudeSession)
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setOnSessionForm(false);
            handleResetSession();

        } catch (e) {
            console.log('SAVE ERROR', e);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    }

    const handleCancelSave = () => {
        setOnSessionForm(false);
        setLiveStatusSession('paused');
    };

    function handleResetSession() {
        setLiveStatusSession('notstart');

        setElapsedSession(0);
        setDistanceSession(0);
        setAltitudeSession(0);
        setSpeedSession(0);

        setSessionRoutePoints([]);
        setSessionCheckPoints([]);
        setSessionStopPoints([]);

        setTopAltitudeSession(null);
        setTopSpeedSession(null);
        
        setLocationStart(null);
        setTimeStampStart(0);

        setLocationEnd(null);
        setTimeStampEnd(0);

        setOnSessionForm(false);

        setAltitudeGainSession(0);
    }


    async function handleCheckpointSession(note: string, types: SessionCheckpoint['type'], photos: string[] = []) {
        const location = await Location.getCurrentPositionAsync({});

        const checkpoint: SessionCheckpoint = {
            id: uuidv4(),
            type: types || 'checkpoint',

            location: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                altitude: location.coords.altitude ?? 0,
            },
            distance: distanceSession,
            timestamp: Date.now(),
            images: photos,
            notes: note || '',
        };

        setSessionCheckPoints((prev) => [...prev, checkpoint]);
    }

    return {
        locationStart, timeStampStart,

        liveStatusSession, elapsedSession, 
        distanceSession, altitudeSession, speedSession, altitudeGainSession,
        topAltitudeSession, topSpeedSession, 
        
        sessionRoutePoints, sessionCheckPoints, sessionStopPoints,
        
        locationEnd, timeStampEnd, onSessionForm,
        
        handleStartSession, handleLiveSession, handleEndSession,
        handleSaveSession, handleCancelSave,handleResetSession,
        handleCheckpointSession
    };
}


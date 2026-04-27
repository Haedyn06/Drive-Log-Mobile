import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

import { addSession } from '@/services/driveSessionService';

import { requestPermission, compressRouteByDistance } from '@/utils/locationAccess';
import { avgSpeedCalc } from '@/utils/metricsCalc';


import { useLocationTracking } from '@/composables/useLocationTracking';

import type { Coords, SessionLocation } from '@/types/sessionObj/LocationType';

import type { TopAltitude, TopSpeed, AltitudeMetrics, SpeedMetrics } from '@/types/sessionObj/MetricsType';

import type { SessionCheckpoint } from '@/types/sessionObj/CheckpointType';
import type { SessionStopPoint } from '@/types/sessionObj/StopPointType';

import type { VehicleObj } from '@/types/vehicleObj/VehicleType';
import { DriveSessionObj } from '@/types/sessionObj/DriveSessionType';

export function useLiveDrive() {
    // Live Sessions    
    const [liveStatusSession, setLiveStatusSession] = useState('notstart'); // playing || paused || notstart
    const [mapRoute, setMapRoute] = useState<Coords[]>([]);

    const [elapsedSession, setElapsedSession] = useState(0);
    const [distanceSession, setDistanceSession] = useState(0);
    const [altitudeSession, setAltitudeSession] = useState(0);
    const [altitudeGainSession, setAltitudeGainSession] = useState(0);
    const [speedSession, setSpeedSession] = useState(0);
    const [checkpointSession, setCheckpointSession] = useState<SessionCheckpoint[]>([]);
    const [stopSession, setStopSession] = useState<SessionStopPoint[]>([]);
    
    // Top
    const [topAltitudeSession, setTopAltitudeSession] = useState<TopAltitude | null>(null);
    const [topSpeedSession, setTopSpeedSession] = useState<TopSpeed | null>(null);

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
        setDistanceSession, setMapRoute, setStopSession
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

        setLocationStart(currentCoords);
        setMapRoute([currentCoords]);
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



    async function handleSaveSession(sessionTitle:string, startLocName: string = '', endLocName: string, noteSession: string, vehicleSession?: VehicleObj) {
        try {

            const startLoc: SessionLocation = {
                name: startLocName || await getLocationName(locationStart ?? undefined), 
                coords: locationStart ?? undefined 
            };
            
            const endLoc: SessionLocation = {
                name: endLocName || await getLocationName(locationEnd ?? undefined), 
                coords: locationEnd ?? undefined 
            };

            const altitudeMetric: AltitudeMetrics = {
                altitudeGained: altitudeGainSession,
                topAltitude: topAltitudeSession ?? undefined
            };

            const speedMetric: SpeedMetrics = {
                avgSpeed: avgSpeedCalc(elapsedSession, distanceSession),
                topSpeed: topSpeedSession ?? undefined
            };
            


            const newSession: DriveSessionObj = {
                id: Date.now().toString(),
                title: sessionTitle.trim() || 'Drive',
                date: new Date().toISOString(),
                images: [],
                notes: noteSession.trim(),
                mappedRoute: compressRouteByDistance(distanceSession, mapRoute),
                
                timestamps: {
                    elapsedTime: elapsedSession,
                    timestampStart: timeStampStart,
                    timestampEnd: timeStampEnd
                },

                locations: {
                    startLocation: startLoc,
                    endLocation: endLoc
                },

                metrics: {
                    altitude: altitudeMetric,
                    speed: speedMetric,
                    distance: distanceSession
                },

                checkpoints: checkpointSession,
                stops: stopSession ?? [],
                vehicle: vehicleSession ?? undefined
            };

            await addSession(newSession);
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
        setMapRoute([]);

        setElapsedSession(0);
        setDistanceSession(0);
        setAltitudeSession(0);
        setSpeedSession(0);

        setCheckpointSession([]);
        setStopSession([]);

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
            id: `${Date.now().toString()}chk`,
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

        setCheckpointSession((prev) => [...prev, checkpoint]);
    }

    return {
        liveStatusSession, mapRoute, elapsedSession, 
        distanceSession, altitudeSession, altitudeGainSession,
        speedSession, checkpointSession, topAltitudeSession,
        topSpeedSession, locationStart, timeStampStart,
        locationEnd, timeStampEnd, onSessionForm,
        stopSession,

        handleStartSession, handleLiveSession, handleEndSession,
        handleSaveSession, handleCancelSave,handleResetSession,
        handleCheckpointSession
    };
}


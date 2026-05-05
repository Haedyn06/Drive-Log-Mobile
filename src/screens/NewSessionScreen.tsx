import { Text, View, ScrollView, Pressable } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useSharedDriveSession } from '@/context/DriveSessionContext';

import SaveSessionModal from '@/components/forms/SaveSession';
import DriveSessionMap from '@/components/maps/DriveSessionMap';
import FocusDriveSessionCard from '@/components/cards/FocusDriveSessionCard';
import StartSessionCompB from '@/components/startSession/StartSessionCompB';
import LiveMapFull from '@/components/maps/LiveMapFull';
import LiveMapMini from '@/components/maps/LiveMapMini';
import { getFullSessionObj, getAllDriveSessions } from '@/services/sessionService';

import { NewSessionStyles } from '@/styles/NewSessionStyle';

import type { DriveSessionObj } from '@/types/sessionObj/DriveSessionType';

export default function NewSessionScreen() {
    const {
        locationStart, timeStampStart,

        liveStatusSession, elapsedSession, 
        distanceSession, altitudeSession, speedSession, altitudeGainSession,
        topAltitudeSession, topSpeedSession, 
        
        sessionRoutePoints, sessionCheckPoints, sessionStopPoints,
        
        locationEnd, timeStampEnd, onSessionForm,
        
        handleStartSession, handleLiveSession, handleEndSession,
        handleSaveSession, handleCancelSave,handleResetSession,
        handleCheckpointSession
    } = useSharedDriveSession();
    
    const [recentSession, setRecentSession] = useState<DriveSessionObj | null>(null);
    const [routeModalVisible, setRouteModalVisible] = useState(false);


    useFocusEffect(
        useCallback(() => {
            async function loadData() {
                try {
                    const sessions = await getAllDriveSessions(1, 'newest');
                    const sessionid = sessions[0].id;
                    if (sessionid) setRecentSession(await getFullSessionObj(sessionid));
                } catch (e) {
                    console.log('Failed loading data', e);
                }
            }

            loadData();
        }, [])
    );

    const isNotStart = 'notstart';
    const isPlaying = 'playing';
    const isPaused =  'paused';

    const isIdle = liveStatusSession === isNotStart && elapsedSession === 0;
    const isLiveOrEnded = liveStatusSession !== isNotStart || elapsedSession > 0;

    return (
        <ScrollView style={NewSessionStyles.screen} contentContainerStyle={NewSessionStyles.content}>
            <StartSessionCompB
                liveStatus={liveStatusSession}
                elapsed={elapsedSession}
                speed={speedSession}
                distance={distanceSession}
                altitude={altitudeSession}
                handleLive={handleLiveSession}
                handleEnd={handleEndSession}
                handleReset={handleResetSession}
                locStart={locationStart}
                locEnd={locationEnd}
                route={sessionRoutePoints}
                checkpoints={sessionCheckPoints}
            />

            {isIdle && (
                <View style={NewSessionStyles.sectionGap}>
                    <FocusDriveSessionCard item={recentSession} heading='Your Recent Drive' />
                </View>
            )}

            {isLiveOrEnded && (
                <>
                    <View style={NewSessionStyles.timeCard}>
                        <Text style={NewSessionStyles.cardLabel}>Elapsed Time</Text>
                        <Text style={NewSessionStyles.timeValue}>
                            {Math.floor(elapsedSession / 3600000).toString().padStart(2, '0')}:
                            {Math.floor((elapsedSession % 3600000) / 60000).toString().padStart(2, '0')}:
                            {Math.floor((elapsedSession % 60000) / 1000).toString().padStart(2, '0')}.
                            {Math.floor((elapsedSession % 1000) / 10).toString().padStart(2, '0')}
                        </Text>
                    </View>

                    <View style={NewSessionStyles.statsRow}>
                        <View style={NewSessionStyles.statCard}>
                            <Text style={NewSessionStyles.statLabel}>Distance</Text>
                            <Text style={NewSessionStyles.statValue}>
                                {distanceSession >= 1000
                                    ? `${(distanceSession / 1000).toFixed(1)}KM`
                                    : `${distanceSession.toFixed(0)}M`}
                            </Text>
                        </View>

                        <View style={NewSessionStyles.statCard}>
                            <Text style={NewSessionStyles.statLabel}>Speed</Text>
                            <Text style={NewSessionStyles.statValue}>{speedSession.toFixed(0)}km/h</Text>
                        </View>

                        <View style={NewSessionStyles.statCard}>
                            <Text style={NewSessionStyles.statLabel}>Altitude</Text>
                            <Text style={NewSessionStyles.statValue}>
                                {altitudeSession.toFixed(0)}m
                            </Text>
                        </View>
                    </View>

                    <View style={NewSessionStyles.mapCard}>
                        <Pressable onPress={() => setRouteModalVisible(true)}>
                            <LiveMapMini timeStart={timeStampStart} locStart={locationStart} route={sessionRoutePoints} 
                                checkpoints={sessionCheckPoints} mapStyle={{height:230}} wrapperStyle={NewSessionStyles.mapWrapperOverride}
                            />
                        </Pressable>
                    </View>

                    <LiveMapFull
                        visible={routeModalVisible}
                        onClose={() => setRouteModalVisible(false)}
                        liveStatus={liveStatusSession}
                        elapsed={elapsedSession}
                        speed={speedSession}
                        distance={distanceSession}
                        locStart={locationStart}
                        locEnd={locationEnd}
                        route={sessionRoutePoints}
                        handleLive={handleLiveSession}
                        handleEnd={handleEndSession}
                        handleReset={handleResetSession}
                        altitude={altitudeSession}
                        checkpoints={sessionCheckPoints}
                    />

                </>
            )}

        <SaveSessionModal visible={onSessionForm} onClose={handleCancelSave} />
        </ScrollView>
    );
}
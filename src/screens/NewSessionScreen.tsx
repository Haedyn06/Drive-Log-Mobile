import { Text, View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { getSessions } from '../services/localStoreService';
import type { DriveSession } from '../types/DriveSession';

import { useSharedDriveSession } from '../context/DriveSessionContext';

import StartSessionComp from '../components/StartSessionComp';
import SaveSessionModal from '../components/SaveSession';
import DriveSessionMap from '../components/DriveSessionMap';
import RecentDriveSession from '../components/RecentDriveSession';
import StartSessionCompB from '../components/StartSessionCompB';
import LiveMapModal from '../components/LiveMapSession';

import { NewSessionStyles } from '../styles/NewSessionStyle';

export default function NewSessionScreen() {
    const {
        isStart, locStart, isPaused,
        elapsed, speedKmh, distanceMeters, route, altitudeMeters,
        locEnd,
        titleModalVisible, sessionTitle,

        setTitleModalVisible, setSessionTitle,

        handleSession, handleEndSession, handleSaveSession, resetSession,

        startLocationLabel,
        endLocationLabel,
        carType,
        notes, setNotes,

        setStartLocationLabel,
        setEndLocationLabel,
        setCarType

    } = useSharedDriveSession();

    const [recentSession, setRecentSession] = useState<DriveSession | null>(null);
    const [routeModalVisible, setRouteModalVisible] = useState(false);


    useFocusEffect(
        useCallback(() => {
            async function loadRecentSession() {
                try {
                    const data = await getSessions();
                    const sorted = [...data].reverse();
                    setRecentSession(sorted.length > 0 ? sorted[0] : null);
                } catch (e) {
                    console.log('Failed loading recent session', e);
                }
            }

            loadRecentSession();
        }, [])
    );

    const isIdle = !isStart && elapsed === 0;
    const isLiveOrEnded = isStart || elapsed > 0;

    return (
        <ScrollView style={NewSessionStyles.screen} contentContainerStyle={NewSessionStyles.content}>
            <StartSessionCompB
                isPaused={isPaused}
                isStart={isStart}
                elapsed={elapsed}
                speedKmh={speedKmh}
                distanceMeters={distanceMeters}
                altitudeMeters={altitudeMeters}
                handleSession={handleSession}
                handleEndSession={handleEndSession}
                resetSession={resetSession}
                locStart={locStart}
                locEnd={locEnd}
                route={route}
            />

            {isIdle && (
                <View style={NewSessionStyles.sectionGap}>
                    <RecentDriveSession item={recentSession} />
                </View>
            )}

            {isLiveOrEnded && (
                <>
                    <View style={NewSessionStyles.timeCard}>
                        <Text style={NewSessionStyles.cardLabel}>Elapsed Time</Text>
                        <Text style={NewSessionStyles.timeValue}>
                            {Math.floor(elapsed / 3600000).toString().padStart(2, '0')}:
                            {Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0')}:
                            {Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0')}.
                            {Math.floor((elapsed % 1000) / 10).toString().padStart(2, '0')}
                        </Text>
                    </View>

                    <View style={NewSessionStyles.statsRow}>
                        <View style={NewSessionStyles.statCard}>
                            <Text style={NewSessionStyles.statLabel}>Distance</Text>
                            <Text style={NewSessionStyles.statValue}>
                                {distanceMeters >= 1000
                                    ? `${(distanceMeters / 1000).toFixed(1)}KM`
                                    : `${distanceMeters.toFixed(0)}M`}
                            </Text>
                        </View>

                        <View style={NewSessionStyles.statCard}>
                            <Text style={NewSessionStyles.statLabel}>Speed</Text>
                            <Text style={NewSessionStyles.statValue}>{speedKmh.toFixed(0)}km/h</Text>
                        </View>

                        <View style={NewSessionStyles.statCard}>
                            <Text style={NewSessionStyles.statLabel}>Altitude</Text>
                            <Text style={NewSessionStyles.statValue}>
                                {altitudeMeters.toFixed(0)}m
                            </Text>
                        </View>
                    </View>

                    <View style={NewSessionStyles.mapCard}>
                        <Pressable onPress={() => setRouteModalVisible(true)}>
                            <DriveSessionMap
                                title=""
                                isStart={isStart}
                                showUserLocation
                                locStart={locStart}
                                locEnd={locEnd}
                                route={route}
                                mapStyle={{ height: 230 }}
                                wrapperStyle={NewSessionStyles.mapWrapperOverride}
                                previewOnly={false}
                            />
                        </Pressable>
                    </View>


                    <LiveMapModal
                        visible={routeModalVisible}
                        onClose={() => setRouteModalVisible(false)}
                        isStart={isStart}
                        isPaused={isPaused}
                        elapsed={elapsed}
                        speedKmh={speedKmh}
                        distanceMeters={distanceMeters}
                        locStart={locStart}
                        locEnd={locEnd}
                        route={route}
                        handleSession={handleSession}
                        handleEndSession={handleEndSession}
                        resetSession={resetSession}
                        altitudeMeters={altitudeMeters}
                    />
                </>
            )}

            <SaveSessionModal
                visible={titleModalVisible}
                sessionTitle={sessionTitle}
                setSessionTitle={setSessionTitle}
                startLocationLabel={startLocationLabel}
                setStartLocationLabel={setStartLocationLabel}
                endLocationLabel={endLocationLabel}
                setEndLocationLabel={setEndLocationLabel}
                carType={carType}
                setCarType={setCarType}
                notes={notes}
                setNotes={setNotes}
                onClose={() => setTitleModalVisible(false)}
                onSave={handleSaveSession}
            />
        </ScrollView>
    );
}
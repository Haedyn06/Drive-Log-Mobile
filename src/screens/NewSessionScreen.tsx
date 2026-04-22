import { Text, View, ScrollView, Pressable } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import type { DriveSession } from '@/types/DriveSession';
import type { CarInfo } from '@/types/CarInfo';

import { getSessions } from '@/services/localStoreService';
import { getCars } from '@/services/carService';

import { useSharedDriveSession } from '@/context/DriveSessionContext';

import SaveSessionModal from '@/components/forms/SaveSession';
import DriveSessionMap from '@/components/maps/DriveSessionMap';
import RecentDriveSession from '@/components/cards/RecentDriveSession';
import StartSessionCompB from '@/components/startSession/StartSessionCompB';
import LiveMapModal from '@/components/maps/LiveMapSession';

import { NewSessionStyles } from '@/styles/NewSessionStyle';

export default function NewSessionScreen() {
    const {
        isStart, locStart, isPaused,
        elapsed, speedKmh, distanceMeters, route, altitudeMeters,
        locEnd,
        titleModalVisible, sessionTitle,

        setTitleModalVisible, setSessionTitle,

        timeStampStart, timeStampEnd,

        handleSession, handleEndSession, handleSaveSession, resetSession, handleCancelSave,

        startLocationLabel,
        endLocationLabel,
        selectedCarId,
        notes, setNotes,

        setStartLocationLabel,
        setEndLocationLabel,
        setSelectedCarId,
        checkpoints
    } = useSharedDriveSession();
    
    const [cars, setCars] = useState<CarInfo[]>([]);
    const [recentSession, setRecentSession] = useState<DriveSession | null>(null);
    const [routeModalVisible, setRouteModalVisible] = useState(false);


    useFocusEffect(
        useCallback(() => {
            async function loadData() {
                try {
                    const sessionData = await getSessions(undefined, 'newest');
                    setRecentSession(sessionData.length > 0 ? sessionData[0] : null);

                    const carData = await getCars();
                    setCars(carData);
                } catch (e) {
                    console.log('Failed loading data', e);
                }
            }

            loadData();
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
                checkpoints={checkpoints}
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
                                checkpoints={checkpoints}
                                previewOnly={false}
                                timeEnd={timeStampEnd}
                                timeStart={timeStampStart}
                                distance={distanceMeters}
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
                        checkpoints={checkpoints}
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
            cars={cars}
            selectedCar={selectedCarId}
            setSelectedCar={setSelectedCarId}
            notes={notes}
            setNotes={setNotes}
            onClose={handleCancelSave}
            onSave={handleSaveSession}
        />
        </ScrollView>
    );
}
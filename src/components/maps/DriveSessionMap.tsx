import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { formatDistance, formatTimeOnly } from '@/utils/format';

import type { Coord } from '@/types/Coord';
import type { SessionCheckpoint } from '@/types/SessionCheckpoint';

type DriveSessionMapProps = {
    title?: string;
    isStart?: boolean;
    showUserLocation?: boolean;
    locStart: Coord | null;
    locEnd: Coord | null;
    route: Coord[];
    mapStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    checkpoints?: SessionCheckpoint[];
    previewOnly?: boolean;
    timeStart: number | null;
    timeEnd?: number | null;
    distance?: number;
};

export default function DriveSessionMap({
    title = 'Route',
    isStart = false,
    showUserLocation = false,
    locStart,
    locEnd,
    timeEnd,
    timeStart,
    distance,
    route,
    mapStyle,
    wrapperStyle,
    checkpoints,
    previewOnly = true,
}: DriveSessionMapProps) {
    const [fullScreen, setFullScreen] = useState(false);

    const initialLat = route[0]?.latitude ?? locStart?.latitude ?? 51.0447;
    const initialLng = route[0]?.longitude ?? locStart?.longitude ?? -114.0719;

    const mapContent = (
        <MapView
            key={route.length === 0 ? 'empty-map' : 'active-map'}
            style={[styles.map, mapStyle]}
            showsUserLocation={showUserLocation}
            followsUserLocation={isStart}
            scrollEnabled={!previewOnly}
            zoomEnabled={!previewOnly}
            rotateEnabled={!previewOnly}
            pitchEnabled={!previewOnly}
            toolbarEnabled={!previewOnly}
            initialRegion={{
                latitude: initialLat,
                longitude: initialLng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
        >
            {locStart && (
                <Marker coordinate={locStart} title={`Start (0m)`} description={`${formatTimeOnly(timeStart)}`} pinColor="green" />
            )}

            {locEnd && (
                <Marker coordinate={locEnd} title={`End (${formatDistance(distance ?? 0)})`} description={`${formatTimeOnly(timeEnd)}`} pinColor="red" />
            )}

            {checkpoints?.map((i) => (
                <Marker
                    key={i.id}
                    coordinate={i.location}
                    title={i.type ? `${i.type} (${formatDistance(Number(i.distance)) ?? 0})` : "Checkpoint"}
                    description={`${i.note || ""} • ${formatTimeOnly(i.timestamp)}`}
                    pinColor="blue"
                />
            ))}
            
            {route.length > 1 && (
                <Polyline coordinates={route} strokeColor="#00a2ff" strokeWidth={6} />
            )}
        </MapView>
    );

    return (
        <>
            <View style={[styles.mapWrapper, wrapperStyle]}>
                {previewOnly ? (
                    <Pressable onPress={() => setFullScreen(true)}>
                        <View pointerEvents="none">
                            {mapContent}
                        </View>
                    </Pressable>
                ) : (
                    mapContent
                )}
            </View>

            <Modal
                visible={fullScreen}
                animationType="slide"
                onRequestClose={() => setFullScreen(false)}
            >
                <View style={styles.fullScreenContainer}>
                    <MapView
                        style={styles.fullScreenMap}
                        showsUserLocation={showUserLocation}
                        followsUserLocation={isStart}
                        scrollEnabled
                        zoomEnabled
                        rotateEnabled
                        pitchEnabled
                        toolbarEnabled
                        initialRegion={{
                            latitude: initialLat,
                            longitude: initialLng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        {locStart && (
                            <Marker coordinate={locStart} title={`Start (0m)`} description={`${formatTimeOnly(timeStart)}`} pinColor="green" />
                        )}

                        {locEnd && (
                            <Marker coordinate={locEnd} title={`End (${formatDistance(distance ?? 0)})`} description={`${formatTimeOnly(timeEnd)}`} pinColor="red" />
                        )}

                        {checkpoints?.map((i) => (
                            <Marker
                                key={i.id}
                                coordinate={i.location}
                                title={i.type ? `${i.type} (${formatDistance(Number(i.distance)) ?? 0})` : "Checkpoint"}
                                description={`${i.note || "No note"} • ${formatTimeOnly(i.timestamp)}`}
                                pinColor="blue"
                            />
                        ))}
                        
                        {route.length > 1 && (
                            <Polyline coordinates={route} strokeColor="#00a2ff" strokeWidth={6} />
                        )}
                    </MapView>

                    <Pressable style={styles.closeBtn} onPress={() => setFullScreen(false)}>
                        <Text style={styles.closeBtnText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    mapWrapper: {
        borderRadius: 10,
        overflow: 'hidden',
    },

    map: {
        width: '100%',
        height: 350,
    },

    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    fullScreenMap: {
        flex: 1,
    },

    closeBtn: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        elevation: 3,
    },

    closeBtnText: {
        fontWeight: 'bold',
    },
});
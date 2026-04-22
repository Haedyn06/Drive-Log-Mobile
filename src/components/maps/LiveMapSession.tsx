import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { formatTimeOnly } from '@/utils/format';
import CheckpointFormModal from '@/components/forms/CheckpointForm';

import type { SessionCheckpoint } from '@/types/SessionCheckpoint';
import type { Coord } from '@/types/Coord';

type LiveMapModalProps = {
    visible: boolean;
    onClose: () => void;
    isStart: boolean;
    isPaused: boolean;
    elapsed: number;
    speedKmh: number;
    distanceMeters: number;
    altitudeMeters: number;
    locStart: Coord | null;
    locEnd: Coord | null;
    route: Coord[];
    checkpoints: SessionCheckpoint[];
    handleSession: () => void;
    handleEndSession: () => void;
    resetSession: () => void;
};

export default function LiveMapModal({ 
        visible, onClose, isStart, isPaused, 
        elapsed, speedKmh, distanceMeters, altitudeMeters, 
        locStart, locEnd, route = [], 
        handleSession, handleEndSession, resetSession, checkpoints

    }: LiveMapModalProps)
{
    const [checkpointModalVisible, setCheckpointModalVisible] = useState(false);
    
    const initialLat = route?.[0]?.latitude ?? locStart?.latitude ?? 51.0447;
    const initialLng = route?.[0]?.longitude ?? locStart?.longitude ?? -114.0719;

    const mainIcon = isStart ? 'pause' : 'play';

    const handleFinish = async () => {
        await handleEndSession();
        onClose();
    };

    function handleCheckpointForm() {
        setCheckpointModalVisible(true);
    }

    function handleCloseCheckpointForm() {
        setCheckpointModalVisible(false);
    }


    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.fullScreenContainer}>
                <MapView
                    style={styles.fullScreenMap}
                    showsUserLocation
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
                        <Marker coordinate={locStart} title="Start" pinColor="green" />
                    )}

                    {locEnd && (
                        <Marker coordinate={locEnd} title="End" pinColor="red" />
                    )}

                    {checkpoints.map((i) => (
                        <Marker
                            key={i.id}
                            coordinate={i.location}
                            title={i.type ? `${i.type} (${i.distance ?? 0}m)` : "Checkpoint"}
                            description={`${i.note || "No note"} • ${formatTimeOnly(i.timestamp)}`}
                            pinColor="blue"
                        />
                    ))}

                    {route.length > 1 && (
                        <Polyline coordinates={route} strokeColor="#00a2ff" strokeWidth={6} />
                    )}
                </MapView>

                <View style={styles.topOverlay}>
                    <Text style={styles.elapsedText}>
                        {Math.floor(elapsed / 3600000).toString().padStart(2, '0')}:
                        {Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0')}:
                        {Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0')}.
                        {Math.floor((elapsed % 1000) / 10).toString().padStart(2, '0')}
                    </Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statPill}>
                            <Text style={styles.statLabel}>Speed</Text>
                            <Text style={styles.statValue}>{speedKmh.toFixed(0)} km/h</Text>
                        </View>

                        <View style={styles.statPill}>
                            <Text style={styles.statLabel}>Distance</Text>
                            <Text style={styles.statValue}>
                                {distanceMeters >= 1000
                                    ? `${(distanceMeters / 1000).toFixed(1)} km`
                                    : `${distanceMeters.toFixed(0)} m`}
                            </Text>
                        </View>

                        <View style={styles.statPill}>
                            <Text style={styles.statLabel}>Altitude</Text>
                            <Text style={styles.statValue}>
                                {altitudeMeters.toFixed(0)} m
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bottomOverlay}>
                    <Pressable style={styles.closeBtn} onPress={onClose}>
                        <Ionicons name="chevron-down" size={24} color="#111" />
                    </Pressable>

                    <Pressable style={styles.controlBtn} onPress={handleSession}>
                        <Ionicons name={mainIcon} size={28} color="#fff" />
                    </Pressable>

                    <Pressable style={styles.checkpntBtn} onPress={handleCheckpointForm}>
                        <Ionicons name="add-circle-outline" size={30} color="#fff" />
                    </Pressable>

                    <Pressable style={styles.finishBtn} onPress={handleFinish}>
                        <Ionicons name="flag-outline" size={22} color="#111" />
                        <Text style={styles.finishText}>Finish</Text>
                    </Pressable>
                </View>

                <CheckpointFormModal
                    visible={checkpointModalVisible}
                    onClose={handleCloseCheckpointForm}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#000',
    },

    fullScreenMap: {
        flex: 1,
    },

    topOverlay: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        gap: 14,
    },

    elapsedText: {
        alignSelf: 'center',
        backgroundColor: 'rgba(20,20,20,0.85)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 999,
        fontSize: 26,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 1,
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },

    statPill: {
        flex: 1,
        backgroundColor: 'rgba(20,20,20,0.85)',
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: 'center',
    },

    statLabel: {
        fontSize: 11,
        color: '#aaa',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    statValue: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '900',
        marginTop: 4,
    },

    bottomOverlay: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },

    closeBtn: {
        width: 56,
        height: 56,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },

    controlBtn: {
        width: 80,
        height: 80,
        borderRadius: 999,
        backgroundColor: '#ff3b30',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },


    checkpntBtn: {
        width: 60,
        height: 60,
        borderRadius: 999,
        backgroundColor: '#3094ff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },

    finishBtn: {
        flex: 1,
        height: 60,
        borderRadius: 999,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        elevation: 5,
    },

    finishText: {
        fontSize: 15,
        fontWeight: '900',
        color: '#111',
        letterSpacing: 0.5,
    },
});
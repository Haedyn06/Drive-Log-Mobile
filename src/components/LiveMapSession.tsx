import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import type { Coord } from '../types/Coord';

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
    handleSession: () => void;
    handleEndSession: () => void;
    resetSession: () => void;
};

export default function LiveMapModal({
    visible,
    onClose,
    isStart,
    isPaused,
    elapsed,
    speedKmh,
    distanceMeters,
    altitudeMeters,
    locStart,
    locEnd,
    route = [],
    handleSession,
    handleEndSession,
    resetSession,
}: LiveMapModalProps) {
    const initialLat = route?.[0]?.latitude ?? locStart?.latitude ?? 51.0447;
    const initialLng = route?.[0]?.longitude ?? locStart?.longitude ?? -114.0719;

    const mainIcon = isStart ? 'pause' : 'play';

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

                    {route.length > 1 && (
                        <Polyline coordinates={route} strokeColor="#000000" strokeWidth={4} />
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

                    <Pressable style={styles.finishBtn} onPress={handleEndSession}>
                        <Ionicons name="flag-outline" size={22} color="#111" />
                        <Text style={styles.finishText}>Finish</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    fullScreenMap: {
        flex: 1,
    },

    topOverlay: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        gap: 12,
    },

    elapsedText: {
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        fontSize: 28,
        fontWeight: '800',
        color: '#111',
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },

    statPill: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minWidth: 120,
        alignItems: 'center',
    },

    statLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },

    statValue: {
        fontSize: 18,
        color: '#111',
        fontWeight: '800',
        marginTop: 2,
    },

    bottomOverlay: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },

    closeBtn: {
        width: 56,
        height: 56,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.96)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    controlBtn: {
        width: 72,
        height: 72,
        borderRadius: 999,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
    },

    finishBtn: {
        flex: 1,
        height: 56,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.96)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },

    finishText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111',
    },

    resetBtn: {
        width: 56,
        height: 56,
        borderRadius: 999,
        backgroundColor: '#2b2328',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
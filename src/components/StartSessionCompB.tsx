import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import LiveMapModal from './LiveMapSession';
import type { Coord } from '../types/Coord';

type StartSessionCompBProps = {
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

export default function StartSessionCompB({
    isStart,
    isPaused,
    elapsed,
    speedKmh,
    distanceMeters,
    altitudeMeters,
    locStart,
    locEnd,
    route,
    handleSession,
    handleEndSession,
    resetSession
}: StartSessionCompBProps) {
    const [mapVisible, setMapVisible] = useState(false);

    const hasSession = isStart || isPaused || elapsed > 0;
    const mainIcon = isStart ? 'pause' : 'play';

    const handleMainPress = async () => {
        if (!isStart && !isPaused && elapsed === 0) {
            await handleSession();
            setMapVisible(true);
            return;
        }

        await handleSession();
    };

    const handleFinishAndClose = async () => {
        await handleEndSession();
        setMapVisible(false);
    };

    const handleResetAndClose = () => {
        resetSession();
        setMapVisible(false);
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.card}>
                <Pressable style={styles.mainPill} onPress={handleMainPress}>
                    <Ionicons
                        name={mainIcon}
                        size={58}
                        color="#ffffff"
                        style={styles.mainIcon}
                    />
                </Pressable>
            </View>

            {hasSession && (
                <View style={styles.bottomRow}>
                    <Pressable style={[styles.bottomBtn, styles.finishBtn]} onPress={handleFinishAndClose}>
                        <Ionicons name="flag-outline" size={20} color="#111" />
                        <Text style={styles.finishText}>Finish</Text>
                    </Pressable>

                    <Pressable style={[styles.bottomBtn, styles.resetBtn]} onPress={handleResetAndClose}>
                        <Ionicons name="refresh-outline" size={20} color="#fff" />
                        <Text style={styles.resetText}>Reset</Text>
                    </Pressable>
                </View>
            )}

            <LiveMapModal
                visible={mapVisible}
                onClose={() => setMapVisible(false)}
                isStart={isStart}
                isPaused={isPaused}
                elapsed={elapsed}
                speedKmh={speedKmh}
                distanceMeters={distanceMeters}
                locStart={locStart}
                locEnd={locEnd}
                route={route}
                handleSession={handleSession}
                handleEndSession={handleFinishAndClose}
                resetSession={handleResetAndClose}
                altitudeMeters={altitudeMeters}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 18,
        marginTop: 12,
        marginBottom: 18,
    },

    card: {
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 5,
    },

    mainPill: {
        height: 82,
        borderRadius: 999,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.14,
        shadowRadius: 4,
        elevation: 3,
    },

    mainIcon: {
        textShadowColor: 'rgba(0,0,0,0.25)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    bottomRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 14,
    },

    bottomBtn: {
        flex: 1,
        borderRadius: 999,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 4,
        elevation: 4,
    },

    finishBtn: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#2b2328',
    },

    resetBtn: {
        backgroundColor: '#2b2328',
    },

    finishText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111',
    },

    resetText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
});
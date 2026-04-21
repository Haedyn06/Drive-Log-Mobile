import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import LiveMapModal from './LiveMapSession';
import type { Coord } from '../types/Coord';

import ConfirmationPopup from './ConfirmationPopup';
import SaveSessionModal from './SaveSession';


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
    handleSession: () => Promise<void> | void;
    handleEndSession: () => Promise<void> | void;
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
    const statusLabel = isStart ? 'LIVE' : isPaused ? 'PAUSED' : 'READY';
    const [showPopup, setShowPopup] = useState(false);
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
            <View style={styles.topFrame}>
                <View style={styles.leftStack}>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        <View style={styles.liveWrap}>
                            <View
                                style={[
                                    styles.liveDot,
                                    isStart
                                        ? styles.liveDotLive
                                        : isPaused
                                            ? styles.liveDotPaused
                                            : styles.liveDotReady,
                                ]}
                            />
                            <Text style={styles.liveText}>{statusLabel}</Text>
                        </View>

                        <Pressable
                            style={styles.mapBtn}
                            onPress={() => setMapVisible(true)}
                        >
                                <Ionicons name="map-outline" size={22} color="#1e293b" />
                        </Pressable>
                    </View>


                    <Pressable style={styles.playBtn} onPress={handleMainPress}>
                        <View style={styles.playInner}>
                            <Ionicons name={mainIcon} size={55} color="#fff" />
                        </View>
                    </Pressable>
                </View>
            </View>

            {hasSession && (
                <View style={styles.bottomRow}>
                    <Pressable
                        style={[styles.actionBtn, styles.finishBtn]}
                        onPress={handleFinishAndClose}
                    >
                        <Ionicons name="flag-outline" size={18} color="#15803d" />
                        <Text style={styles.finishText}>Finish</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.actionBtn, styles.resetBtn]}
                        onPress={() => setShowPopup(true)}
                    >
                        <Ionicons name="refresh-outline" size={18} color="#dc2626" />
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

            <ConfirmationPopup
                visible={showPopup}
                label="reset session"
                onCancel={() => setShowPopup(false)}
                onConfirm={() => {
                    handleResetAndClose();
                    setShowPopup(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 18,
        marginTop: 14,
        marginBottom: 20,
    },

    topFrame: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 12,
        backgroundColor: '#ffffff',
        borderRadius: 28,
        padding: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 4,
    },

    leftStack: {
        flex: 1,
        gap: 10,
    },

    liveWrap: {
        alignSelf: 'flex-start',
        minHeight: 34,
        borderRadius: 999,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 7,
    },

    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 999,
    },

    liveDotLive: {
        backgroundColor: '#22c55e',
    },

    liveDotPaused: {
        backgroundColor: '#f59e0b',
    },

    liveDotReady: {
        backgroundColor: '#94a3b8',
    },

    liveText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: 0.8,
    },

    playBtn: {
        width: '100%',
        height: 80,
        borderRadius: 24,
    },

    playInner: {
        flex: 1,
        borderRadius: 24,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 5,
    },

    mapBtn: {
        width: 50,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },

    mapText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
    },

    bottomRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 14,
    },

    actionBtn: {
        flex: 1,
        height: 54,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
    },

    finishBtn: {
        backgroundColor: '#ecfdf5',
        borderColor: '#bbf7d0',
    },

    resetBtn: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },

    finishText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#15803d',
    },

    resetText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#dc2626',
    },
});
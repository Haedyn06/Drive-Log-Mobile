import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatTime, formatDistance } from '../utils/format';
import SaveSessionModal from './SaveSession';
import { useSharedDriveSession } from '../context/DriveSessionContext';
import { useState } from 'react';
import type { CarInfo } from '../types/CarInfo';
import ConfirmationPopup from './ConfirmationPopup';

export default function StartSessionCompA() {

    const {
        isStart, locStart, isPaused,
        elapsed, speedKmh, distanceMeters, route, altitudeMeters,
        locEnd,
        titleModalVisible, sessionTitle,

        setTitleModalVisible, setSessionTitle,

        handleSession, handleEndSession, handleSaveSession, resetSession, handleCancelSave,

        startLocationLabel,
        endLocationLabel,
        selectedCarId,
        notes, setNotes,

        setStartLocationLabel,
        setEndLocationLabel,
        setSelectedCarId
    } = useSharedDriveSession();

    const [cars, setCars] = useState<CarInfo[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    const handleResetAndClose = () => {
        resetSession();
    };

    return (
        <View style={styles.sessionControls}>
            <View style={styles.sessionManage}>
                <Pressable style={styles.sessionBtn} onPress={handleSession}>
                    <Ionicons
                        name={isStart ? 'stop-circle' : 'play-circle'}
                        size={90}
                        color={isStart ? '#d9534f' : '#4f8ef7'}
                    />
                </Pressable>

                <View style={styles.infoSection}>
                    <Text style={styles.timerText}>{formatTime(elapsed)}</Text>

                    {(isStart || elapsed > 0) && (
                        <View style={styles.liveStats}>
                            <View style={styles.statChip}>
                                <Ionicons name="speedometer-outline" size={16} color="#555" />
                                <Text style={styles.statText}>{speedKmh.toFixed(1)} km/h</Text>
                            </View>

                            <View style={styles.statChip}>
                                <Ionicons name="navigate-outline" size={16} color="#555" />
                                <Text style={styles.statText}>{formatDistance(distanceMeters)}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {(isStart || elapsed > 0) && (
                <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, styles.endBtn]} onPress={handleEndSession}>
                        <Text style={[styles.actionBtnText, styles.endBtnText]}>End Session</Text>
                    </Pressable>

                    <Pressable style={[styles.actionBtn, styles.resetBtn]} onPress={() => setShowPopup(true)}>
                        <Text style={[styles.actionBtnText, styles.resetBtnText]}>Reset</Text>
                    </Pressable>
                </View>
            )}

            <ConfirmationPopup
                visible={showPopup}
                label="reset session"
                onCancel={() => setShowPopup(false)}
                onConfirm={() => {
                    handleResetAndClose();
                    setShowPopup(false);
                }}
            />

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
            
        </View>
    );
}

const styles = StyleSheet.create({
    sessionControls: {
        padding: 16,
        margin: 12,
        borderWidth: 1,
        borderColor: '#e4e4e4',
        borderRadius: 18,
        backgroundColor: '#fff',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    sessionManage: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },

    sessionBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        backgroundColor: '#f7f7f7',
        padding: 4,
    },

    infoSection: {
        flex: 1,
        justifyContent: 'center',
    },

    timerText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111',
        letterSpacing: 0.5,
    },

    liveStats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },

    statChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#f3f3f3',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
    },

    statText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },

    actionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 18,
    },

    actionBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    endBtn: {
        backgroundColor: '#111',
    },

    resetBtn: {
        backgroundColor: '#f2f2f2',
        borderWidth: 1,
        borderColor: '#ddd',
    },

    actionBtnText: {
        fontSize: 15,
        fontWeight: '700',
    },

    endBtnText: {
        color: '#fff',
    },

    resetBtnText: {
        color: '#333',
    },
});
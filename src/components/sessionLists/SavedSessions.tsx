import { useCallback, useState, useEffect } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';

import { getSavedSessions, deleteDriveSession, getFullSession } from '@/database/methods';

import DriveSessionCard from '@/components/cards/DriveSessionCard';
import ConfirmationPopup from '@/components/modals/ConfirmationPopup';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { DriveSession } from '@/types/dbObj/driveSessionType';
import type { DriveSessionObj } from '@/types/sessionObj/DriveSessionType';

type SavedSessionsProps = {
    limit?: number;
};

export default function SavedSessions({ limit }: SavedSessionsProps) {
    const [sessions, setSessions] = useState<DriveSession[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const loadSavedSessions = useCallback(async () => {
        try {
            const savedSessions = await getSavedSessions();
            if (savedSessions) setSessions(savedSessions);
        } catch (e) {
            console.log('Failed loading sessions', e);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadSavedSessions();
        }, [])
    );

    const handlePressSession = async (sessionId: string) => {
        const fullSession = await getFullSession(sessionId);
        if (!fullSession) return;

        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('SessionDetails', { session: fullSession });
    };

    const handleDeleteSession = async (id: string) => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        await deleteDriveSession(id);
        await loadSavedSessions();
    };


    const renderRightActions = (item: DriveSession) => {
        return (
            <Pressable
                style={styles.deleteAction}
                onPress={() => {
                    setSelectedSessionId(item.id);
                    setShowPopup(true);
                }}
            >
                <Ionicons name="trash-outline" size={22} color="#fff" />
                <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
        );
    };

    if (sessions.length === 0) {
        return (
            <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>No saved sessions yet</Text>
            </View>
        );
    }

    return (
        <View>
            {sessions.map((item) => (
                <ReanimatedSwipeable
                    key={item.id}
                    friction={1.2}
                    overshootRight
                    overshootFriction={2.5}
                    rightThreshold={30}
                    renderRightActions={() => renderRightActions(item)}
                >
                    <Pressable onPress={() => handlePressSession(item.id)}>
                        <DriveSessionCard item={item} />
                    </Pressable>
                </ReanimatedSwipeable>
            ))}

            <ConfirmationPopup
                visible={showPopup}
                label="delete this session"
                onCancel={() => {
                    setShowPopup(false);
                    setSelectedSessionId(null);
                }}
                onConfirm={async () => {
                    if (!selectedSessionId) return;

                    await handleDeleteSession(selectedSessionId);
                    setShowPopup(false);
                    setSelectedSessionId(null);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    deleteAction: {
        width: 92,
        marginBottom: 12,
        borderRadius: 22,
        backgroundColor: '#dc2626',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },

    deleteText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },

    emptyWrap: {
        paddingHorizontal: 18,
        paddingVertical: 20,
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
});
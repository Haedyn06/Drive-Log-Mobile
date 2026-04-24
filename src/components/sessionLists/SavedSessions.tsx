import { useCallback, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';

import { deleteSession, getSessionById } from '@/services/driveSessionService';
import { getSaves } from '@/services/savesService';

import DriveSessionCard from '@/components/cards/DriveSessionCard';
import ConfirmationPopup from '@/components/ConfirmationPopup';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { DriveSessionObj } from '@/types/sessionObj/DriveSessionType';
type SavedSessionsProps = {
    limit?: number;
};

export default function SavedSessions({ limit }: SavedSessionsProps) {
    const [sessions, setSessions] = useState<DriveSessionObj[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const loadSessions = useCallback(async () => {
        try {
            const savedIds = await getSaves();

            const fullSessions = await Promise.all(
                savedIds.map((id: string) => getSessionById(id))
            );

            const validSessions = fullSessions.filter(
                (session): session is DriveSessionObj => session !== null
            );

            const sorted = [...validSessions].reverse();
            const limited = limit ? sorted.slice(0, limit) : sorted;

            setSessions(limited);
        } catch (e) {
            console.log('Failed loading sessions', e);
        }
    }, [limit]);

    useFocusEffect(
        useCallback(() => {
            loadSessions();
        }, [loadSessions])
    );

    const handlePressSession = async (item: DriveSessionObj) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('SessionDetails', { session: item });
    };

    const handleDeleteSession = async (id: string) => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        await deleteSession(id);
        await loadSessions();
    };



    const renderRightActions = (item: DriveSessionObj) => {
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
                    <Pressable onPress={() => handlePressSession(item)}>
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
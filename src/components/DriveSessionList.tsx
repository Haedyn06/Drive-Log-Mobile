import { useCallback, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';

import { getSessions, deleteSession } from '../services/localStoreService';

import type { RootStackParamList } from '../navigation/AppNavigator';
import type { DriveSession } from '../types/DriveSession';

import DriveSessionCard from '../components/DriveSessionCard';

type Props = {
    limit?: number;
};

export default function DriveSessionList({ limit }: Props) {
    const [sessions, setSessions] = useState<DriveSession[]>([]);
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const loadSessions = useCallback(async () => {
        try {
            const data = await getSessions();
            const sorted = [...data].reverse();
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

    const handlePressSession = async (item: DriveSession) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('SessionDetails', { session: item });
    };

    const handleDeleteSession = async (id: string) => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        await deleteSession(id);
        await loadSessions();
    };

    const renderRightActions = (item: DriveSession) => {
        return (
            <Pressable
                style={styles.deleteAction}
                onPress={() => handleDeleteSession(item.id)}
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
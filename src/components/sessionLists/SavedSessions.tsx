import { useCallback, useState, useEffect } from 'react';
import { Text, View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';

import { getSavedSessions } from '@/services/savedSessionService';
import { unsaveSessionDB } from '@/database/methods/savedSessions';


import DriveSessionCard from '@/components/cards/DriveSessionCard';
import ConfirmationPopup from '@/components/modals/ConfirmationPopup';

import type { DriveSession } from '@/types/dbObj/driveSessionType';
import type { DriveSessionObj } from '@/types/sessionObj/DriveSessionType';

type SavedSessionsProps = {
    limit?: number;
    onSelect: (id: string) => void;
    selSession?: DriveSessionObj | null;
    cardStyle?: ViewStyle;
};

export default function SavedSessions({ limit, onSelect, selSession=null, cardStyle }: SavedSessionsProps) {
    const [sessions, setSessions] = useState<DriveSession[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    
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

    const handleDeleteSession = async (id: string) => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        await unsaveSessionDB(id);
        await loadSavedSessions();
    };

    const renderRightActions = (item: DriveSession) => {
        return (
            <Pressable style={styles.deleteAction} onPress={() => handleDeleteSession(item.id)}>
                <Ionicons name="bookmark" size={22} color="#fff" />
                {/* <Text style={styles.deleteText}>Unsave</Text> */}
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
                <ReanimatedSwipeable key={item.id} friction={1.2} overshootRight overshootFriction={2.5} rightThreshold={30} renderRightActions={() => renderRightActions(item)} >
                    <Pressable onPress={() => onSelect(item.id)}>
                        {selSession?.id === item.id ? (
                                <DriveSessionCard item={item} style={{borderColor: selSession && item.id === selSession.id ? 'green':'#e5e7eb'}} />
                            ) : (
                                <DriveSessionCard item={item} />
                            )
                        }
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
        backgroundColor: '#dc9926',
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
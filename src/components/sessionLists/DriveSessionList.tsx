import { useCallback, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';

import { getDriveSessions, deleteDriveSession, getFullSession, type SessionSortType } from '@/database/methods';

import DriveSessionCard from '@/components/cards/DriveSessionCard';
import ConfirmationPopup from '@/components/modals/ConfirmationPopup';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { DriveSession } from '@/types/dbObj/driveSessionType';

type DriveSessionListProps = {
limit?: number;
sortType: SessionSortType;
};

export default function DriveSessionList({ limit, sortType }: DriveSessionListProps) {
const [sessions, setSessions] = useState<DriveSession[]>([]);
const [showPopup, setShowPopup] = useState(false);
const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const loadSessions = useCallback(async () => {
        try {
            const data = await getDriveSessions(limit, sortType);
            setSessions(data);
        } catch (e) {
            throw e;
        }
    }, [limit, sortType]);

    useFocusEffect(
        useCallback(() => {
            loadSessions();
        }, [loadSessions])
    );

    const handlePressSession = async (item: DriveSession) => {
        try {
            const fullSession = await getFullSession(item.id);
            
            if (!fullSession) return;
            navigation.navigate("SessionDetails", { session: fullSession });
        } catch (err) {
            throw err;
        }
    };

    const handleDeleteSession = async (id: string) => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        await deleteDriveSession(id);
        await loadSessions();
    };

    const renderRightActions = (item: DriveSession) => (
        <Pressable style={styles.deleteAction} 
            onPress={() => { 
                setSelectedSessionId(item.id); 
                setShowPopup(true);
            }}
        >
            <Ionicons name="trash-outline" size={22} color="#fff" />
            <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
    );

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
            <ReanimatedSwipeable key={item.id} friction={1.2} overshootRight overshootFriction={2.5} rightThreshold={30}
                renderRightActions={() => renderRightActions(item)}
            >
                <Pressable onPress={() => handlePressSession(item)}>
                    <DriveSessionCard item={item} />
                </Pressable>
            </ReanimatedSwipeable>
        ))}

        <ConfirmationPopup visible={showPopup} label="delete this session" 
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
    emptyWrap: {
        padding: 20,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        opacity: 0.6,
    },
    deleteAction: {
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        marginVertical: 8,
        borderRadius: 16,
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 4,
    },
});
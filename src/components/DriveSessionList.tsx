import { useCallback, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { getSessions } from '../services/localStoreService';

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

    useFocusEffect(
        useCallback(() => {
            async function loadSessions() {
                try {
                    const data = await getSessions();

                    const sorted = [...data].reverse();
                    const limited = limit ? sorted.slice(0, limit) : sorted;

                    setSessions(limited);
                } catch (e) {
                    console.log('Failed loading sessions', e);
                }
            }

            loadSessions();
        }, [limit])
    );

    const handleSessionCard = async (item: DriveSession) => {
        navigation.navigate('SessionDetails', { session: item });
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <View style={styles.listContainer}>
            {sessions.length === 0 ? (
                <Text>No saved sessions yet.</Text>
            ) : (
                sessions.map((item) => (
                    <Pressable key={item.id} onPress={() => handleSessionCard(item)}>
                        <DriveSessionCard item={item} />
                    </Pressable>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1
    }
});
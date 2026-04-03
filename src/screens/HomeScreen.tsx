import { useCallback, useState } from 'react';
import { Text, View, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { HomeStyles } from '../styles/HomeStyle';
import { getSessions } from '../services/localStoreService';

import type { RootStackParamList } from '../navigation/AppNavigator';
import type { DriveSession } from '../types/DriveSession';

import DriveSessionCard from '../components/DriveSessionCard';


export default function HomeScreen() {
    const [sessions, setSessions] = useState<DriveSession[]>([]);
    const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useFocusEffect(
        useCallback(() => {
            async function loadSessions() {
                try {
                    const data = await getSessions();
                    setSessions(data.reverse()); // newest first
                } catch (e) {
                    console.log('Failed loading sessions', e);
                }
            }

            loadSessions();
        }, [])
    );

    const handleSessionCard = async (item: DriveSession) => {
        navigation.navigate('SessionDetails', { session: item })
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    return (
        <SafeAreaView style={HomeStyles.container}>
            <Text style={HomeStyles.title}>Saved Sessions</Text>

            {sessions.length === 0 ? (
                <Text>No saved sessions yet.</Text>
            ) : (
                <FlatList data={sessions} keyExtractor={(item) => item.id} renderItem={({ item }) => (
                        <Pressable onPress={() => handleSessionCard(item)}>
                            <DriveSessionCard item={item} />
                        </Pressable>
                    )}
                />
            )}
        </SafeAreaView>
    );
}
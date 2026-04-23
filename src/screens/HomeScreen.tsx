import { useState, useEffect } from 'react';
import { Text, View, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useSharedDriveSession } from '@/context/DriveSessionContext';

import StartSessionCompA from '@/components/startSession/StartSessionCompA';
import DriveSessionList from '@/components/sessionLists/DriveSessionList';

import { HomeStyles } from '@/styles/HomeStyle';


import type { RootStackParamList } from '@/navigation/AppNavigator';

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [refreshing, setRefreshing] = useState(false);

    const handleSessions = async () => {
        navigation.navigate('SessionLogs');
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setRefreshing(false);
    };

    const {
        isStart,
        elapsed, speedKmh, distanceMeters,
        handleSession, handleEndSession, resetSession
    } = useSharedDriveSession();

    return (
        <ScrollView style={HomeStyles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <StartSessionCompA
                isStart={isStart}
                elapsed={elapsed}
                speedKmh={speedKmh}
                distanceMeters={distanceMeters} 
                handleSession={handleSession}
                handleEndSession={handleEndSession}
                resetSession={resetSession}
            />

            <View style={HomeStyles.recentList}>
                <View style={HomeStyles.recentHeading}>
                    <Text style={HomeStyles.recentTitle}>Recent Drives</Text>
                    <Pressable onPress={handleSessions}>
                        <Text style={{ textDecorationLine: 'underline' }}>See All</Text>
                    </Pressable>
                </View>

                <DriveSessionList limit={3} sortType='newest' />
            </View>
        </ScrollView>
    );
}
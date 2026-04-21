import { useState, useEffect } from 'react';
import { Text, View, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { useSharedDriveSession } from '../context/DriveSessionContext';
import { HomeStyles } from '../styles/HomeStyle';

import StartSessionCompA from '../components/StartSessionCompA';
import DriveSessionList from '../components/DriveSessionList';

import type { RootStackParamList } from '../navigation/AppNavigator';

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [refreshing, setRefreshing] = useState(false);

    const handleSessions = async () => {
        navigation.navigate('SessionLogs');
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const onRefresh = async () => {
        setRefreshing(true);

        setRefreshing(false);
    };


    return (
        <ScrollView style={HomeStyles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <StartSessionCompA />

            <View style={HomeStyles.recentList}>
                <View style={HomeStyles.recentHeading}>
                    <Text style={HomeStyles.recentTitle}>Recent Drives</Text>
                    <Pressable onPress={handleSessions}>
                        <Text style={{ textDecorationLine: 'underline' }}>See All</Text>
                    </Pressable>
                </View>

                <DriveSessionList limit={5} />
            </View>
        </ScrollView>
    );
}
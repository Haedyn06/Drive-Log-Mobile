import { Text, View, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { useSharedDriveSession } from '../context/DriveSessionContext';
import { HomeStyles } from '../styles/HomeStyle';

import StartSessionComp from '../components/StartSessionComp';
import DriveSessionList from '../components/DriveSessionList';

import type { RootStackParamList } from '../navigation/AppNavigator';

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleSessions = async () => {
        navigation.navigate('SessionLogs');
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const {
        isStart,
        elapsed,
        speedKmh,
        distanceMeters,
        handleSession,
        handleEndSession,
        resetSession
    } = useSharedDriveSession();

    return (
        <ScrollView style={HomeStyles.container}>
            <StartSessionComp
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
                    <Text style={HomeStyles.recentTitle}>Your Recents</Text>
                    <Pressable onPress={handleSessions}>
                        <Text style={{ textDecorationLine: 'underline' }}>See All</Text>
                    </Pressable>
                </View>

                <DriveSessionList limit={3} />
            </View>
        </ScrollView>
    );
}
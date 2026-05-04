import { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import SavedSessions from '@/components/sessionLists/SavedSessions';
import { SessionLogsStyles } from '@/styles/SessionsLogsStyles';
import { getFullSessionObj } from '@/services/sessionService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

export default function SavedSessionsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const handlePressSession = async (sessionId: string) => {
        const fullSession = await getFullSessionObj(sessionId);
        if (!fullSession) return;

        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('SessionDetails', { session: fullSession });
    };

    return (
        <View style={SessionLogsStyles.container}>
            <ScrollView
                style={SessionLogsStyles.screen}
                contentContainerStyle={SessionLogsStyles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={SessionLogsStyles.header}>
                    <Text style={SessionLogsStyles.title}>Saved Drives</Text>
                </View>

                <View style={SessionLogsStyles.listSection}>
                    <SavedSessions onSelect={handlePressSession} />
                </View>
            </ScrollView>
        </View>
    );
}
import { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';

import SavedSessions from '@/components/sessionLists/SavedSessions';
import { SessionLogsStyles } from '@/styles/SessionsLogsStyles';

export default function SavedSessionsScreen() {

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
                    <SavedSessions />
                </View>
            </ScrollView>
        </View>
    );
}
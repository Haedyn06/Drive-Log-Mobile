import { Text, View, ScrollView } from 'react-native';

import { SessionLogsStyles } from '../styles/SessionsLogsStyles';
import DriveSessionList from '../components/DriveSessionList';

export default function SessionsLogsScreen() {
    return (
        <ScrollView
            style={SessionLogsStyles.screen}
            contentContainerStyle={SessionLogsStyles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={SessionLogsStyles.header}>
                <Text style={SessionLogsStyles.eyebrow}>History</Text>
                <Text style={SessionLogsStyles.title}>Your Recent Drives</Text>
            </View>

            <View style={SessionLogsStyles.listSection}>
                <DriveSessionList />
            </View>
        </ScrollView>
    );
}
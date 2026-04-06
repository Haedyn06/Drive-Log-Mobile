import { Text, View, Pressable, ScrollView } from 'react-native';


import { SessionLogsStyles } from '../styles/SessionsLogsStyles';
import DriveSessionList from '../components/DriveSessionList';
import { clearSessions } from '../services/localStoreService';

export default function SessionsLogsScreen() {
    return (
        <ScrollView>
            <View style={SessionLogsStyles.sessionLogsFrame}>

                <View style={SessionLogsStyles.recentHeading}>
                    <Text style={SessionLogsStyles.recentTitle}>Your Recents</Text>
                </View>
                <View style={SessionLogsStyles.sessionList}>

                    <DriveSessionList />

                </View>

            </View>

        </ScrollView>
    );
}
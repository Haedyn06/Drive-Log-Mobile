import { Text, View, ScrollView, Pressable, StyleSheet } from 'react-native';

import { SessionLogsStyles } from '../styles/SessionsLogsStyles';
import DriveSessionList from '../components/DriveSessionList';

export default function SessionsLogsScreen() {
    return (
        <View style={SessionLogsStyles.container}>
            <View style={SessionLogsStyles.filterBar}>
                <Pressable style={SessionLogsStyles.filterBtn}>
                    <Text>Newest</Text>
                </Pressable>

                <Pressable style={SessionLogsStyles.filterBtn}>
                    <Text>Oldest</Text>
                </Pressable>


                <Pressable style={SessionLogsStyles.filterBtn}>
                    <Text>Furthest</Text>
                </Pressable>

                <Pressable style={SessionLogsStyles.filterBtn}>
                    <Text>Longest</Text>
                </Pressable>
            </View>

            <ScrollView
                style={SessionLogsStyles.screen}
                contentContainerStyle={SessionLogsStyles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={SessionLogsStyles.header}>
                    <Text style={SessionLogsStyles.title}>Drive Sessions</Text>
                </View>

                <View style={SessionLogsStyles.listSection}>
                    <DriveSessionList />
                </View>
            </ScrollView>
        </View>
    );
}
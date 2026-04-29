import { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';

import DriveSessionList from '@/components/sessionLists/DriveSessionList';

import { SessionLogsStyles } from '@/styles/SessionsLogsStyles';

import type { SessionSortType } from '@/database/methods';

export default function SessionsLogsScreen() {
    const [sortType, setSortType] = useState<SessionSortType>('newest');

    return (
        <View style={SessionLogsStyles.container}>
            <View style={SessionLogsStyles.filterBar}>
                {/* Newest */}
                <Pressable
                    style={[
                        SessionLogsStyles.filterBtn,
                        sortType === 'newest' && SessionLogsStyles.activeFilterBtn
                    ]}
                    onPress={() => setSortType('newest')}
                >
                    <Text
                        style={[
                            SessionLogsStyles.filterText,
                            sortType === 'newest' && SessionLogsStyles.activeFilterText
                        ]}
                    >
                        Newest
                    </Text>
                </Pressable>

                {/* Oldest */}
                <Pressable
                    style={[
                        SessionLogsStyles.filterBtn,
                        sortType === 'oldest' && SessionLogsStyles.activeFilterBtn
                    ]}
                    onPress={() => setSortType('oldest')}
                >
                    <Text
                        style={[
                            SessionLogsStyles.filterText,
                            sortType === 'oldest' && SessionLogsStyles.activeFilterText
                        ]}
                    >
                        Oldest
                    </Text>
                </Pressable>

                {/* Furthest */}
                <Pressable
                    style={[
                        SessionLogsStyles.filterBtn,
                        sortType === 'furthest' && SessionLogsStyles.activeFilterBtn
                    ]}
                    onPress={() => setSortType('furthest')}
                >
                    <Text
                        style={[
                            SessionLogsStyles.filterText,
                            sortType === 'furthest' && SessionLogsStyles.activeFilterText
                        ]}
                    >
                        Furthest
                    </Text>
                </Pressable>

                {/* Longest */}
                <Pressable
                    style={[
                        SessionLogsStyles.filterBtn,
                        sortType === 'time' && SessionLogsStyles.activeFilterBtn
                    ]}
                    onPress={() => setSortType('time')}
                >
                    <Text
                        style={[
                            SessionLogsStyles.filterText,
                            sortType === 'time' && SessionLogsStyles.activeFilterText
                        ]}
                    >
                        Longest
                    </Text>
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
                    <DriveSessionList sortType={sortType} />
                </View>
            </ScrollView>
        </View>
    );
}
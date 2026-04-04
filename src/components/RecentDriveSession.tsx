import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDuration, formatDistance, formatDateNum, formatTimeOnly } from "../utils/format";
import type { DriveSession } from "../types/DriveSession";
import * as Haptics from 'expo-haptics';


import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';


import type { RootStackParamList } from '../navigation/AppNavigator';


import DriveSessionMap from "./DriveSessionMap";

type RecentDriveSessionProps = {
    item: DriveSession | null;
};


export default function RecentDriveSession({ item }: RecentDriveSessionProps) {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const handleSession = async (item: DriveSession) => {
        navigation.navigate('SessionDetails', { session: item });
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };



    if (!item) {
        return (
            <View style={styles.statFrame}>
                <View style={styles.headerRow}>
                    <Text style={styles.heading}>Your Recent Drive</Text>
                    <Ionicons name="chevron-forward" size={22} color="#6f6f6f" />
                </View>

                <View style={styles.divider} />
                <Text style={styles.dateTimeText}>No recent drive yet.</Text>
            </View>
        );
    }

    return (
        <View>
            <Pressable onPress={() => handleSession(item)}>

                <View style={styles.statFrame}>
                    {/* Heading */}
                    <View style={styles.headerRow}>
                        <Text style={styles.heading}>Your Recent Drive</Text>
                        <Ionicons name="chevron-forward" size={22} color="#6f6f6f" />
                    </View>

                    <View style={styles.divider} />

                    {/* Title */}
                    <View style={styles.titleWrap}>
                        <Text style={styles.driveTitle}>{item.title}</Text>
                    </View>

                    {/* From - To */}
                    <View style={styles.dateTimeWrap}>
                        <Text style={styles.dateTimeText}>
                            {formatDateNum(item.startTime)}, {formatTimeOnly(item.startTime)} - {formatDateNum(item.endTime)}, {formatTimeOnly(item.endTime)}
                        </Text>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Duration</Text>
                            <Text style={styles.statValue}>{formatDuration(item.durationMs)}</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Distance</Text>
                            <Text style={styles.statValue}>{formatDistance(item.distanceMeters)}</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Avg Speed</Text>
                            <Text style={styles.statValue}>
                                {item.averageSpeedKmh.toFixed(0)} km/h
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>


            <View style={styles.mapFrame}>
                <DriveSessionMap
                    locStart={item.startLocation}
                    locEnd={item.endLocation}
                    route={item.route}
                    mapStyle={{ height: 280 }}
                    wrapperStyle={{ marginTop: 8 }}
                    previewOnly={true}
                />
            </View>
        </View>
    );

    
}

const styles = StyleSheet.create({
    statFrame: {
        backgroundColor: '#ffffff',
        borderRadius: 22,
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 26,
        margin: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    heading: {
        fontSize: 24,
        fontWeight: '500',
        color: '#111',
    },

    divider: {
        height: 1,
        backgroundColor: '#8c878b',
        marginTop: 10,
        marginBottom: 18,
    },

    titleWrap: {
        alignItems: 'center',
        marginBottom: 8,
    },

    driveTitle: {
        fontSize: 40,
        fontWeight: '800',
        color: '#111',
        textAlign: 'center',
    },

    dateTimeWrap: {
        alignItems: 'center',
        marginBottom: 34,
    },

    dateTimeText: {
        fontSize: 18,
        color: '#6c676b',
        textAlign: 'center',
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },

    statBox: {
        flex: 1,
    },

    statLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111',
        marginBottom: 8,
    },

    statValue: {
        fontSize: 23,
        fontWeight: '400',
        color: '#111',
    },

    mapFrame: {
        padding: 10,
        paddingTop: 3,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        margin: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
    }
});
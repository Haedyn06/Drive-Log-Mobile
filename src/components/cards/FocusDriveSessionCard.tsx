import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { formatDuration, formatDistance, formatDateNum, formatTimeOnly } from "@/utils/format";
import DriveSessionMap from "@/components/maps/DriveSessionMap";


import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/AppNavigator";
import type { DriveSession } from "@/types/DriveSession";

type FocusDriveSessionCardProps = {
    item: DriveSession | null;
    heading: string
};

export default function FocusDriveSessionCard({ item, heading }: FocusDriveSessionCardProps) {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleSession = async (session: DriveSession) => {
        navigation.navigate("SessionDetails", { session });
    };

    if (!item) {
        return (
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.heading}>{heading}</Text>
                    </View>

                    <View style={styles.headerIconWrap}>
                        <Ionicons name="time-outline" size={18} color="#6b7280" />
                    </View>
                </View>

                <View style={styles.emptyState}>
                    <View style={styles.emptyIconWrap}>
                        <Ionicons name="car-sport-outline" size={24} color="#9ca3af" />
                    </View>

                    <Text style={styles.emptyTitle}>No recent drive yet</Text>
                    <Text style={styles.emptyText}>
                        Your latest saved session will show up here.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <Pressable
            onPress={() => handleSession(item)}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.eyebrow}>{heading}</Text>
                </View>

                <View style={styles.headerIconWrap}>
                    <Ionicons name="chevron-forward" size={18} color="#6b7280" />
                </View>
            </View>

            <View style={styles.heroRow}>
                <View style={styles.heroIcon}>
                    <Ionicons name="car-sport-outline" size={22} color="#2563eb" />
                </View>

                <View style={styles.heroTextWrap}>
                    <Text style={styles.driveTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    
                    { formatDateNum(item.startTime) === formatDateNum(item.endTime) &&
                        <Text style={styles.dateTimeText} numberOfLines={1}>
                            {formatDateNum(item.startTime)} ({formatTimeOnly(item.startTime)} {"-"}
                            {formatTimeOnly(item.endTime)})
                        </Text>
                    }

                    { formatDateNum(item.startTime) !== formatDateNum(item.endTime) &&
                        <Text style={styles.dateTimeText} numberOfLines={2}>
                            {formatDateNum(item.startTime)}, {formatTimeOnly(item.startTime)} {"- \n"}
                            {formatDateNum(item.endTime)}, {formatTimeOnly(item.endTime)}
                        </Text>
                    }


                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Duration</Text>
                    <Text style={styles.statValue}>{formatDuration(item.durationMs)}</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>{formatDistance(item.distanceMeters)}</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Avg Speed</Text>
                    <Text style={styles.statValue}>{item.averageSpeedKmh.toFixed(0)} km/h</Text>
                </View>
            </View>

            <View style={styles.mapSection}>
                <DriveSessionMap
                    locStart={item.startLocation}
                    locEnd={item.endLocation}
                    route={item.route}
                    mapStyle={{ height: 220 }}
                    wrapperStyle={styles.mapWrapper}
                    previewOnly={true}
                    timeEnd={item.endTime}
                    timeStart={item.startTime}
                    distance={item.distanceMeters}
                />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 28,
        padding: 18,
        marginHorizontal: 18,
        marginTop: 10,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 4,
    },

    cardPressed: {
        opacity: 0.96,
        transform: [{ scale: 0.995 }],
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },

    eyebrow: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
    },

    heading: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        letterSpacing: -0.4,
    },

    headerIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        justifyContent: "center",
        alignItems: "center",
    },

    heroRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },

    heroIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#eff6ff",
        borderWidth: 1,
        borderColor: "#dbeafe",
        justifyContent: "center",
        alignItems: "center",
    },

    heroTextWrap: {
        flex: 1,
    },

    driveTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 4,
        letterSpacing: -0.3,
    },

    dateTimeText: {
        fontSize: 13,
        color: "#6b7280",
        lineHeight: 19,
    },

    statsRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },

    statCard: {
        flex: 1,
        minWidth: 0,
        backgroundColor: "#f8fafc",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    statLabel: {
        fontSize: 11,
        fontWeight: "700",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 6,
        textAlign: "center",
    },

    statValue: {
        fontSize: 16,
        fontWeight: "800",
        color: "#111827",
        textAlign: "center",
    },

    mapSection: {
        borderRadius: 22,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#f8fafc",
    },

    mapWrapper: {
        marginTop: 0,
        marginHorizontal: 0,
        borderWidth: 0,
        padding: 0,
        backgroundColor: "transparent",
    },

    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30,
    },

    emptyIconWrap: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 6,
    },

    emptyText: {
        fontSize: 13,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 19,
    },
});
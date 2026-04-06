import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatReadableElapsed, formatDistance, formatDateNum } from "../utils/format";
import type { DriveSession } from "../types/DriveSession";

type DriveSessionCardProps = {
    item: DriveSession;
};

export default function DriveSessionCard({ item }: DriveSessionCardProps) {
    const endLat = item.endLocation?.latitude;
    const endLng = item.endLocation?.longitude;

    let locationDisplay = "No end location";

    if (item.startLocationLabel?.trim() && item.endLocationLabel?.trim()) {
        locationDisplay = `${item.startLocationLabel} → ${item.endLocationLabel}`;
    } else if (item.endLocationLabel?.trim()) {
        locationDisplay = item.endLocationLabel;
    } else if (endLat !== undefined && endLng !== undefined) {
        locationDisplay = `${endLat.toFixed(2)}, ${endLng.toFixed(2)}`;
    }

    return (
        <View style={styles.card}>
            <View style={styles.iconWrap}>
                <View style={styles.icon}>
                    <Ionicons name="car-sport-outline" size={22} color="#2563eb" />
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={1}>
                        {item.title}
                    </Text>

                    <Text style={styles.dateText}>
                        {formatDateNum(item.date)}
                    </Text>
                </View>

                <View style={styles.metaRow}>
                    <View style={styles.metaPill}>
                        <Ionicons name="time-outline" size={13} color="#6b7280" />
                        <Text style={styles.metaText}>
                            {formatReadableElapsed(item.durationMs)}
                        </Text>
                    </View>

                    <View style={styles.metaPill}>
                        <Ionicons name="speedometer-outline" size={13} color="#6b7280" />
                        <Text style={styles.metaText}>
                            {formatDistance(item.distanceMeters)}
                        </Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color="#9ca3af" />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {locationDisplay}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 14,
        gap: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },

    iconWrap: {
        justifyContent: "center",
        alignItems: "center",
    },

    icon: {
        width: 54,
        height: 54,
        borderRadius: 16,
        backgroundColor: "#eff6ff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#dbeafe",
    },

    content: {
        flex: 1,
        justifyContent: "center",
        gap: 8,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 10,
    },

    title: {
        flex: 1,
        fontSize: 17,
        fontWeight: "800",
        color: "#111827",
    },

    dateText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9ca3af",
        marginTop: 2,
    },

    metaRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    metaPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#f9fafb",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: "#edf0f2",
    },

    metaText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#4b5563",
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingTop: 2,
    },

    locationText: {
        flex: 1,
        fontSize: 13,
        color: "#6b7280",
    },
});
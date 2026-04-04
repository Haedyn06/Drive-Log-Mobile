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

    return (
        <View style={styles.card}>
            <View style={styles.left}>
                <View style={styles.icon}>
                    <Ionicons name="car-sport-outline" size={28} color="#fff" />
                </View>
            </View>

            <View style={styles.center}>
                <Text style={styles.statTitle} numberOfLines={1}>
                    {item.title}
                </Text>

                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>{formatReadableElapsed(item.durationMs)}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.metaText}>{formatDistance(item.distanceMeters)}</Text>
                </View>

                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={16} color="#767676" />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {endLat !== undefined && endLng !== undefined
                            ? `(${endLat.toFixed(2)}, ${endLng.toFixed(2)})`
                            : "No end location"}
                    </Text>
                </View>
            </View>

            <View style={styles.right}>
                <Text style={styles.dateText}>{formatDateNum(item.date)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e3e3e3",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        gap: 12,
        marginBottom: 12,
    },

    left: {
        justifyContent: "center",
        alignItems: "center",
    },

    icon: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: "#767676",
        justifyContent: "center",
        alignItems: "center",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        gap: 1,
        marginLeft: 6
    },

    statTitle: {
        fontSize: 20, // or 24 if u want it bold bold
        fontWeight: "600",
        color: "#111",
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    metaText: {
        fontSize: 14,
        color: "#444",
    },

    dot: {
        fontSize: 14,
        color: "#999",
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        maxWidth: "95%",
    },

    locationText: {
        fontSize: 13,
        color: "#767676",
        flexShrink: 1,
    },

    right: {
        alignSelf: "flex-end",
    },

    dateText: {
        fontSize: 12,
        color: "#888",
    },
});
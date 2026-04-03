import { View, Text, Pressable, StyleSheet } from "react-native";
import { formatTime } from '../utils/format';

import type { DriveSession } from "../types/DriveSession";

type DriveSessionCardProps = {
    item: DriveSession

}

export default function DriveSessionCard({item}:DriveSessionCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{new Date(item.date).toLocaleString()}</Text>
            <Text>Distance: {item.distanceMeters.toFixed(0)} m</Text>
            <Text>Avg Speed: {item.averageSpeedKmh.toFixed(1)} km/h</Text>
            <Text>Duration: {formatTime(item.durationMs)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f4f4f4',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
    },
})

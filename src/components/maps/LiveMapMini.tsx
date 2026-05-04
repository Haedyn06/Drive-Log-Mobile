import { useState, useEffect } from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { View, StyleSheet, Text } from "react-native";

type LiveMapMiniProps = {
    height?: number;
};

export default function LiveMapMini({ height = 400 }: LiveMapMiniProps) {
    const [region, setRegion] = useState<any>(null);

    useEffect(() => {
        let sub: Location.LocationSubscription | null = null;

        const startTracking = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            sub = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval: 5,
                },
                (loc) => {
                    setRegion({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            );
        };

        startTracking();

        return () => {
            sub?.remove();
        };
    }, []);

    return (
        <View style={[styles.container, { height }]}>
            <MapView
                style={styles.map}
                region={region ?? undefined}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                pointerEvents="none"
                showsUserLocation
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 20,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#eee",
        borderWidth: 1,
    },

    title: {
        textAlign: "center",
        fontSize: 20,
        marginBottom: 15,
        fontWeight: "bold",
    },

    map: {
        flex: 1,
        borderRadius: 12,
    },
});
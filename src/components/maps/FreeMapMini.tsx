import { useState, useEffect } from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";

type MiniMapViewProps = {
    height?: number;
};

export default function FreeMiniMap({ height = 400 }: MiniMapViewProps) {
    const [region, setRegion] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const loc = await Location.getCurrentPositionAsync({});

            setRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            });
        })();
    }, []);

    return (
        <View style={[styles.container, { height }]}>
            <Text style={styles.title}>Roam Your Map</Text>

            <View style={styles.mapWrapper}>
                {!region ? (
                    <ActivityIndicator size="large" color="#888" />
                ) : (
                    <MapView
                        style={styles.map}
                        region={region}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        pointerEvents="none"
                        showsUserLocation
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 16,
        borderRadius: 18,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 6,
    },
    title: {
        color: "#000000",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: 'center'
    },
    mapWrapper: {
        flex: 1,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#222",
        justifyContent: "center",
        alignItems: "center",
    },
    map: {
        width: "100%",
        height: "100%",
    },
});
import { useState, useEffect } from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { View, StyleSheet, Text } from "react-native";

import type { Coords } from "@/types/CoordinateType";

type MiniMapViewProps = {
    height?: number;
};

export default function FreeMiniMap({height = 400}: MiniMapViewProps) {
    const [region, setRegion] = useState<any>(null);
    
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const loc = await Location.getCurrentPositionAsync({});

            setRegion({
                latitude: loc.coords.latitude, longitude: loc.coords.longitude,
                latitudeDelta: 0.5, longitudeDelta: 0.5,
            });
        })();
    }, []);
    
    return (
        <View style={[styles.container, { height }]}>
            <Text style={{textAlign: 'center', fontSize: 20, marginBottom: 15, fontWeight: 'bold' }}>Roam Your Map</Text>
            <MapView
                style={styles.map}
                region={region}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                pointerEvents="none"
                showsUserLocation={true} 
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
        borderWidth: 1
    },
    map: {
        flex: 1,
        borderRadius: 12
    },
});
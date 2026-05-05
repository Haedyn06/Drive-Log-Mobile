import { useState, useEffect } from "react";
import MapView, {Marker, Polyline} from "react-native-maps";
import * as Location from "expo-location";
import { View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";


import { formatTimeOnly, formatDistance, formatSpeed } from "@/utils/format";

import type { SessionRoutePoint, SessionCheckpoint } from "@/types/dbObj/mapPointTypes";
import type { Coords } from "@/types/CoordinateType";

type LiveMapMiniProps = {
    timeStart: number | null;
    locStart: Coords | null;
    route: SessionRoutePoint[];
    checkpoints: SessionCheckpoint[];
    mapStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
};

export default function LiveMapMini({ timeStart, locStart, route = [], checkpoints, mapStyle, wrapperStyle }: LiveMapMiniProps) {
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
        <View style={[styles.container, wrapperStyle]}>
            <MapView
                style={[styles.map, mapStyle]}
                region={region ?? undefined}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                pointerEvents="none"
                showsUserLocation
            >
                {locStart && (
                    <Marker coordinate={locStart} title={`Start (0m)`} description={`${formatTimeOnly(timeStart)}`} pinColor="green" />
                )}

                {checkpoints?.map((i) => (
                    <Marker key={i.id} coordinate={i.location}
                        title={i.type ? `${i.type} (${formatDistance(Number(i.distance)) ?? 0})` : "Checkpoint"}
                        description={`${i.notes || ""} • ${formatTimeOnly(i.timestamp)}`} pinColor="blue" />
                ))}
                
                {route.length > 1 && (
                    <Polyline coordinates={route.map(p => p.location)} strokeColor="#00a2ff" strokeWidth={6} />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        overflow: 'hidden',
    },

    title: {
        textAlign: "center",
        fontSize: 20,
        marginBottom: 15,
        fontWeight: "bold",
    },

    map: {
        width: '100%',
        height: 250,
    },
});
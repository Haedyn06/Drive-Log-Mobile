import { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';


import { deleteCheckpointDB } from '@/database/methods/driveSessions';
import { formatDistance, formatSpeed, formatTimeOnly, formatReadableElapsed } from '@/utils/format';

import CheckpointDetails from '@/components/modals/CheckpointDetailsComp';

import type { Coords } from '@/types/CoordinateType';
import type { SessionTopSpeed, SessionTopAltitude } from '@/types/dbObj/topMetrics';
import type { SessionRoutePoint, SessionStopPoint, SessionCheckpoint } from '@/types/dbObj/mapPointTypes';

type MarkerFilter = | "all" | "topAll" | "stops" | "startEnd" | "checkpoints";

type DriveSessionMapProps = {
    title?: string;
    liveStatus?: string;
    showUserLocation?: boolean;
    sessionId: string;
    locStart: Coords | null;
    locEnd: Coords | null;
    route: SessionRoutePoint[];
    mapStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    checkpoints?: SessionCheckpoint[];
    previewOnly?: boolean;
    timeStart: number | null;
    timeEnd?: number | null;
    distance?: number;
    topAltitude?: SessionTopAltitude | null;
    topSpeed?: SessionTopSpeed | null;
    stops?: SessionStopPoint[] | null;
};

export default function DriveSessionMap({
    title = 'Route',
    liveStatus = 'notstart',
    showUserLocation = false,
    sessionId,
    locStart,
    locEnd,
    timeEnd,
    timeStart,
    distance,
    route,
    mapStyle,
    topAltitude,
    topSpeed,
    wrapperStyle,
    checkpoints,
    stops,
    previewOnly = true,
}: DriveSessionMapProps) {
    const initialLat = route[0]?.location.latitude ?? locStart?.latitude ?? 51.0447;
    const initialLng = route[0]?.location.longitude ?? locStart?.longitude ?? -114.0719;

    const [mapRegion, setMapRegion] = useState({
        latitude: initialLat,
        longitude: initialLng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [fullScreen, setFullScreen] = useState(false);
    const [markerFilter, setMarkerFilter] = useState<MarkerFilter>("all");
    const [selectedCheckpointIndex, setSelectedCheckpointIndex] = useState<number | null>(null);
    const [localCheckpoints, setLocalCheckpoints] = useState(checkpoints ?? []);

    const mapRef = useRef<MapView | null>(null);

    const showAll = markerFilter === "all";

    const showTopAll = showAll || markerFilter === "topAll";
    const showStops = showAll || markerFilter === "stops";
    const showCheckpoints = showAll || markerFilter === "checkpoints";

    const markerFilterOptions: { label: string; value: MarkerFilter }[] = [
        { label: "All", value: "all" },
        { label: "Top", value: "topAll" },
        { label: "Stops", value: "stops" },
        { label: "Start/End", value: "startEnd" },
        { label: "Checkpoints", value: "checkpoints" },
    ];

    useEffect(() => {
        setLocalCheckpoints(checkpoints ?? []);
    }, [checkpoints]);


    const focusCheckpoint = (index: number) => {
        const checkpoint = localCheckpoints[index];
        if (!checkpoint) return;

        mapRef.current?.animateToRegion(
            {
                latitude: checkpoint.location.latitude,
                longitude: checkpoint.location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            },
            500
        );
    };

    const miniPreviewCamera = useMemo(() => {
        const routePoints = route ?? [];
        const pos = routePoints[Math.floor(routePoints.length / 2)];
        const distanceKM = (distance ?? 0) / 1000;
        let alt = 50000000;

        if (distance !== undefined) {
            if (distanceKM <= 1) alt = 10000;
            else if (distanceKM <= 10) alt = 15000;
            else if (distanceKM) alt = 25000;
            else if (distanceKM) alt = 55000;
            else if (distanceKM) alt = 120000;
            else if (distanceKM) alt = 500000;
            else if (distanceKM) alt = 5000000;
        }

        return {
            center: {
                latitude: pos?.location.latitude ?? initialLat,
                longitude: pos?.location.longitude ?? initialLng,
            },
            altitude: alt,
            pitch: 0,
            heading: 0,
        };
    }, [route, distance, initialLat, initialLng]);


    const handleRemoveCheckpoint = async () => {
        if (selectedCheckpointIndex === null) return;

        const checkpoint = localCheckpoints[selectedCheckpointIndex];
        if (!checkpoint) return;

        // delete from DB using id
        await deleteCheckpointDB(checkpoint.id);

        // update local state
        const updated = localCheckpoints.filter((_, index) => index !== selectedCheckpointIndex);

        setLocalCheckpoints(updated);

        if (updated.length === 0) {
            setSelectedCheckpointIndex(null);
            return;
        }

        const nextIndex =
            selectedCheckpointIndex >= updated.length ? updated.length - 1 : selectedCheckpointIndex;

        setSelectedCheckpointIndex(nextIndex);
        focusCheckpoint(nextIndex);
    };


    const mapContent = (
        <MapView
            key={`${route.length}-${distance ?? 0}`}
            style={[styles.map, mapStyle]}
            camera={miniPreviewCamera}
            showsUserLocation={showUserLocation}
            followsUserLocation={false}
            scrollEnabled={!previewOnly}
            zoomEnabled={!previewOnly}
            rotateEnabled={!previewOnly}
            pitchEnabled={!previewOnly}
            toolbarEnabled={!previewOnly}
        >
            {locStart && (
                <Marker coordinate={locStart} title={`Start (0m)`} description={`${formatTimeOnly(timeStart)}`} pinColor="green" />
            )}

            {locEnd && (
                <Marker coordinate={locEnd} title={`End (${formatDistance(distance ?? 0)})`} description={`${formatTimeOnly(timeEnd)}`} pinColor="red" />
            )}

            {stops?.map((i, index) => (
                <Marker
                    key={index}
                    coordinate={i.location}
                    title={"Stop"}
                    description={`${formatReadableElapsed(i.duration) || ""} • ${formatTimeOnly(i.timestamp)}`}
                    pinColor="orange"
                />
            ))}

            {checkpoints?.map((i) => (
                <Marker
                    key={i.id}
                    coordinate={i.location}
                    title={i.type ? `${i.type} (${formatDistance(Number(i.distance)) ?? 0})` : "Checkpoint"}
                    description={`${i.notes || ""} • ${formatTimeOnly(i.timestamp)}`}
                    pinColor="blue"
                />
            ))}
            
            {route.length > 1 && (
                <Polyline coordinates={route.map(p => p.location)} strokeColor="#00a2ff" strokeWidth={6} />
            )}
        </MapView>
    );

    return (
        <>
            <View style={[styles.mapWrapper, wrapperStyle]}>
                {previewOnly ? (
                    <Pressable onPress={() => setFullScreen(true)}>
                        <View pointerEvents="none">
                            {mapContent}
                        </View>
                    </Pressable>
                ) : (
                    mapContent
                )}
            </View>

            <Modal
                visible={fullScreen}
                animationType="slide"
                onRequestClose={() => setFullScreen(false)}
            >
                <View style={styles.fullScreenContainer}>
                    <MapView ref={mapRef} key={markerFilter} region={mapRegion} onRegionChangeComplete={setMapRegion}
                        showsUserLocation={showUserLocation} followsUserLocation={liveStatus !== 'notstart'}
                        style={styles.fullScreenMap}
                        showsTraffic
                    >
                        {locStart && (
                            <Marker key="start-marker" coordinate={locStart} pinColor="green"
                                title={`Start (0m)`} description={`${formatTimeOnly(timeStart)}`}
                            />
                        )}

                        {locEnd && (
                            <Marker key="end-marker" coordinate={locEnd} pinColor="red"
                                title={`End (${formatDistance(distance ?? 0)})`} description={`${formatTimeOnly(timeEnd)}`}
                            /> 
                        )}

                        {showTopAll && topSpeed?.location && (
                            <Marker key="top-speed-marker" coordinate={topSpeed.location} pinColor="#ffa256"
                                title={`Top Speed (${formatSpeed(topSpeed.speed ?? 0)})`} 
                                description={`${formatTimeOnly(topSpeed.timestamp ?? 0)}`}
                            />
                        )}

                        {showTopAll && topAltitude?.location && (
                            <Marker key="top-altitude-marker" coordinate={topAltitude.location} pinColor="#44ff00"
                                title={`Highest Altitude (${formatSpeed(topAltitude.altitude ?? 0)})`} 
                                description={`${formatTimeOnly(topAltitude.timestamp ?? 0)}`}
                            />
                        )}

                        {showStops && stops?.map((i, index) => (
                            <Marker key={`stop-marker-${index}`} coordinate={i.location} pinColor="orange" title={`Stop #${(index+1).toFixed()}`} 
                                description={`${formatReadableElapsed(i.duration) || ""} • ${formatTimeOnly(i.timestamp)}`}
                            >
                                <Ionicons name="stop-circle-outline" size={40} color="red" />
                            </Marker>
                        
                        ))}

                        {showCheckpoints && localCheckpoints.map((i, index) => (
                            <Marker key={`checkpoint-marker-${i.id ?? index}`} coordinate={i.location} pinColor="#00b3ff"
                                title={i.type ? `${i.type} (${formatDistance(Number(i.distance)) ?? 0})` : "Checkpoint"}
                                description={`${i.notes || ""} • ${formatTimeOnly(i.timestamp)}`}

                                onPress={() => {
                                    setSelectedCheckpointIndex(index);
                                    focusCheckpoint(index);
                                }}
                            />
                        ))}

                        {route.length > 1 && (
                            <Polyline key="route-polyline" coordinates={route.map(p => p.location)}
                                strokeColor="#00a2ff" strokeWidth={6} />
                        )}
                    </MapView>
                    
                    

                    {/* Top Overlay */}
                    <View style={styles.topOverlay}>
                        <Pressable style={styles.closeBtn} onPress={() => setFullScreen(false)}>
                            <Text style={styles.closeBtnText}>Close</Text>
                        </Pressable>

                        <View style={styles.filterWrap}>
                            {markerFilterOptions.map((option) => {
                                const active = markerFilter === option.value;

                                return (
                                    <Pressable
                                        key={option.value}
                                        onPress={() => setMarkerFilter(option.value)}
                                        style={[styles.filterBtn, active && styles.filterBtnActive]}
                                    >
                                        <Text style={[styles.filterText, active && styles.filterTextActive]}>
                                            {option.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>


                    {/* Bottom Overlay */}
                    <View style={styles.bottomOverlay}>
                        <CheckpointDetails
                            checkpoints={localCheckpoints}
                            selectedIndex={selectedCheckpointIndex}
                            setSelectedIndex={setSelectedCheckpointIndex}
                            onFocusCheckpoint={focusCheckpoint}
                            onDelete={handleRemoveCheckpoint}
                        />
                    </View>
                </View>
                
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    mapWrapper: {
        borderRadius: 10,
        overflow: 'hidden',
    },

    map: {
        width: '100%',
        height: 350,
    },

    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    fullScreenMap: {
        flex: 1,
    },

    closeBtn: {
        position: 'absolute',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        elevation: 3,
    },

    closeBtnText: {
        fontWeight: 'bold',
    },

    topOverlay: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        gap: 14,
    },

    bottomOverlay: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },


    filterWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 60,
    },

    filterBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.85)",
    },

    filterBtnActive: {
        backgroundColor: "#007aff",
    },

    filterText: {
        fontSize: 12,
        color: "#333",
        fontWeight: "600",
    },

    filterTextActive: {
        color: "white",
    },

    subFilterWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 8,
    },

    subFilterBtn: {
        paddingVertical: 5,
        paddingHorizontal: 9,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.75)",
    },

    subFilterBtnActive: {
        backgroundColor: "#222",
    },

    subFilterText: {
        fontSize: 11,
        color: "#333",
        textTransform: "capitalize",
    },

    subFilterTextActive: {
        color: "white",
    },
});
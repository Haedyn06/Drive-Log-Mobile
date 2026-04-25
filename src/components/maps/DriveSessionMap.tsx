import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { formatDistance, formatSpeed, formatTimeOnly, formatReadableElapsed } from '@/utils/format';

import CheckpointDetailsModal from '../CheckpointDetailsModal';

import type { Coords } from '@/types/sessionObj/LocationType';
import type { SessionCheckpoint } from '@/types/sessionObj/CheckpointType';
import type { TopAltitude, TopSpeed } from '@/types/sessionObj/MetricsType';
import type { SessionStopPoint } from '@/types/sessionObj/StopPointType';

type MarkerFilter = | "all" | "topAll" | "stops" | "startEnd" | "checkpoints";

type DriveSessionMapProps = {
    title?: string;
    liveStatus?: string;
    showUserLocation?: boolean;
    locStart: Coords | null;
    locEnd: Coords | null;
    route: Coords[];
    mapStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    checkpoints?: SessionCheckpoint[];
    previewOnly?: boolean;
    timeStart: number | null;
    timeEnd?: number | null;
    distance?: number;
    topAltitude?: TopAltitude | null;
    topSpeed?: TopSpeed | null;
    stops?: SessionStopPoint[] | null;
};

export default function DriveSessionMap({
    title = 'Route',
    liveStatus = 'notstart',
    showUserLocation = false,
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
    const initialLat = route[0]?.latitude ?? locStart?.latitude ?? 51.0447;
    const initialLng = route[0]?.longitude ?? locStart?.longitude ?? -114.0719;

    const [mapRegion, setMapRegion] = useState({
        latitude: initialLat,
        longitude: initialLng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [fullScreen, setFullScreen] = useState(false);
    const [markerFilter, setMarkerFilter] = useState<MarkerFilter>("all");
    const [selectedCheckpointIndex, setSelectedCheckpointIndex] = useState<number | null>(null);

    const mapRef = useRef<MapView | null>(null);

    const showAll = markerFilter === "all";

    const showStartEnd = showAll || markerFilter === "startEnd";
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


    const focusCheckpoint = (index: number) => {
        const checkpoint = checkpoints?.[index];
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

    const mapContent = (
        <MapView
            key={route.length === 0 ? 'empty-map' : 'active-map'}
            style={[styles.map, mapStyle]}
            showsUserLocation={showUserLocation}
            followsUserLocation={liveStatus !== 'notstart'}
            scrollEnabled={!previewOnly}
            zoomEnabled={!previewOnly}
            rotateEnabled={!previewOnly}
            pitchEnabled={!previewOnly}
            toolbarEnabled={!previewOnly}
            initialRegion={{ latitude: initialLat, longitude: initialLng, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
        >
            {locStart && (
                <Marker coordinate={locStart} title={`Start (0m)`} description={`${formatTimeOnly(timeStart)}`} pinColor="green" />
            )}

            {locEnd && (
                <Marker coordinate={locEnd} title={`End (${formatDistance(distance ?? 0)})`} description={`${formatTimeOnly(timeEnd)}`} pinColor="red" />
            )}

            {topSpeed?.location && (
                <Marker coordinate={topSpeed?.location} title={`Top Speed (${formatSpeed(topSpeed.speed ?? 0)})`} description={`${formatTimeOnly(topSpeed.timestamp ?? 0)}`} pinColor="blue" />
            )}

            {topAltitude?.location && (
                <Marker coordinate={topAltitude?.location} title={`Highest Altitude (${formatSpeed(topAltitude.altitude ?? 0)})`} description={`${formatTimeOnly(topAltitude.timestamp ?? 0)}`} pinColor="blue" />
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
                <Polyline coordinates={route} strokeColor="#00a2ff" strokeWidth={6} />
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
                            <Marker key={`stop-marker-${index}`} coordinate={i.location} pinColor="orange" title="Stop" 
                                description={`${formatReadableElapsed(i.duration) || ""} • ${formatTimeOnly(i.timestamp)}`}
                            >
                                <Ionicons name="stop-circle-outline" size={40} color="red" />
                            </Marker>
                        
                        ))}

                        {showCheckpoints && checkpoints?.map((i, index) => (
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
                            <Polyline key="route-polyline" coordinates={route}
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
                        
                    </View>
                        <CheckpointDetailsModal
                            checkpoints={checkpoints ?? []}
                            selectedIndex={selectedCheckpointIndex}
                            setSelectedIndex={setSelectedCheckpointIndex}
                            onFocusCheckpoint={focusCheckpoint}
                        />
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
import { useState, useRef, useEffect, use } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import * as Location from "expo-location";

import ConfirmationPopup from '@/components/modals/ConfirmationPopup';

import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';


import { formatDistance, formatTimeOnly } from '@/utils/format';
import CheckpointFormModal from '@/components/forms/CheckpointForm';
import { wait } from '@/utils/times';
import type { Coords } from '@/types/CoordinateType';
import type { SessionRoutePoint, SessionCheckpoint } from '@/types/dbObj/mapPointTypes';

type PovType = 'first' | 'third';

type LiveMapFullProps = {
    visible: boolean;
    onClose: () => void;
    liveStatus: string;
    elapsed: number;
    speed: number;
    distance: number;
    altitude: number;
    locStart: Coords | null;
    locEnd: Coords | null;
    route: SessionRoutePoint[];
    checkpoints: SessionCheckpoint[];
    handleLive: () => void;
    handleEnd: () => void;
    handleReset: () => void;
};

import type { MapType } from '@/composables/useFreeMap';

export default function LiveMapFull({ 
        visible, onClose, liveStatus,
        elapsed, speed, distance, altitude, 
        locStart, locEnd, route = [], 
        handleLive, handleEnd, handleReset, checkpoints
}: LiveMapFullProps) {

    const isPaused = 'paused';
    const isNotStart = 'notstart';
    const mainIcon = liveStatus !== isPaused ? 'pause' : 'play';

    const mapRef = useRef<MapView | null>(null);
    const headingRef = useRef(0);

    const [checkpointModalVisible, setCheckpointModalVisible] = useState(false);
    const [povType, setPovType] = useState<PovType>('first');
    const [heading, setHeading] = useState(0);
    const [region, setRegion] = useState<any>(null);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [resetPopup, setResetPopup] = useState(false);
    const [mapType, setMapType] = useState<MapType>('standard');
    const drawerProgress = useSharedValue(1);



    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const loc = await Location.getCurrentPositionAsync({});
            handleFirstPerson();
            setRegion({
                latitude: loc.coords.latitude, longitude: loc.coords.longitude,
                latitudeDelta: 0.005, longitudeDelta: 0.005,
            });
        })();
    }, []);

    useEffect(() => {
        let sub: Location.LocationSubscription | null = null;

        const smoothHeading = (prev: number, next: number, factor = 0.15) => {
            let diff = ((next - prev + 540) % 360) - 180;
            return (prev + diff * factor + 360) % 360;
        };

        const start = async () => {
            sub = await Location.watchHeadingAsync((data) => {
                const raw = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
                const smoothed = smoothHeading(headingRef.current, raw);
                headingRef.current = smoothed;
                setHeading(smoothed);
            });
        };

        start();

        return () => sub?.remove();
    }, []);


    // Track Orientation
    // useEffect(() => {
    //     if (povType !== "first") return;
    //     mapRef.current?.animateCamera({heading}, {duration: 100});
    // }, [heading, povType]);

    const toggleMapView = () => {
        if (mapType === 'standard') setMapType('hybrid');
        else setMapType('standard');
    }

    const handleRecenter = async () => {
        const loc = await Location.getCurrentPositionAsync({});

        mapRef.current?.animateCamera(
            {center: { latitude: loc.coords.latitude, longitude: loc.coords.longitude }, altitude: 200, zoom: 18, pitch: 0, heading: 0},
            {duration: 200}
        );
    };

    const handleFirstPerson = async () => {
        const loc = await Location.getCurrentPositionAsync({});
        if (!mapRef.current) return;
        await handleRecenter();
        await wait(250);
        setPovType('first');
        mapRef.current.animateCamera(
            {
                center: { latitude: loc.coords.latitude, longitude: loc.coords.longitude }, 
                altitude: 1000, zoom: 20, pitch: 0, heading: heading
            },
            { duration: 500 }
        );
    }

    const handleThirdPerson = async () => {
        const loc = await Location.getCurrentPositionAsync({});
        if (!mapRef.current) return;
        
        setPovType('third');
        mapRef.current.animateCamera(
            {
                center: { latitude: loc.coords.latitude, longitude: loc.coords.longitude }, 
                pitch: 0, heading: 0, altitude: 1500, zoom: 14
            },
            { duration: 500 }
        );
    }

    const handlePov = async () => {
        const next = povType === "first" ? "third" : "first";
        if (!mapRef.current) return;
        
        if (next === 'first') handleFirstPerson();
        else await handleThirdPerson();
    }

    const handleFinish = async () => {
        handleEnd();
        onClose();
    };

    function handleCheckpointForm() {
        setCheckpointModalVisible(true);
    }

    function handleCloseCheckpointForm() {
        setCheckpointModalVisible(false);
    }

        const toggleDrawer = () => {
        const next = !drawerOpen;
        setDrawerOpen(next);
        drawerProgress.value = withTiming(next ? 1 : 0, { duration: 250 });
    };

    const drawerStyle = useAnimatedStyle(() => ({
        opacity: drawerProgress.value,
        transform: [
            {
                translateY: withTiming(drawerOpen ? 0 : 40),
            },
            {
                scale: withTiming(drawerOpen ? 1 : 0.85),
            },
        ],
    }));


    const handleResetSession = async () => {
        onClose();
        await wait(500);
        handleReset();
    }


    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.fullScreenContainer}>
                <MapView
                    style={styles.fullScreenMap}
                    showsCompass showsScale showsTraffic showsBuildings showsIndoors showsUserLocation 
                    
                    scrollEnabled={povType === "third"} rotateEnabled
                    pitchEnabled={povType === "third"} zoomEnabled
                    toolbarEnabled={povType === "third"}
                    mapType={mapType}
                    
                    followsUserLocation={liveStatus !== isNotStart && povType === 'first'}
                    initialRegion={region} ref={mapRef}
                >
                    {locStart && (
                        <Marker coordinate={locStart} title="Start" pinColor="green" />
                    )}

                    {checkpoints.map((i) => (
                        <Marker
                            key={i.id}
                            coordinate={i.location}
                            title={i.type ? `${i.type} (${i.distance ?? 0}m)` : "Checkpoint"}
                            description={`${i.notes || "No note"} • ${formatTimeOnly(i.timestamp)}`}
                            pinColor="blue"
                        />
                    ))}

                    {route.length > 1 && (
                        <Polyline coordinates={route.map(p => p.location)} strokeColor="#00a2ff" strokeWidth={6} />
                    )}
                </MapView>
                

                {/* Top */}
                <View style={styles.topOverlay}>
                    <Text style={styles.elapsedText}>
                        {Math.floor(elapsed / 3600000).toString().padStart(2, '0')}:
                        {Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0')}:
                        {Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0')}.
                        {Math.floor((elapsed % 1000) / 10).toString().padStart(2, '0')}
                    </Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statPill}>
                            <Text style={styles.statLabel}>Speed</Text>
                            <Text style={styles.statValue}>{speed.toFixed(0)} km/h</Text>
                        </View>

                        <View style={styles.statPill}>
                            <Text style={styles.statLabel}>Distance</Text>
                            <Text style={styles.statValue}>{formatDistance(distance)}</Text>
                        </View>

                        <View style={styles.statPill}>
                            <Text style={styles.statLabel}>Altitude</Text>
                            <Text style={styles.statValue}>
                                {altitude.toFixed(0)} m
                            </Text>
                        </View>
                    </View>

                    {/* Prefs */}
                    <View style={{display: 'flex', marginLeft: 'auto', gap:12}}>
                        <Pressable style={styles.povBtn} onPress={handlePov}>
                            {povType === "first" ? 
                                (<Ionicons name='navigate' size={30} color='white' />) : 
                                (<Ionicons name='navigate-outline' size={30} color='white' />)
                            }                        
                        </Pressable>

                        <Pressable style={styles.mapBtn} onPress={toggleMapView}>
                            {mapType === "standard" ? 
                                (<Ionicons name='map-outline' size={30} color='white' />) : 
                                (<Ionicons name='map' size={30} color='white' />)
                            }                        
                        </Pressable>
                    </View>
                </View>


                {/* Bottom */}
                <View style={styles.bottomOverlay}>
                    {/* Left */}
                    <View style={styles.bottomLeft}>
                        <Animated.View style={[styles.drawerItems, drawerStyle]}>
                            <Pressable style={styles.resetBtn} onPress={handleReset}>
                                <Ionicons name="refresh" size={30} color="#fff" />
                            </Pressable>

                            <Pressable style={styles.closeBtn} onPress={onClose}>
                                <Ionicons name="close" size={24} color="#111" />
                            </Pressable>
                        </Animated.View>

                        <Pressable style={styles.closeBtn} onPress={toggleDrawer}>
                            <Ionicons
                                name={drawerOpen ? "chevron-down" : "chevron-up"}
                                size={24}
                                color="#111"
                            />
                        </Pressable>
                    </View>
                    
                    {/* Middle */}
                    <View style={styles.bottomMiddle}>
                        <Pressable style={styles.controlBtn} onPress={handleLive}>
                            <Ionicons name={mainIcon} size={30} color="#fff" />
                        </Pressable>

                        <Pressable style={styles.checkpntBtn} onPress={handleCheckpointForm}>
                            <Ionicons name="add-circle-outline" size={30} color="#fff" />
                        </Pressable>

                        <Pressable style={styles.finishBtn} onPress={handleFinish}>
                            <Ionicons name="flag-outline" size={22} color="#111" />
                        </Pressable>
                    </View>


                    {/* Right */}
                    <View style={styles.bottomRight}>

                    </View>

                </View>

                <CheckpointFormModal
                    visible={checkpointModalVisible}
                    onClose={handleCloseCheckpointForm}
                />
            </View>

            <ConfirmationPopup visible={resetPopup} label="reset drive" onConfirm={handleResetSession} onCancel={() => setResetPopup(false)} />
        </Modal>
    );
}

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#000',
    },

    fullScreenMap: {
        flex: 1,
    },

    topOverlay: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        gap: 14,
    },

    elapsedText: {
        alignSelf: 'center',
        backgroundColor: 'rgba(20,20,20,0.85)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 999,
        fontSize: 26,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 1,
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },

    statPill: {
        flex: 1,
        backgroundColor: 'rgba(20,20,20,0.85)',
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: 'center',
    },

    statLabel: {
        fontSize: 11,
        color: '#aaa',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    statValue: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '900',
        marginTop: 4,
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

    bottomLeft: {
        display: 'flex',
        gap: 10

    },

    bottomMiddle: {
        marginTop: 'auto',
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },


    bottomRight: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },

    closeBtn: {
        width: 56,
        height: 56,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },

    controlBtn: {
        width: 90,
        height: 90,
        borderRadius: 999,
        backgroundColor: '#ff3b30',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        marginTop: 'auto',
    },

    povBtn: {
        width: 60, 
        height: 60, 
        borderRadius: 60, 
        backgroundColor: "#111", 
        alignItems: "center", 
        justifyContent: "center", 
        zIndex: 999, 
        elevation: 999,
        marginTop: 'auto'
    },


    mapBtn: {
        width: 60, 
        height: 60, 
        borderRadius: 60, 
        backgroundColor: "#111", 
        alignItems: "center", 
        justifyContent: "center", 
        zIndex: 999, 
        elevation: 999,
        marginTop: 'auto'
    },

    checkpntBtn: {
        width: 60,
        height: 60,
        borderRadius: 999,
        backgroundColor: '#3094ff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        marginTop:'auto'
    },

    resetBtn: {
        width: 60,
        height: 60,
        borderRadius: 999,
        backgroundColor: '#f85d4f',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        marginTop:'auto'
    },

    finishBtn: {
        height: 60,
        width: 60,
        borderRadius: 999,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        elevation: 5,
        marginTop:'auto'
    },

    finishText: {
        fontSize: 15,
        fontWeight: '900',
        color: '#111',
        letterSpacing: 0.5,
    },

    drawerItems: {
        gap: 10,
    },
});
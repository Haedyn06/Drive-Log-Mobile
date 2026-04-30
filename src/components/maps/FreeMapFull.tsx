import { useState, useEffect, useRef } from "react";
import { Modal, View, Pressable, StyleSheet, Text } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

import type { Coords } from "@/types/CoordinateType";
import type { PinnedLocation } from "@/types/PinnedLocation";
import PinLocationMapped from "../forms/PinLocationMapped";
import { getPinnedLocationsDB } from "@/database/methods";
import { formatDateNum } from "@/utils/format";

type FreeFullMapProps = {
    visible: boolean;
    onClose: () => void;
};

type MapType = "standard" | "satellite" | "hybrid";
type FPSType = "first" | "third";
type FilterType = "none" | "pinned" | "saved";

export default function FreeFullMap({ visible, onClose }: FreeFullMapProps) {
    const mapRef = useRef<MapView | null>(null);
    const headingRef = useRef(0);
    const [region, setRegion] = useState<any>(null);
    const [mapType, setMapType] = useState<MapType>("standard");
    const [fpsType, setFpsType] = useState<FPSType>("third");
    const [filterType, setFilterType] = useState<FilterType>('none');
    const [heading, setHeading] = useState(0);
    const [pinMode, setPinMode] = useState(false);
    const [pinLoc, setPinLoc] = useState<Coords>();
    const [pinMapForm, setPinMapForm] = useState(false);

    const [pinnedLocations, setPinnedLocations] = useState<PinnedLocation[]>([]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const loc = await Location.getCurrentPositionAsync({});

            setRegion({
                latitude: loc.coords.latitude, longitude: loc.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
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
                const raw =
                    data.trueHeading >= 0 ? data.trueHeading : data.magHeading;

                const smoothed = smoothHeading(headingRef.current, raw);
                headingRef.current = smoothed;

                setHeading(smoothed);
            });
        };

        start();

        return () => sub?.remove();
    }, []);


    useEffect(() => {
        if (fpsType !== "first") return;

        mapRef.current?.animateCamera(
            { heading },
            { duration: 100 }
        );
    }, [heading, fpsType]);

    const handleMapType = (typeMap: MapType) => {
        setMapType(typeMap);
    }

    const handleFPSType = async () => {
        const next = fpsType === "first" ? "third" : "first";
        setFpsType(next);

        const loc = await Location.getCurrentPositionAsync({});

        if (!mapRef.current) return;

        if (next === "first") {
            setMapType("standard");
            mapRef.current.animateCamera(
                {center: { latitude: loc.coords.latitude, longitude: loc.coords.longitude }, altitude: 250, zoom: 20, pitch: 50, heading: heading},
                { duration: 500 }
            );
        } else {
            mapRef.current.animateCamera(
                {center: { latitude: loc.coords.latitude, longitude: loc.coords.longitude }, pitch: 0, heading: 0, altitude: 1500, zoom: 14},
                { duration: 500 }
            );
        }
    };

    const handleFilterType = async (typeFilter: FilterType) => {
        if (typeFilter == filterType) { 
            setFilterType('none');
            setPinnedLocations([]);
            return;
        }
        
        if (typeFilter == 'saved') {
            setFilterType('saved');
            setPinnedLocations([]);
        } else if (typeFilter == 'pinned') {
            setFilterType('pinned')
            const data = await getPinnedLocationsDB();
            setPinnedLocations(data);
        } 
            
    }



    const handlePinMapClose = () => {
        setPinMapForm(false);
    }


    
    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.container}>
                {region && (
                    
                    <MapView
                        style={StyleSheet.absoluteFillObject}
                        initialRegion={region}
                        ref={mapRef}
                        mapType={mapType}
                        onRegionChangeComplete={(r: Region) => setRegion(r)}
                        scrollEnabled={fpsType === "third"}
                        zoomEnabled={fpsType === "third"}
                        rotateEnabled={fpsType === "third" && !pinMode}
                        pitchEnabled={fpsType === "third" && !pinMode}
                        showsUserLocation
                        showsCompass
                        showsScale
                        showsTraffic
                        showsBuildings
                        showsIndoors
                    >
                        {filterType === 'pinned' && pinnedLocations.map((i, index) => (
                            <Marker key={`${i.id ?? index}`} coordinate={i.location} pinColor="red"
                                title={i.name} description={`${i.notes || ""} • ${formatDateNum(i.timestamp)}`}
                            />
                        ))
                        
                        
                        }

                    </MapView>
                )}
                {/* Top */}
                <View style={styles.topContainer}>
                    {/* Top Left */}
                    <View style={styles.topLeftContainer}>
                        {/* Filters */}
                        <View style={{display:'flex', flexDirection:'row', gap:10}}>
                            <Pressable onPress={() => handleFilterType('pinned')} style={[styles.filterBtn, {backgroundColor: filterType === 'pinned' ? 'black' : 'none'}]}>
                                <Text style={{color: filterType === 'pinned' ? 'white' : 'black'}}>Pinned Locations</Text>
                            </Pressable>

                            <Pressable onPress={() => handleFilterType('saved')} style={[styles.filterBtn, {backgroundColor: filterType === 'saved' ? 'black' : 'none'}]}>
                                <Text style={{color: filterType === 'saved' ? 'white' : 'black'}}>Saved Routes</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Top Right */}
                    <View style={styles.topRightContainer}>
                        <Pressable style={styles.closeBtn} onPress={onClose}>
                            <Ionicons name="close" size={28} color="white" />
                        </Pressable>

                        {fpsType !== "first" &&
                            <View style={{display:'flex', flexDirection:'column', gap:5, marginTop:10}}>
                                <Pressable style={styles.typeOpt} onPress={() => handleMapType("standard")}>
                                    <Text style={{margin: 'auto', fontSize:10, color: mapType === "standard" ? "green" : "#555",}} >Standard</Text>
                                </Pressable>

                                <Pressable style={styles.typeOpt} onPress={() => handleMapType("hybrid")}>
                                    <Text style={{margin: 'auto', fontSize:12, color: mapType === "hybrid" ? "green" : "#555",}} >Hybrid</Text>
                                </Pressable>

                                <Pressable style={styles.typeOpt} onPress={() => handleMapType("satellite")}>
                                    <Text style={{margin: 'auto', fontSize:10, color: mapType === "satellite" ? "green" : "#555",}} >Satellite</Text>
                                </Pressable>

                                <Pressable style={styles.typeOpt} onPress={() => setPinMode(true)}>
                                    <Text style={{ margin: "auto", fontSize: 16 }}>Pin1</Text>
                                </Pressable>

                                <Pressable style={styles.typeOpt} onPress={() => handleMapType("satellite")}>
                                    <Text style={{margin: 'auto', fontSize:16,}} >Pin2</Text>
                                </Pressable>

                            </View>
                        }

                    </View>

                </View>


                {/* Center */}
                <View style={styles.centerContainer}>
                    {pinMode && (
                        <View pointerEvents="none" style={styles.centerPin}>
                            <Ionicons name="location-sharp" size={42} color="red" />
                        </View>
                    )}


                </View>


                {/* Bottom */}
                <View style={styles.bottomContainer}>
                    <View style={styles.bottomRightContainer}>
                        {mapType === 'standard' &&
                            <Pressable onPress={handleFPSType} style={{backgroundColor:'white', padding:8, borderRadius:6}}>
                                {fpsType === "first" ? <Text>Third-Person</Text> : <Text>First-Person</Text>}
                            </Pressable>
                        }
                    </View>
                    {pinMode && (
                        <View style={styles.pinSaveBox}>
                            <Text style={{ color: "white" }}>
                                {region.latitude.toFixed(6)}, {region.longitude.toFixed(6)}
                            </Text>

                            <Pressable
                                style={styles.savePinBtn}
                                onPress={() => {setPinLoc({latitude: region.latitude, longitude: region.longitude});
                                    setPinMode(false);
                                    setPinMapForm(true);
                                }}
                            >
                                <Text style={{ color: "white", fontWeight: "700" }}>Save Pin</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
                
                <PinLocationMapped visible={pinMapForm} onClose={handlePinMapClose} location={pinLoc ?? {latitude: 0, longitude: 0}} />
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },

    topContainer: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,

    },

    topLeftContainer: {
        display: 'flex',
        flexDirection: 'column',
        position: "absolute",
        left: 20,
        top: 50

    },

    filterBtn: {
        borderWidth: 2,
        padding: 5,
        borderRadius: 16,
    },

    topRightContainer: {
        display: 'flex',
        flexDirection: 'column',
        position: "absolute",
        right: 20,
        

    },

    typeOpt: {
        backgroundColor: '#eee',
        height: 50,
        borderRadius:7,
        borderWidth: 1

    },

    centerContainer: {
        position: "absolute",
        bottom: '50%',
        top: '50%',
        left: 0,
        right: 0,

    },

    bottomContainer: {
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,

    },

    bottomRightContainer: {
        display: 'flex',
        flexDirection: 'column',
        position: "absolute",
        right: 20,

    },


    closeBtn: {
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 10,
        borderRadius: 50,
    },

    centerPin: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -21 }, { translateY: -42 }],
        zIndex: 10,
    },

pinSaveBox: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
},

savePinBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
},
});
import { useState, useEffect, useRef } from "react";
import { Modal, View, Pressable, StyleSheet, Text } from "react-native";
import MapView, { Marker, Region, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import { formatDateNum, formatTimeOnly, formatDistance } from "@/utils/format";

import PinLocationMapped from "@/components/forms/PinLocationMapped";
import PinLocationSheet from "@/components/bottomSheets/PinLocationsSheet";
import SavedSessionsSheet from "../bottomSheets/SavedSessionsSheet";

// import { useSharedFreeMap } from "@/context/FreeMapContext";
import { useFreeMap } from "@/composables/useFreeMap";


type FreeFullMapProps = {
    visible: boolean;
    onClose: () => void;
};

export default function FreeFullMap({ visible, onClose }: FreeFullMapProps) {
    const {
        mapRef, headingRef, sheetRef,
        region, heading,
        mapType, fpsType, filterType,
        pinMode, pinLoc, pinMapForm, pinnedLocations, 
        savedSessions, savedSession,

        setRegion, setPinMode, 

        handlefocusLoc, handleRecenter, resetValues,
        handleMapType, handleFPSType, handleFilterType,
        handleSaveLoc, handleCancelLoc, handlePinMapClose, handleFirstPinLoc,
        handleMapRoute

    } = useFreeMap();
    
    return (
        <Modal visible={visible} animationType="slide">
            
            <View style={styles.container}>
                {region && ( 
                    <MapView
                        style={StyleSheet.absoluteFillObject}
                        initialRegion={region} ref={mapRef} mapType={mapType}
                        
                        onRegionChangeComplete={(r: Region) => setRegion(r)}
                        
                        scrollEnabled={fpsType === "third"} zoomEnabled={fpsType === "third"} 
                        rotateEnabled={fpsType === "third" && !pinMode} pitchEnabled={fpsType === "third" && !pinMode}
                        
                        showsUserLocation showsCompass showsScale showsTraffic showsBuildings showsIndoors
                    >
                        {filterType === 'pinned' && pinnedLocations.map((i, index) => (
                            <Marker key={`${i.id ?? index}`} coordinate={i.location} pinColor="red"
                                title={i.name} description={`${i.notes || ""} • ${formatDateNum(i.timestamp)}`}
                            />
                        ))}
                        
                        {savedSession && (
                            <View>
                                {savedSession.mappedRoute && (
                                    <Polyline coordinates={savedSession.mappedRoute.map(p => ({
                                            latitude: p.location.latitude, longitude: p.location.longitude
                                        }))}
                                        strokeColor="#00a2ff" strokeWidth={6} />
                                )}

                                {savedSession.locations.startLocation.coords && (
                                    <Marker coordinate={savedSession.locations.startLocation.coords} 
                                    title={`Start (0m)`} description={`${formatTimeOnly(savedSession.timestamps.timestampStart)}`} pinColor="green" />
                                )}
                    
                                {savedSession.locations.endLocation.coords && (
                                    <Marker coordinate={savedSession.locations.endLocation.coords} 
                                        title={`End (${formatDistance(savedSession.metrics.distance ?? 0)})`} 
                                        description={`${formatTimeOnly(savedSession.timestamps.timestampEnd)}`} pinColor="red" />
                                )}
                            </View>
                        )}
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

                        {/* Map Perspective */}
                        <View style={{display:'flex', flexDirection:'row', gap:12}}>
                            {mapType === 'standard' &&
                                <Pressable onPress={handleFPSType} style={{backgroundColor:'white', padding:8, borderRadius:6 }}>
                                    {fpsType === "first" ? 
                                        <Text style={{textAlign:'center'}}>Third-Person</Text> : <Text style={{textAlign:'center'}}>First-Person</Text>}
                                </Pressable>
                            }

                            {fpsType === 'third' && 
                                <Pressable onPress={handleRecenter} style={{backgroundColor:'white', padding:8, borderRadius:6 }}>
                                    <Text style={{textAlign:'center'}}>Center</Text>
                                </Pressable>
                            }

                            {fpsType === 'first' &&
                                <Pressable onPress={handleFirstPinLoc} style={{backgroundColor:'white', padding:8, borderRadius:6 }}>
                                    <Text style={{textAlign:'center'}}>Pin Location</Text>
                                </Pressable>
                            }
                        </View>
                    </View>

                    {/* Top Right */}
                    <View style={styles.topRightContainer}>
                        <Pressable style={styles.closeBtn} 
                            onPress={() => {
                                resetValues();
                                onClose();
                            }}
                        >
                            <Ionicons name="close" size={28} color="white" />
                        </Pressable>
                        
                        {/* Map Type View */}
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

                                <Pressable style={styles.typeOpt} onPress={() => setPinMode(!pinMode)}>
                                    <Text style={{ margin: "auto", fontSize: 16 }}>Pin1</Text>
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
                    
                    {/* Bottom Right */}
                    <View style={styles.bottomRightContainer}>

                    </View>

                    
                    {pinMode && (
                        <View style={styles.pinSaveBox}>
                            <Text style={{ color: "white" }}>
                                {region.latitude.toFixed(6)}, {region.longitude.toFixed(6)}
                            </Text>
                            
                            {/* buttons */}
                            <View style={{display:'flex', flexDirection:'row', gap:5}}>
                                <Pressable style={styles.savePinBtn} onPress={handleCancelLoc}>
                                    <Text style={{ color: "white", fontWeight: "700" }}>Cancel</Text>
                                </Pressable>

                                <Pressable style={styles.savePinBtn} onPress={() => handleSaveLoc(region.latitude, region.longitude)}>
                                    <Text style={{ color: "white", fontWeight: "700" }}>Save Pin</Text>
                                </Pressable>
                            </View>

                        </View>
                    )}
                </View>
                
                {filterType === 'pinned' && <PinLocationSheet sheetRef={sheetRef} pinLocs={pinnedLocations} onFocusLoc={handlefocusLoc} />}

                {filterType === 'saved' && <SavedSessionsSheet sheetRef={sheetRef} savedSess={savedSessions} selectedSess={savedSession} routeMap={handleMapRoute} />}

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
        top: 50,
        gap: 12

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
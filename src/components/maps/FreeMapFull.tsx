import { useState, useEffect, useRef } from "react";
import { Modal, View, Pressable, StyleSheet, Text } from "react-native";
import MapView, { Marker, Region, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import { formatDateNum, formatTimeOnly, formatDistance } from "@/utils/format";

import PinLocationMapped from "@/components/forms/PinLocationMapped";
import PinLocationSheet from "@/components/bottomSheets/PinLocationsSheet";
import SavedSessionsSheet from "../bottomSheets/SavedSessionsSheet";
import FreeMapControls from "../FreeMapControls";

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
        pinMode, pinLoc, pinMapForm, pinnedLocations, selectedPinnedLoc,
        savedSessions, savedSession,

        setRegion, setPinMode, togglePinMode, setSelectedPinLoc,

        handlefocusLoc, handleRecenter, resetValues, checkCentered,
        handleMapType, handleMapPerspective, handleFilterType,
        handleSaveLoc, handleCancelLoc, handlePinMapClose, handleFirstPinLoc, handlePrevPinnedLoc, handleNextPinnedLoc,
        refreshPinnedLocations,
        handleMapRoute

    } = useFreeMap();


    const btnControls = () => (
        <FreeMapControls style={{top:-90}} handlePerspective={handleMapPerspective} fpsType={fpsType} filterType={filterType} handleFilterType={handleFilterType} />
    );

    
    return (
        <Modal visible={visible} animationType="slide">
            
            <View style={styles.container}>
                {region && ( 
                    <MapView
                        style={StyleSheet.absoluteFillObject}
                        initialRegion={region} ref={mapRef} mapType={mapType}
                        
                        onRegionChangeComplete={(r: Region) => {
                            setRegion(r)
                        }}
                        
                        scrollEnabled={fpsType === "third"} zoomEnabled={fpsType === "third"} 
                        rotateEnabled={fpsType === "third" && !pinMode} pitchEnabled={fpsType === "third" && !pinMode}
                        
                        showsUserLocation showsCompass showsScale showsTraffic showsBuildings showsIndoors
                    >
                        {filterType === 'pinned' && pinnedLocations.map((i, index) => (
                            <Marker key={`${i.id ?? index}`} coordinate={i.location} pinColor="red"
                                title={i.name} description={`${i.notes || ""} • ${formatDateNum(i.timestamp)}`}
                                onPress={() => setSelectedPinLoc(i.id)}
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
                        {pinMode && (
                            <View style={styles.pinSaveBox}>
                                <Text style={{ color: "white" }}>
                                    {region.latitude.toFixed(6)}, {region.longitude.toFixed(6)}
                                </Text>

                            </View>
                        )}
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
                            <View style={{display:'flex', flexDirection:'column', gap:5, marginTop:40}}>
                                <Pressable style={styles.typeOpt} onPress={() => handleFilterType('pinned')}>
                                    <Ionicons name={pinMode ? 'menu' : 'menu-outline'} size={25} color='white' />
                                </Pressable>

                                <Pressable style={styles.typeOpt} onPress={handleMapType}>
                                    <Ionicons name={mapType === 'standard' ? 'map-outline' : 'map'} size={24} color='white' />
                                </Pressable>
                            </View>

                    </View>

                </View>


                {/* Center */}
                <View style={styles.centerContainer}>
                    {pinMode && (
                        <View pointerEvents="none" style={styles.centerPin}>
                            <Ionicons name="pin-sharp" size={42} color="red" />
                        </View>
                    )}
                </View>


                {/* Bottom */}
                <View style={styles.bottomContainer}>
                    
                    {/* Bottom Right */}
                    <View style={styles.bottomRightContainer}>
                        {filterType === 'none' && (
                            <FreeMapControls style={styles.btnControls} handlePerspective={handleMapPerspective} fpsType={fpsType} filterType={filterType} handleFilterType={handleFilterType} />
                        )}
                    </View>
                </View>
                
                {filterType === 'pinned' && 
                    <PinLocationSheet sheetRef={sheetRef} onFocusLoc={handlefocusLoc} fpsType={fpsType} handleFirstPinLoc={handleFirstPinLoc} 
                        btnControls={btnControls} pinMode={pinMode} setPinMode={setPinMode} selPinLoc={selectedPinnedLoc} 
                        handleNextPin={handleNextPinnedLoc} handlePrevPin={handlePrevPinnedLoc} handleSavePin={handleSaveLoc} region={region} refreshLocs={refreshPinnedLocations}
                    />
                }
                {filterType === 'saved' && <SavedSessionsSheet sheetRef={sheetRef} savedSess={savedSessions} selectedSess={savedSession} routeMap={handleMapRoute} btnControls={btnControls} />}

                <PinLocationMapped visible={pinMapForm} onClose={handlePinMapClose} location={pinLoc ?? {latitude: 0, longitude: 0}} onRefresh={refreshPinnedLocations} />
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
        backgroundColor: '#000000',
        height: 50,
        borderRadius:7,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
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

    btnControls: {
        top: -20,
        left: -80
    }
});
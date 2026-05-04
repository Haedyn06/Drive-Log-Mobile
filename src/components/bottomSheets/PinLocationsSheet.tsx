
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import type { PinnedLocation } from "@/types/PinnedLocation";
import { Ionicons } from '@expo/vector-icons';
import FreeMapControls from '../FreeMapControls';
import { navigateMapLocation } from '@/utils/locationAccess';

import PinnedLocCardB from '@/components/cards/PinnedLocCardB';

import type { FPSType } from '@/composables/useFreeMap';

type PinLocationSheetProps = {
    sheetRef: React.RefObject<BottomSheet | null>;
    onFocusLoc: (lat: number, lon: number) => void;
    btnControls: any;
    pinMode: boolean;
    setPinMode: React.Dispatch<React.SetStateAction<boolean>>; 
    selPinLoc: string | null;
    handlePrevPin: () => void;
    handleNextPin: () => void;
    handleSavePin: (lat:number, lon:number) => void;
    region: any;
    fpsType: FPSType;
    handleFirstPinLoc: () => void;
    refreshLocs: () => void;
};
export default function PinLocationSheet({ sheetRef, onFocusLoc, btnControls=null, pinMode, setPinMode, selPinLoc, handlePrevPin, handleNextPin, handleSavePin, region, fpsType, handleFirstPinLoc, refreshLocs}: PinLocationSheetProps) {
    const [isFirst, setIsFirst] = useState(false);
    const snapPoints = useMemo(
        () => (fpsType === "first" ? ["10%", "20%"] : ["10%", "20%", "40%"]),
        [fpsType]
    );    

    useEffect(() => {
        if (fpsType === 'first') setIsFirst(true);
        else setIsFirst(false);
    }, [fpsType])

    const handlePinMode = async () => {        
        if (pinMode) {
            if (fpsType !== 'first') sheetRef.current?.snapToIndex(2);

        } else {
            sheetRef.current?.snapToIndex(1);
        }

        setPinMode(!pinMode);
    }

    const handleSave = () => {
        if (fpsType == 'first') handleFirstPinLoc();
        else handleSavePin(region.latitude, region.longitude);
    }


    return (
        <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints}
            enableDynamicSizing={false} enableOverDrag={false} handleIndicatorStyle={{ backgroundColor: '#999' }}
            handleComponent={btnControls}
            enableHandlePanningGesture={!pinMode}
            enableContentPanningGesture={!pinMode}
            onChange={(index) => {
            }}
        >

            <BottomSheetView style={styles.container}>
                <View style={styles.handleBar} />
                <Text style={styles.title}>Pinned Locations</Text>
                
                <View style={styles.pinBtns}>
                    <Pressable style={styles.pinBtn} onPress={() => {handlePinMode()}}>
                        {pinMode ? 
                            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold' }}>Cancel</Text> : 
                            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold' }}>Pin Location</Text>
                        }
                    </Pressable>

                    {pinMode && (
                        <Pressable style={styles.pinBtn} onPress={() => {handleSave()}}> 
                                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold' }}>Save</Text>
                        </Pressable>
                    )

                    }
                </View>

                
                <View style={styles.cardRow}>
                    <Pressable style={styles.arrowBtn} onPress={handlePrevPin}>
                        <Ionicons name="chevron-back" size={26} color="white" />
                    </Pressable>

                    <View style={{ flex: 1 }}>
                        <PinnedLocCardB onFocusLoc={onFocusLoc} pinnedLocId={selPinLoc} fpsType={fpsType} onDeleted={refreshLocs} />
                    </View>

                    <Pressable style={styles.arrowBtn} onPress={handleNextPin}>
                        <Ionicons name="chevron-forward" size={26} color="white" />
                    </Pressable>
                </View>
                
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 12,
    },

    handleBar: {
        width: 50,
        height: 4,
        marginBottom: 12,
        borderRadius: 999,
        backgroundColor: "#999",
        marginTop: 10,
        alignSelf: 'center'
    },

    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center'
    },

    pinBtns: {
        flex:1,
        flexDirection: 'row',
        alignSelf: 'center',
        gap:10,
        justifyContent: 'center',
        marginBottom: 40,
    },

    pinBtn: {
        padding: 12,
        borderWidth: 2,
        borderRadius: 16,
        backgroundColor: 'black',
    },

    coords: {
        fontSize: 14,
        color: '#666',
    },
    notes: {
        marginTop: 10,
        fontSize: 14,
    },

    pinnedLocation: {
        width: "100%",
        padding: 14,
        borderRadius: 14,
        backgroundColor: "#f2f2f2",
    },

    cardRow: {
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        gap: 10,
    },


    arrowBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
    },


    cardNav: {
        width: "100%",
    },


});
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import type { PinnedLocation } from "@/types/PinnedLocation";
import { Ionicons } from '@expo/vector-icons';

import { navigateMapLocation } from '@/utils/locationAccess';

type PinLocationSheetProps = {
    sheetRef: React.RefObject<BottomSheet | null>;
    pinLocs: PinnedLocation[];
    onFocusLoc: (lat: number, lon: number) => void;
};
export default function PinLocationSheet({ sheetRef, pinLocs, onFocusLoc }: PinLocationSheetProps) {
    const snapPoints = useMemo(() => ['10%', '45%'], []);
    const handleSelect = (pinnedLoc: PinnedLocation) => onFocusLoc(pinnedLoc.location.latitude, pinnedLoc.location.longitude);

    return (
        <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints}
            enableDynamicSizing={false} enableOverDrag={false} handleIndicatorStyle={{ backgroundColor: '#999' }}
        >
            <BottomSheetView style={styles.container}>
                <Text style={styles.title}>Pinned Locations</Text>

                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {pinLocs && pinLocs.map ((i, index) => (
                        <View key={i.id} style={styles.pinnedLocation}>
                            <Pressable onPress={() => navigateMapLocation(i.location.latitude, i.location.longitude)}>
                                <View style={{flex:1, flexDirection:'row', gap:4}}>
                                    <Text style={{fontWeight:'bold'}}>{i.name} ({`${i.city}, ${i.country}`})</Text>
                                </View>
                                
                                <View>
                                    <Text>({`${i.location.latitude.toFixed(0)}, ${i.location.longitude.toFixed(0)}`})</Text>
                                    <Text>Notes: {i.notes || '...'}</Text>
                                </View>
                            </Pressable>

                            <Pressable style={{alignSelf:'center'}} onPress={() => handleSelect(i)}>
                                <Text style={{color:'blue'}}>Select</Text>
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    scroll: {
        flex: 1,
        height: 500
    },

    scrollContent: {
        paddingTop: 18,
        paddingBottom: 220,
    },

    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center'
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 6,
        borderTopWidth: 1,
    }
});
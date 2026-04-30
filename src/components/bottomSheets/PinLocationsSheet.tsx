import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Platform } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import PinnedLocationCard from '@/components/cards/PinnedLocationCard';
import type { PinnedLocation } from "@/types/PinnedLocation";
import { Ionicons } from '@expo/vector-icons';

type PinLocationSheetProps = {
    sheetRef: React.RefObject<BottomSheet | null>;
    pinLocs: PinnedLocation[];
    onFocusLoc: (lat: number, lon: number) => void;
};
export default function PinLocationSheet({ sheetRef, pinLocs, onFocusLoc }: PinLocationSheetProps) {
    const snapPoints = useMemo(() => ['10%', '40%'], []);

    const handleSelect = (pinnedLoc: PinnedLocation) => 
        onFocusLoc(pinnedLoc.location.latitude, pinnedLoc.location.longitude);

    const handleNavigate = async (lat:number, lon:number) => {
        const url = Platform.select({
            ios: `http://maps.apple.com/?daddr=${lat},${lon}`,
            android: `google.navigation:q=${lat},${lon}`,
            default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
        });

        if (!url) return;

        await Linking.openURL(url);
    };

    return (
        <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints} handleIndicatorStyle={{ backgroundColor: '#999' }}>
            <BottomSheetView style={styles.container}>
                <Text style={styles.title}>Pinned Locations</Text>

                <ScrollView>
                    {pinLocs && pinLocs.map ((i, index) => (
                        <View key={i.id} style={styles.pinnedLocation}>
                            <Pressable onPress={() => handleNavigate(i.location.latitude, i.location.longitude)}>
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
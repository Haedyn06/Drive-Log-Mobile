import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Platform } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { formatDistance } from '@/utils/format';

import DriveSessionCardB from '../cards/DriveSessionCardB';

import type { DriveSessionObj } from '@/types/sessionObj/DriveSessionType';
import type { SessionRoutePoint } from '@/types/dbObj/routePointType';

type SavedSessionsSheetProps = {
    sheetRef: React.RefObject<BottomSheet | null>;
    savedSess: DriveSessionObj[];
    routeMap: (session: DriveSessionObj) => void;    
};

export default function SavedSessionsSheet({ sheetRef, savedSess, routeMap }: SavedSessionsSheetProps) {
    const snapPoints = useMemo(() => ['10%', '40%'], []);

    const handleSelect = async (session: DriveSessionObj) => {
        routeMap(session);
        sheetRef.current?.snapToIndex(0);
    } 
        

    return (
        <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints} handleIndicatorStyle={{ backgroundColor: '#999' }}>
            <BottomSheetView style={styles.container}>
                <Text style={styles.title}>Saved Sessions</Text>

                <ScrollView>
                    {savedSess && savedSess.map ((i, index) => (
                        <Pressable key={i.id} onPress={() => handleSelect(i)}>
                            <DriveSessionCardB item={i} />
                        </Pressable>
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
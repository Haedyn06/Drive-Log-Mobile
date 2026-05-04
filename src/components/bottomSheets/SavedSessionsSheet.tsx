import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { formatDistance } from '@/utils/format';

import DriveSessionCardB from '../cards/DriveSessionCardB';
import SavedSessions from '@/components/sessionLists/SavedSessions';
import { getFullSessionObj } from '@/services/sessionService';
import type { DriveSessionObj } from '@/types/sessionObj/DriveSessionType';

type SavedSessionsSheetProps = {
    sheetRef: React.RefObject<BottomSheet | null>;
    savedSess: DriveSessionObj[];
    selectedSess?: DriveSessionObj | null;
    routeMap: (session: DriveSessionObj) => void;
    btnControls: any;
};

export default function SavedSessionsSheet({ sheetRef, savedSess, selectedSess, routeMap, btnControls }: SavedSessionsSheetProps) {
    const snapPoints = useMemo(() => ['10%', '45%'], []);
    
    const handleSelect = async (sessionId: string) => {
        const fullSession = await getFullSessionObj(sessionId);
        if (!fullSession) return;

        routeMap(fullSession);
        sheetRef.current?.snapToIndex(0);
    };

    return (
        <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints} enableDynamicSizing={false} 
            enableOverDrag={false} handleIndicatorStyle={{ backgroundColor: '#999' }}
            handleComponent={btnControls}
        >
            <BottomSheetView style={styles.container}>
                <View style={styles.handleBar} />
                <Text style={styles.title}>Saved Sessions</Text>
                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.sessionList}>
                        <SavedSessions onSelect={handleSelect} selSession={selectedSess} />
                    </View>
                </ScrollView>
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

    scroll: {
        flex: 1,
        height: 500
    },

    scrollContent: {
        paddingTop: 18,
        paddingBottom: 220,
    },

    sessionList: {
        paddingHorizontal: 18,
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
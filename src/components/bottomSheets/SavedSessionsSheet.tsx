import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

type SavedSessionsSheetProps = {
    sheetRef: React.RefObject<BottomSheet | null>;
};
export default function SavedSessionsSheet({ sheetRef }: SavedSessionsSheetProps) {
    const snapPoints = useMemo(() => ['12%', '40%'], []);
    return (
        <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints} handleIndicatorStyle={{ backgroundColor: '#999' }}>
            <BottomSheetView style={styles.container}>
                <Text style={styles.title}>Saved Sessions</Text>
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
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
});
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigateMapLocation } from '@/utils/locationAccess';
import { getPinnedLocationObj } from '@/services/pinnedLocationService';

import type { PinnedLocation } from '@/types/PinnedLocation';
import type { FPSType } from '@/composables/useFreeMap';

type PinnedLocCardBProps = {
    pinnedLocId: string | null;
    onFocusLoc: (lat: number, lon: number) => void;
    fpsType: FPSType;
};

export default function PinnedLocCardB({ pinnedLocId, onFocusLoc, fpsType }: PinnedLocCardBProps) {
    const [pinnedLoc, setPinnedLoc] = useState<PinnedLocation | null>(null);

    useEffect(() => {
        const loadPinLoc = async () => {
            if (!pinnedLocId) {
                setPinnedLoc(null);
                return;
            }

            const pinLoc = await getPinnedLocationObj(pinnedLocId);
            setPinnedLoc(pinLoc ?? null);
        };

        loadPinLoc();
    }, [pinnedLocId]);

    useEffect(() => {
        if (!pinnedLoc) return;

        if (fpsType !== 'first') onFocusLoc(pinnedLoc.location.latitude, pinnedLoc.location.longitude);
    }, [pinnedLoc, fpsType]);

    return (
        <View style={styles.cardNav}>
            {pinnedLoc ? (
                <View style={styles.pinnedLocation}>
                    <Pressable
                        onPress={() =>
                            navigateMapLocation(
                                pinnedLoc.location.latitude,
                                pinnedLoc.location.longitude
                            )
                        }
                    >
                        <Text style={{ fontWeight: "bold" }}>
                            {pinnedLoc.name} ({pinnedLoc.city}, {pinnedLoc.country})
                        </Text>

                        <Text>
                            ({pinnedLoc.location.latitude.toFixed(4)},{" "}
                            {pinnedLoc.location.longitude.toFixed(4)})
                        </Text>

                        <Text>Notes: {pinnedLoc.notes || "..."}</Text>
                    </Pressable>
                </View>
            ) : (
                <Text>No pinned location selected</Text>
            )}
        </View>
    );
}


const styles = StyleSheet.create({

    cardNav: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    pinnedLocation: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 6,
        borderTopWidth: 1,
    },

});
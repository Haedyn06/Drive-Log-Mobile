import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigateMapLocation } from '@/utils/locationAccess';
import { getPinnedLocationObj } from '@/services/pinnedLocationService';
import { deletePinnedLocationDB } from '@/database/methods/pinnedLocations';
import type { PinnedLocation } from '@/types/PinnedLocation';
import type { FPSType } from '@/composables/useFreeMap';

import ConfirmationPopup from '@/components/modals/ConfirmationPopup';

type PinnedLocCardBProps = {
    pinnedLocId: string | null;
    onFocusLoc: (lat: number, lon: number) => void;
    fpsType: FPSType;
    onDeleted?: () => void;
};

export default function PinnedLocCardB({ pinnedLocId, onFocusLoc, fpsType, onDeleted }: PinnedLocCardBProps) {
    const [pinnedLoc, setPinnedLoc] = useState<PinnedLocation | null>(null);
    const [isPopup, setIsPopup] = useState(false);

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

    const popupCancel = () => {
        setIsPopup(false);
    }

    const handleFocus = () => {
        if (!pinnedLoc) return;
        if (fpsType !== 'first') onFocusLoc(pinnedLoc.location.latitude, pinnedLoc.location.longitude)
    }

    const popupConirm = async () => {
        if (!pinnedLoc?.id) return;
        await deletePinnedLocationDB(pinnedLoc?.id);
        setPinnedLoc(null);
        setIsPopup(false);
        onDeleted?.();
    }


    return (
        <View style={styles.cardNav}>
            {pinnedLoc ? (
                <View style={styles.pinnedLocation}>
                    <Pressable style={styles.info} onPress={handleFocus}>
                        <Text style={styles.title} numberOfLines={1}>
                            {pinnedLoc.name || 'Waypoint'}
                        </Text>

                        <Text style={styles.subtitle} numberOfLines={1}>
                            {pinnedLoc.city}, {pinnedLoc.country}
                        </Text>

                        <Text style={styles.coords}>
                            {pinnedLoc.location.latitude.toFixed(4)},{" "}
                            {pinnedLoc.location.longitude.toFixed(4)}
                        </Text>

                        <Text style={styles.notes} numberOfLines={2}>
                            {`Note: ${pinnedLoc.notes}` || "No notes"}
                        </Text>
                    </Pressable>
                    <View style={{display:'flex', flexDirection:'column', gap:12}}>
                        <Pressable style={{alignSelf:'flex-end'}} onPress={() => setIsPopup(true)}>
                            <Ionicons name='bookmark' size={18} color={'black'} />
                        </Pressable>

                        <Pressable style={styles.navBtn} onPress={() => navigateMapLocation(pinnedLoc.location.latitude, pinnedLoc.location.longitude)}>
                            <Ionicons name="navigate-outline" size={22} color="#555" />
                        </Pressable>
                    </View>

                </View>
            ) : (
                <View style={styles.emptyCard}>
                    <Ionicons name="location-outline" size={22} color="#777" />
                    <Text style={styles.emptyText}>No pinned location selected</Text>
                </View>
            )}


            <ConfirmationPopup visible={isPopup} label={'unpin this location'} onConfirm={popupConirm} onCancel={popupCancel} />
        </View>
    );
}

const styles = StyleSheet.create({
    cardNav: {
        marginHorizontal: 12,
    },

    pinnedLocation: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        gap: 12,

        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },

    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
    },

    info: {
        flex: 1,
        gap: 2,
    },

    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },

    subtitle: {
        fontSize: 13,
        color: "#555",
    },

    coords: {
        fontSize: 12,
        color: "#888",
        marginTop: 2,
    },

    notes: {
        fontSize: 13,
        color: "#333",
        marginTop: 4,
    },

    emptyCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        borderRadius: 16,
        padding: 14,
        gap: 10,
    },

    emptyText: {
        color: "#777",
        fontSize: 14,
        fontWeight: "500",
    },

    navBtn: {
        borderWidth:1,
        padding: 5,
        borderRadius: 10,


    }
});
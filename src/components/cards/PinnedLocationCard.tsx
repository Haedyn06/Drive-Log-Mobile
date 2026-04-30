import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Linking, Platform  } from "react-native";
import type { PinnedLocation } from "@/types/PinnedLocation";
import { Ionicons } from "@expo/vector-icons";

import { deletePinnedLocationDB } from "@/database/methods";
import { getLocationName } from "@/utils/locationAccess";
import ConfirmationPopup from "@/components/modals/ConfirmationPopup";

type PinnedLocationCardProps = {
    pinnedLocation: PinnedLocation;
}



export default function PinnedLocationCard({pinnedLocation}: PinnedLocationCardProps) {
    const [confirmPopUp, setConfirmPopup] = useState(false);

    const handleCancel = () => setConfirmPopup(false);

    const handleConfirm = async () => {
        await deletePinnedLocationDB(pinnedLocation.id);
        setConfirmPopup(false);
    }

    const handleNavigate = async () => {
        const { latitude, longitude } = pinnedLocation.location;

        const url = Platform.select({
            ios: `http://maps.apple.com/?daddr=${latitude},${longitude}`,
            android: `google.navigation:q=${latitude},${longitude}`,
            default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
        });

        if (!url) return;

        await Linking.openURL(url);
    };


    return (
        <View style={styles.pinnedLocContainer}>
            {/* Heading */}
            <View style={styles.pinnedLocHeading}>
                <Text>{pinnedLocation.name}</Text>
                <Pressable onPress={() => setConfirmPopup(true)}>
                    <Ionicons name="trash" size={20} />
                </Pressable>
            </View>

            {/* Details */}
            <View style={styles.pinnedLocDetails}>
                {/* <Text>{getLocationName(pinnedLocation.location)}</Text> */}
                <Text>{pinnedLocation.location.latitude.toFixed(4)}, {pinnedLocation.location.longitude.toFixed(4)}</Text>
            </View>

            {/* Notes */}
            {pinnedLocation.notes && (
                <View style={styles.pinnedLocNotes}>
                    <Text>{pinnedLocation.notes}</Text>
                </View>
            )}


            <View>
                <Pressable style={styles.navBtn} onPress={handleNavigate}>
                    <Text style={{fontSize:14, textAlign:'center', fontWeight:'bold', color:'white'}}>Navigate</Text>
                </Pressable>
            </View>

            <ConfirmationPopup visible={confirmPopUp} label="Pinned Location" onCancel={handleCancel} onConfirm={handleConfirm} />
        </View>
    );
}


const styles = StyleSheet.create({
    pinnedLocContainer: {
        borderWidth: 2,
        padding: 12,
        borderRadius: 10


    },
    
    pinnedLocHeading: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'


    },

    pinnedLocDetails: {



    },


    pinnedLocNotes: {



    },

    navBtn: {
        padding:10,
        borderWidth:2,
        marginTop:15,
        borderRadius:8,
        backgroundColor:'black'



    }
});
import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { getPinnedLocationsDB } from "@/database/methods";

import type { PinnedLocation } from "@/types/PinnedLocation";

import PinnedLocationCard from "@/components/cards/PinnedLocationCard";
import PinLocationForm from "@/components/forms/PinLocationForm";

import { PinnedLocationStyles } from "@/styles/PinnedLocationsScreen";

export default function PinnedLocationsScreen() {
    const [pinnedLocs, setPinnedLocs] = useState<PinnedLocation[]>();
    const [pinLocForm, setPinLocForm] = useState(false);

    const loadPinnedLocs = async () => {
        const data = await getPinnedLocationsDB();
        setPinnedLocs(data);
    };

    useEffect(() => {
        loadPinnedLocs();
    }, []);

    return (
        <ScrollView style={PinnedLocationStyles.container} contentContainerStyle={PinnedLocationStyles.content}>
            <Pressable style={{borderWidth:2, backgroundColor:'black', borderRadius:12, padding: 10, marginBottom:12}} onPress={() => setPinLocForm(true)}>
                <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}} >Add New Location</Text>
            </Pressable>

            <View style={PinnedLocationStyles.locationList}>
                {pinnedLocs && pinnedLocs.map ((i, index) => (
                    <View key={i.id}>
                        <PinnedLocationCard  pinnedLocation={i}/>
                    </View>
                ))}    
            </View>

            <PinLocationForm visible={pinLocForm} onClose={() => setPinLocForm(false)} onSaved={loadPinnedLocs} />
        </ScrollView>
    );
}
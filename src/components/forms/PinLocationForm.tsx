import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import * as Location from "expo-location";
import { v4 as uuidv4 } from "uuid";

import { savePinnedLocationDB } from "@/database/methods";
import FieldLabel from "@/components/FieldLabel";
import type { Coords } from "@/types/CoordinateType";

type PinLocationFormProps = {
    visible: boolean;
    onClose: () => void;
    location?: Coords;
    onSaved?: () => void;
};

export default function PinLocationForm({
    visible,
    onClose,
    location,
    onSaved,
}: PinLocationFormProps) {
    const [locName, setLocName] = useState("");
    const [locAddress, setLocAddress] = useState("");
    const [locNotes, setLocNotes] = useState("");
    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setLocName("");
        setLocAddress("");
        setLocNotes("");
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            let finalLocation: Coords | null = location ?? null;

            // address -> coordinates
            if (locAddress.trim()) {
                const results = await Location.geocodeAsync(locAddress.trim());

                if (results.length === 0) {
                    Alert.alert("Address not found", "Try a more specific address.");
                    return;
                }

                finalLocation = {
                    latitude: results[0].latitude,
                    longitude: results[0].longitude,
                    altitude: 0,
                };
            }

            if (!finalLocation) {
                Alert.alert(
                    "No location",
                    "Enter an address or choose a location from the map."
                );
                return;
            }

            await savePinnedLocationDB(
                uuidv4(),
                locName.trim() || "Pinned Location",
                locNotes.trim(),
                finalLocation
            );

            resetForm();
            await onSaved?.();
            onClose();
        } catch (err) {
            console.log("Save pin error:", err);
            Alert.alert("Error", "Could not save pinned location.");
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.modalCard}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Pin Your Location</Text>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.formContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <FieldLabel title="Location Name" />
                        <TextInput
                            value={locName}
                            onChangeText={setLocName}
                            placeholder="Name"
                            placeholderTextColor="#9ca3af"
                            style={styles.modalInput}
                        />

                        <FieldLabel title={location ? "Address Optional" : "Address Required"} />
                        <TextInput
                            value={locAddress}
                            onChangeText={setLocAddress}
                            placeholder={
                                location
                                    ? "Enter address to override map pin"
                                    : "Enter address to get coordinates"
                            }
                            placeholderTextColor="#9ca3af"
                            style={styles.modalInput}
                        />

                        {location && (
                            <>
                                <FieldLabel title="Map Pin Coordinates" />
                                <Text style={styles.coordsText}>
                                    {location.latitude.toFixed(6)},{" "}
                                    {location.longitude.toFixed(6)}
                                </Text>
                            </>
                        )}

                        <FieldLabel title="Notes" />
                        <TextInput
                            value={locNotes}
                            onChangeText={setLocNotes}
                            placeholder="Notes"
                            placeholderTextColor="#9ca3af"
                            style={[styles.modalInput, styles.notesInput]}
                            multiline
                        />
                    </ScrollView>

                    <View style={styles.modalButtons}>
                        <Pressable style={styles.cancelBtn} onPress={handleClose}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            <Text style={styles.saveBtnText}>
                                {saving ? "Saving..." : "Save"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.28)",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 24,
    },

    modalCard: {
        backgroundColor: "#ffffff",
        borderRadius: 28,
        overflow: "hidden",
        maxHeight: "88%",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },

    header: {
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eef2f7",
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 4,
    },

    formContent: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 18,
    },

    modalInput: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#f9fafb",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 13,
        marginBottom: 14,
        color: "#111827",
        fontSize: 15,
    },

    notesInput: {
        minHeight: 90,
        textAlignVertical: "top",
    },

    coordsText: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#f9fafb",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 13,
        marginBottom: 14,
        color: "#374151",
        fontSize: 14,
    },

    modalButtons: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#eef2f7",
        backgroundColor: "#ffffff",
    },

    cancelBtn: {
        flex: 1,
        minHeight: 48,
        borderRadius: 16,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },

    cancelBtnText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#4b5563",
    },

    saveBtn: {
        flex: 1.2,
        minHeight: 48,
        borderRadius: 16,
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
    },

    saveBtnText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "800",
    },
});
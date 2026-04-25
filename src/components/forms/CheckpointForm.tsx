import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Modal, Image, ScrollView } from "react-native";
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

import { useSharedDriveSession } from "@/context/DriveSessionContext";
import { Ionicons } from "@expo/vector-icons";

type CheckpointType = | "checkpoint" | "break" | "gas" | "food" | "issue" | "scenery";

type CheckpointFormModalProps = {
    visible: boolean;
    onClose: () => void;
};

const checkpointTypes: CheckpointType[] = [ "checkpoint", "break", "gas", "food", "issue", "scenery" ];

export default function CheckpointFormModal({ visible, onClose }: CheckpointFormModalProps) {
    const [note, setNote] = useState("");
    const [selectedType, setSelectedType] = useState<CheckpointType>("checkpoint");
    const [photos, setPhotos] = useState<string[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    const {handleCheckpointSession, checkpointSession} = useSharedDriveSession();

    async function handleSave() {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        handleCheckpointSession(note, selectedType, photos);
        setNote("");
        setSelectedType("checkpoint");
        onClose();
    }

    function handleClose() {
        setNote("");
        setSelectedType("checkpoint");
        onClose();
    }

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        return status === 'granted';
    };


    const takePhoto = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.7,
        });

        if (!result.canceled) return result.assets[0].uri;
    };

    const handleTakePhoto = async () => {
        const uri = await takePhoto();
        if (!uri) return;

        setPhotos((prev) => [...prev, uri]);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>New Checkpoint</Text>

                    {/* Notes */}

                    <View style={styles.topRow}>

                        <TextInput
                            style={styles.input}
                            placeholder="Add a note..."
                            placeholderTextColor="#888"
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />

                        {/* Camera */}
                        <View style={{alignSelf: 'center'}}>
                            <Pressable style={{borderWidth: 1, padding: 4, borderRadius: 6, borderColor: '#a6a6a6'}} 
                                onPress={handleTakePhoto}>
                                <Ionicons name="camera-outline" size={25} color={'#7e7e7e'}/>
                            </Pressable>
                        </View>
                    </View>


                    {/* Type */}
                    <Text style={styles.label}>Type</Text>
                    <View style={styles.typeWrap}>
                        {checkpointTypes.map((type) => {
                            const isSelected = selectedType === type;

                            return (
                                <Pressable
                                    key={type}
                                    style={[
                                        styles.typeButton,
                                        isSelected && styles.typeButtonActive,
                                    ]}
                                    onPress={() => setSelectedType(type)}
                                >
                                    <Text
                                        style={[
                                            styles.typeText,
                                            isSelected && styles.typeTextActive,
                                        ]}
                                    >
                                        {type}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                    
                    {/* Photos */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
                        {photos.map((uri, index) => (
                            <View key={index} style={{ marginRight: 8 }}>
                                {/* Image (click = preview) */}
                                <Pressable onPress={() => setPreviewImage(uri)}>
                                    <Image source={{ uri }} style={styles.photoImg} />
                                </Pressable>

                                {/* X button */}
                                <Pressable onPress={() => setPhotos((prev) => prev.filter((_, i) => i !== index))} style={styles.photoRemoveBtn}>
                                    <Ionicons name="close" size={14} color="white" />
                                </Pressable>
                            </View>
                        ))}
                    </ScrollView>


                    {/* Saves */}
                    <View style={styles.actions}>
                        <Pressable
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={handleClose}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.actionButton, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveText}>Save</Text>
                        </Pressable>
                    </View>


                    
                </View>

                {/* Photo Preview */}
                <Modal visible={!!previewImage} transparent animationType="fade">
                    <Pressable onPress={() => setPreviewImage(null)}
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: previewImage! }} style={{ width: '90%', height: '70%', borderRadius: 12 }} resizeMode="contain" />
                    </Pressable>
                </Modal>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: 20,
    },
    modalBox: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 18,
        gap: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#222",
    },

    topRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },

    input: {
        minHeight: 45,
        width: '87%',
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: "#fff",
        textAlignVertical: "top",
        color: "#111",
    },
    typeWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    typeButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: "#f1f1f1",
    },
    typeButtonActive: {
        backgroundColor: "#111",
    },
    typeText: {
        color: "#111",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    typeTextActive: {
        color: "#fff",
    },

    photoScroll: { 
        marginTop: 5, 
        padding: 5, 
        paddingTop: 10 
    },

    photoRemoveBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 10,
        padding: 2,
    },

    photoImg: {
        width: 60, 
        height: 60, 
        borderRadius: 8
    },

    actions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 6,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#f1f1f1",
    },
    saveButton: {
        backgroundColor: "#111",
    },
    cancelText: {
        color: "#111",
        fontWeight: "700",
    },
    saveText: {
        color: "#fff",
        fontWeight: "700",
    },
});
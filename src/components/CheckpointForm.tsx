import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Modal, } from "react-native";

import { useSharedDriveSession } from "../context/DriveSessionContext";

type CheckpointType =
    | "checkpoint"
    | "stop"
    | "gas"
    | "food"
    | "issue"
    | "scenery";

type CheckpointFormModalProps = {
    visible: boolean;
    onClose: () => void;
};

const checkpointTypes: CheckpointType[] = [
    "checkpoint",
    "stop",
    "gas",
    "food",
    "issue",
    "scenery",
];

export default function CheckpointFormModal({
    visible,
    onClose
}: CheckpointFormModalProps) {
    const [note, setNote] = useState("");
    const [selectedType, setSelectedType] = useState<CheckpointType>("checkpoint");

    const {newCheckpoint, checkpoints} = useSharedDriveSession();

    function handleSave() {
        newCheckpoint(note, selectedType);
        setNote("");
        setSelectedType("checkpoint");
        onClose();
    }

    function handleClose() {
        setNote("");
        setSelectedType("checkpoint");
        onClose();
    }

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

                    <TextInput
                        style={styles.input}
                        placeholder="Add a note..."
                        placeholderTextColor="#888"
                        value={note}
                        onChangeText={setNote}
                        multiline
                    />

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
    input: {
        minHeight: 100,
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
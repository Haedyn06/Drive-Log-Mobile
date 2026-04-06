import React from "react";
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
} from "react-native";

type SaveSessionModalProps = {
    visible: boolean;
    sessionTitle: string;
    setSessionTitle: React.Dispatch<React.SetStateAction<string>>;

    startLocationLabel: string;
    setStartLocationLabel: React.Dispatch<React.SetStateAction<string>>;

    endLocationLabel: string;
    setEndLocationLabel: React.Dispatch<React.SetStateAction<string>>;

    carType: string;
    setCarType: React.Dispatch<React.SetStateAction<string>>;

    notes: string;
    setNotes: React.Dispatch<React.SetStateAction<string>>;

    onClose: () => void;
    onSave: () => void;
};

function FieldLabel({
    title,
    optional = false,
}: {
    title: string;
    optional?: boolean;
}) {
    return (
        <View style={styles.labelRow}>
            <Text style={styles.label}>{title}</Text>
            {optional && <Text style={styles.optionalText}>Optional</Text>}
        </View>
    );
}

export default function SaveSessionModal({
    visible,
    sessionTitle,
    setSessionTitle,
    startLocationLabel,
    setStartLocationLabel,
    endLocationLabel,
    setEndLocationLabel,
    carType,
    setCarType,
    notes,
    setNotes,
    onClose,
    onSave,
}: SaveSessionModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.modalCard}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.eyebrow}>Session Details</Text>
                            <Text style={styles.modalTitle}>Save Drive Session</Text>
                            <Text style={styles.modalSubtitle}>
                                Add a title, location info, car, and any notes you want to keep.
                            </Text>
                        </View>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.formContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <FieldLabel title="Session Title" />
                        <TextInput
                            value={sessionTitle}
                            onChangeText={setSessionTitle}
                            placeholder="Night Drive"
                            placeholderTextColor="#9ca3af"
                            style={styles.modalInput}
                        />

                        <FieldLabel title="Start Location" optional />
                        <TextInput
                            value={startLocationLabel}
                            onChangeText={setStartLocationLabel}
                            placeholder="Downtown Calgary"
                            placeholderTextColor="#9ca3af"
                            style={styles.modalInput}
                        />

                        <FieldLabel title="End Location" optional />
                        <TextInput
                            value={endLocationLabel}
                            onChangeText={setEndLocationLabel}
                            placeholder="Banff Ave"
                            placeholderTextColor="#9ca3af"
                            style={styles.modalInput}
                        />

                        <FieldLabel title="Car Type" optional />
                        <TextInput
                            value={carType}
                            onChangeText={setCarType}
                            placeholder="Mitsubishi Lancer"
                            placeholderTextColor="#9ca3af"
                            style={styles.modalInput}
                        />

                        <FieldLabel title="Notes" optional />
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Road was icy, stopped for gas, nice sunset..."
                            placeholderTextColor="#9ca3af"
                            style={[styles.modalInput, styles.notesInput]}
                            multiline
                            textAlignVertical="top"
                        />
                    </ScrollView>

                    <View style={styles.modalButtons}>
                        <Pressable style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </Pressable>

                        <Pressable style={styles.saveBtn} onPress={onSave}>
                            <Text style={styles.saveBtnText}>Save Session</Text>
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

    eyebrow: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 6,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 4,
        letterSpacing: -0.3,
    },

    modalSubtitle: {
        fontSize: 13,
        lineHeight: 19,
        color: "#6b7280",
    },

    formContent: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 18,
    },

    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 7,
        marginTop: 2,
    },

    label: {
        fontSize: 13,
        fontWeight: "700",
        color: "#374151",
    },

    optionalText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: 0.6,
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
        minHeight: 96,
        maxHeight: 140,
        paddingTop: 13,
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
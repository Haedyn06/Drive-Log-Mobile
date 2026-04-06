import { Modal, View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";

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

    onClose: () => void;
    onSave: () => void;
};

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
    onClose,
    onSave
}: SaveSessionModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalTitle}>Save Drive Session</Text>

                        <Text style={styles.label}>Session Title</Text>
                        <TextInput
                            value={sessionTitle}
                            onChangeText={setSessionTitle}
                            placeholder="Night Drive"
                            style={styles.modalInput}
                        />

                        <Text style={styles.label}>Start Location Name / Address (Optional)</Text>
                        <TextInput
                            value={startLocationLabel}
                            onChangeText={setStartLocationLabel}
                            placeholder="Downtown Calgary"
                            style={styles.modalInput}
                        />

                        <Text style={styles.label}>End Location Name / Address (Optional)</Text>
                        <TextInput
                            value={endLocationLabel}
                            onChangeText={setEndLocationLabel}
                            placeholder="Banff Ave"
                            style={styles.modalInput}
                        />

                        <Text style={styles.label}>Car Type (Optional)</Text>
                        <TextInput
                            value={carType}
                            onChangeText={setCarType}
                            placeholder="Mitsubishi Lancer"
                            style={styles.modalInput}
                        />

                        <View style={styles.modalButtons}>
                            <Pressable style={styles.cancelBtn} onPress={onClose}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </Pressable>

                            <Pressable style={styles.saveBtn} onPress={onSave}>
                                <Text style={styles.saveBtnText}>Save</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    modalCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        maxHeight: '80%',
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 14,
    },

    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#444',
        marginBottom: 6,
        marginTop: 2,
    },

    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 14,
        color: 'black',
    },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 4,
    },

    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
    },

    cancelBtnText: {
        fontSize: 15,
        color: '#666',
    },

    saveBtn: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
    },

    saveBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});
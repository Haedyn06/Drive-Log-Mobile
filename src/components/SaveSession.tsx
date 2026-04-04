import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";

type SaveSessionModalProps = {
    visible: boolean;
    sessionTitle: string;
    setSessionTitle: React.Dispatch<React.SetStateAction<string>>;
    onClose: () => void;
    onSave: () => void;
};

export default function SaveSessionModal({ visible,sessionTitle,setSessionTitle,onClose,onSave }: SaveSessionModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Set Session Title</Text>

                    <TextInput value={sessionTitle} onChangeText={setSessionTitle} placeholder="Night Drive" style={styles.modalInput} />

                    <View style={styles.modalButtons}>
                        <Pressable style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </Pressable>

                        <Pressable style={styles.saveBtn} onPress={onSave}>
                            <Text style={styles.saveBtnText}>Save</Text>
                        </Pressable>
                    </View>
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
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 14,
    },

    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
        color: 'black'
    },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
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
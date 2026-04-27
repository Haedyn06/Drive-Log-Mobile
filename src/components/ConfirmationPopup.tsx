import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';

type ConfirmationPopupProps = {
    visible: boolean;
    label: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmationPopup({ visible, label, onConfirm, onCancel }: ConfirmationPopupProps) {
    const handleOnCancel = () => {
        onCancel();
    }
    
    const handleOnConfirm = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onConfirm();
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.popup}>
                    <Text style={styles.text}>
                        Are you sure you want to {label}?
                    </Text>

                    <View style={styles.actions}>
                        <Pressable style={styles.cancelBtn} onPress={handleOnCancel}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>

                        <Pressable style={styles.confirmBtn} onPress={handleOnConfirm}>
                            <Text style={styles.confirmText}>Confirm</Text>
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
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    popup: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cancelBtn: {
        padding: 12,
    },
    cancelText: {
        color: "#666",
        fontSize: 16,
    },
    confirmBtn: {
        backgroundColor: "#ff3b30",
        padding: 12,
        borderRadius: 10,
    },
    confirmText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
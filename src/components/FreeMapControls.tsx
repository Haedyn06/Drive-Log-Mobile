import { Pressable, View, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { FPSType } from "@/composables/useFreeMap";

type FreeMapControlsProps = {
    style?: ViewStyle;
    handlePerspective: () => void;
    fpsType: FPSType;
}

export default function FreeMapControls({style, handlePerspective, fpsType}: FreeMapControlsProps) {


    return (
        <View style={style}>

            <View style={styles.btnCtrls}>
                <Pressable style={styles.fpsBtn} onPress={handlePerspective} >
                    {fpsType === "first" ? 
                        <Ionicons name='navigate' size={30} color='white' /> : <Ionicons name='navigate-outline' size={30} color='white' />
                    }
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    btnCtrls: {
        position: 'absolute',
        right: 0,
        flex: 1, 
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center'
    },

    fpsBtn: {
        width: 70,
        height: 70,
        borderRadius: 60,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        elevation: 999,
    },

    locBtn: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        elevation: 999,
    }
})
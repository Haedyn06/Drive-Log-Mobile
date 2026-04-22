import {View, Text, StyleSheet} from 'react-native';

export default function FieldLabel({ title, optional = false }: { title: string; optional?: boolean; }) {
    return (
        <View style={styles.labelRow}>
            <Text style={styles.label}>{title}</Text>
            {optional && <Text style={styles.optionalText}>Optional</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    
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
});
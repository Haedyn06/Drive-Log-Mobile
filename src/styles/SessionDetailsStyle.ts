import { StyleSheet } from 'react-native';

export const SessionDetailsStyles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        padding: 16,
        gap: 16,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
    },

    card: {
        backgroundColor: '#f4f4f4',
        borderRadius: 14,
        padding: 16,
        gap: 6,
    },

    label: {
        marginTop: 8,
        fontWeight: '700',
    },

    mapWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
    },

    map: {
        width: '100%',
        height: 300,
    },
});
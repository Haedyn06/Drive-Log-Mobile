import { StyleSheet } from 'react-native';

export const SessionLogsStyles = StyleSheet.create({
    container: {
        flex: 1,
    },

    filterBar: {
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        gap: 12
    },

    filterBtn: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 16

    },

    screen: {
        flex: 1,
        backgroundColor: '#f5f5f7',
    },

    content: {
        paddingTop: 18,
        paddingBottom: 36,
    },

    header: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },

    eyebrow: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },

    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },

    listSection: {
        marginTop: 8,
        margin: 15
    },
});
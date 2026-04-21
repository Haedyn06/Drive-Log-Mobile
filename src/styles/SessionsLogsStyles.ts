import { StyleSheet } from 'react-native';

export const SessionLogsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f7',
    },

    filterBar: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 6,
        flexDirection: 'row',
        gap: 10,
    },

    filterBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: '#e5e7eb',
    },

    activeFilterBtn: {
        backgroundColor: '#111827',
    },

    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
    },

    activeFilterText: {
        color: '#fff',
    },

    screen: {
        flex: 1,
    },

    content: {
        paddingTop: 18,
        paddingBottom: 36,
    },

    header: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },

    listSection: {
        marginTop: 8,
        margin: 15,
    },
});
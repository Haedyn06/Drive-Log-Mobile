import { StyleSheet } from 'react-native';

export const NewSessionStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f3eef1',
    },

    content: {
        paddingTop: 28,
        paddingBottom: 32,
    },

    pageTitle: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        color: '#111',
        marginBottom: 18,
    },

    sectionGap: {
        marginTop: 2,
    },

    timeCard: {
        marginHorizontal: 18,
        marginBottom: 18,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 4,
    },

    cardLabel: {
        fontSize: 14,
        color: '#222',
        marginBottom: 10,
    },

    timeValue: {
        fontSize: 34,
        fontWeight: '400',
        textAlign: 'center',
        color: '#111',
    },

    statsRow: {
        flexDirection: 'row',
        gap: 18,
        marginHorizontal: 18,
        marginBottom: 18,
    },

    statCard: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 18,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 4,
    },

    statLabel: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        color: '#111',
        marginBottom: 10,
    },

    statValue: {
        fontSize: 26,
        fontWeight: '400',
        textAlign: 'center',
        color: '#111',
    },

    mapCard: {
        marginHorizontal: 18,
        borderRadius: 18,
        backgroundColor: '#dcd6db',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 4,
        padding: 12,
    },

    mapWrapperOverride: {
        marginHorizontal: 0,
        marginTop: 0,
        borderWidth: 0,
        padding: 0,
        backgroundColor: 'transparent',
    },
});
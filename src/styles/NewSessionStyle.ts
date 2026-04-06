import { StyleSheet } from 'react-native';

export const NewSessionStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f8f6f7',
    },

    content: {
        paddingTop: 22,
        paddingBottom: 36,
    },

    pageTitle: {
        fontSize: 26,
        fontWeight: '800',
        textAlign: 'center',
        color: '#111111',
        marginBottom: 20,
        letterSpacing: 0.2,
    },

    sectionGap: {
        marginTop: 4,
    },

    timeCard: {
        marginHorizontal: 18,
        marginBottom: 16,
        paddingHorizontal: 18,
        paddingVertical: 18,
        borderRadius: 24,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ece7ea',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 4,
    },

    cardLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#7a6f75',
        marginBottom: 10,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },

    timeValue: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
        color: '#151515',
        letterSpacing: 1,
    },

    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 18,
        marginBottom: 16,
    },

    statCard: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 22,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ece7ea',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 110,
    },

    statLabel: {
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
        color: '#7a6f75',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },

    statValue: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        color: '#111111',
    },

    mapCard: {
        marginHorizontal: 18,
        borderRadius: 26,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ece7ea',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 4,
        padding: 12,
        overflow: 'hidden',
    },

    mapWrapperOverride: {
        marginHorizontal: 0,
        marginTop: 0,
        borderWidth: 0,
        padding: 0,
        backgroundColor: 'transparent',
        borderRadius: 20,
        overflow: 'hidden',
    },
});
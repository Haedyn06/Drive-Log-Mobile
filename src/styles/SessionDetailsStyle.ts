import { StyleSheet } from 'react-native';

export const SessionDetailsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4eff2',
    },

    content: {
        padding: 18,
        paddingBottom: 32,
        gap: 16,
    },

    headerCard: {
        backgroundColor: '#ddd8dc',
        borderRadius: 22,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 5,
        elevation: 4,
    },

    pageLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
        fontWeight: '600',
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#111',
        marginBottom: 14,
    },

    headerMetaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    headerMetaChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#f4f1f3',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
    },

    headerMetaText: {
        fontSize: 13,
        color: '#444',
        fontWeight: '600',
    },

    statsRow: {
        flexDirection: 'row',
        gap: 10,
    },

    statCard: {
        flex: 1,
        minWidth: 0,
        backgroundColor: '#ddd8dc',
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 3,
    },

    statLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#444',
        marginBottom: 8,
        textAlign: 'center',
    },

    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111',
        textAlign: 'center',
    },

    detailsCard: {
        backgroundColor: '#ddd8dc',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111',
        marginBottom: 14,
    },

    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 14,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#c9c2c7',
    },

    detailLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },

    detailValue: {
        flex: 1.4,
        fontSize: 14,
        color: '#111',
        textAlign: 'right',
    },

    locationBlock: {
        backgroundColor: '#f3eef1',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
    },

    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },

    locationTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
    },

    locationText: {
        fontSize: 14,
        color: '#444',
    },

    mapCard: {
        backgroundColor: '#ddd8dc',
        borderRadius: 20,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 3,
    },

    mapWrapperOverride: {
        marginHorizontal: 0,
        marginTop: 0,
        borderWidth: 0,
        padding: 0,
        backgroundColor: 'transparent',
    },
});
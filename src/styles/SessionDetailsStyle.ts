import { StyleSheet } from 'react-native';

export const SessionDetailsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7fb',
    },

    content: {
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 34,
        gap: 14,
        backgroundColor: '#f6f7fb',
    },

    headerCard: {
        backgroundColor: '#ffffff',
        borderRadius: 28,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e8ebf0',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 4,
    },

    pageLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 8,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 16,
        letterSpacing: -0.5,
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
        backgroundColor: '#f8fafc',
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    headerMetaText: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '600',
    },

    statsRow: {
        flexDirection: 'row',
        gap: 10,
    },

    statCard: {
        flex: 1,
        minWidth: 0,
        backgroundColor: '#ffffff',
        borderRadius: 22,
        paddingVertical: 18,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e8ebf0',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },

    statLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6b7280',
        marginBottom: 8,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        letterSpacing: -0.3,
    },

    detailsCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: '#e8ebf0',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 14,
        letterSpacing: -0.2,
    },

    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eef1f4',
    },

    detailLabel: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700',
        color: '#6b7280',
    },

    detailValue: {
        flex: 1.5,
        fontSize: 14,
        color: '#111827',
        textAlign: 'right',
        lineHeight: 20,
        fontWeight: '500',
    },

    locationBlock: {
        backgroundColor: '#f8fafc',
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e7ebf0',
    },

    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },

    locationTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },

    locationText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },

    mapCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 14,
        borderWidth: 1,
        borderColor: '#e8ebf0',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 3,
    },

    mapWrapperOverride: {
        marginHorizontal: 0,
        marginTop: 0,
        borderWidth: 0,
        padding: 0,
        backgroundColor: 'transparent',
        borderRadius: 18,
        overflow: 'hidden',
    },
});
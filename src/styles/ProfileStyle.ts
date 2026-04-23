import { StyleSheet } from 'react-native';

export const ProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        marginBottom: 24,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
    },

    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },

    statsContainer: {
        display: 'flex',
        
        gap: 16,
    },

    statsRow1: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
    },


    statsRow2: {

    },

    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: '#ffffff',
    },

    cardLabel: {
        fontSize: 14,
        marginBottom: 8,
        textAlign: 'center'
    },

    cardValue: {
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center'
    },

    carAddBtn: {
        // fontSize: 16,
        borderWidth: 2,
        paddingVertical: 15,
        marginTop: 30,
        borderRadius: 16,
        backgroundColor: 'black'
    },

    optBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20
    },

    optBtn: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 1,
        width: 110,
        height: 110,
        borderRadius: 12,
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,

    }
});
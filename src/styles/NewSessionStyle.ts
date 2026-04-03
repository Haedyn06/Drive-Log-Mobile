import { StyleSheet } from 'react-native';

export const NewSessionStyles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },

    sessionBtn: {
        width: 150,
        height: 150,
        borderRadius: 150,
        backgroundColor: 'black',

        justifyContent: 'center',
        alignItems: 'center',


        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,

        // Android shadow
        elevation: 6,
    },

    logs: {
        flex: 1,
        flexDirection: 'column',
        gap: 20
    },

    startLog: {
        marginTop: 20
    },

    liveLog: {


    },

    endLog: {


    },

    mapWrapper: {
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },

    map: {
        width: '100%',
        height: 220,
    },



    endSessionBtn: {
        marginTop: 20,
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },

    endSessionBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

});
import { StyleSheet } from 'react-native';

export const NewSessionStyles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },

    sessionControls: {
        // height: 200,
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderRadius: 12,

    },

    sessionManage: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30

    },

    sessionBtn: {
        borderRadius: 150,

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


    liveStats: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
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





    endSessionBtn: {
        marginTop: 20,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,

    },

    endSessionBtnText: {
        fontSize: 16,
        fontWeight: '600',
    },

    map: {
        width: '100%',
        height: 320,
    },

});
import { Text, View, FlatList, Pressable, ScrollView } from 'react-native';

import { useSharedDriveSession } from '../context/DriveSessionContext';


import { HomeStyles } from '../styles/HomeStyle';

import StartSessionComp from '../components/StartSessionComp';
import DriveSessionList from '../components/DriveSessionList';
import SaveSessionModal from '../components/SaveSession';

export default function HomeScreen() {


    const { 
        isStart, locStart, 
        elapsed, speedKmh, distanceMeters, route,
        locEnd,

        titleModalVisible, sessionTitle,
        setTitleModalVisible, setSessionTitle,

        handleSession, handleEndSession, handleSaveSession, resetSession
    } = useSharedDriveSession();

    return (
        <ScrollView style={HomeStyles.container}>
            <StartSessionComp isStart={isStart} elapsed={elapsed} speedKmh={speedKmh} distanceMeters={distanceMeters} handleSession={handleSession} handleEndSession={handleEndSession} resetSession={resetSession} />
            
            <View style={HomeStyles.recentList}>
                <Text style={HomeStyles.recentTitle}>Your Recents</Text>

                <DriveSessionList limit={3} />
            </View>
            

        </ScrollView>
    );
}
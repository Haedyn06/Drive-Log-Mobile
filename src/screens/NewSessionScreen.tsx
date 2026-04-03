import { Text, View, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { NewSessionStyles } from '../styles/NewSessionStyle';
import { Ionicons } from '@expo/vector-icons';
import { useDriveSession } from '../composables/useDriveSession';
import { formatTime } from '../utils/format';

import SaveSessionModal from '../components/SaveSession';
import DriveSessionMap from '../components/DriveSessionMap';


export default function NewSessionScreen() {
    const { 
        isStart, locStart, timeStampStart, 
        elapsed, speedKmh, distanceMeters, route,
        locEnd,

        titleModalVisible, sessionTitle,
        setTitleModalVisible, setSessionTitle,

        handleSession, handleEndSession, handleSaveSession, resetSession
    } = useDriveSession();

    return (
        <ScrollView >
            <View>
                <View style={NewSessionStyles.sessionControls}>
                    <View style={NewSessionStyles.sessionManage}>
                        <Pressable style={NewSessionStyles.sessionBtn} onPress={handleSession}>
                            {isStart ? (<Ionicons name="stop-circle-outline" size={100} color="#767676" />) 
                                : (<Ionicons name="caret-forward-circle-outline" size={100} color="#767676" />)}
                        </Pressable>

                        <View>
                            <Text style={{fontSize: 30}}>{formatTime(elapsed)}</Text>

                            <View style={NewSessionStyles.liveStats}>
                                <Text >Speed: {speedKmh.toFixed(1)} km/h</Text>
                                <Text>Distance: {distanceMeters.toFixed(0)} m</Text>
                            </View>
                        </View>
                    </View>


                    {(isStart || elapsed > 0) && (
                        <View>

                            <Pressable style={NewSessionStyles.endSessionBtn} onPress={handleEndSession}>
                                <Text style={NewSessionStyles.endSessionBtnText}>End Session</Text>
                            </Pressable>


                            <Pressable style={NewSessionStyles.endSessionBtn} onPress={resetSession}>
                                <Text style={NewSessionStyles.endSessionBtnText}>Reset</Text>
                            </Pressable>

                        </View>

                    )}

                </View>
                {/* New Session */}


                {/* Map */}
                <DriveSessionMap title="Live Route" isStart={isStart} showUserLocation locStart={locStart} locEnd={locEnd} route={route} />                
                
                

                <SaveSessionModal visible={titleModalVisible} sessionTitle={sessionTitle} setSessionTitle={setSessionTitle}
                    onClose={() => setTitleModalVisible(false)} onSave={handleSaveSession} />
            </View>
        </ScrollView>
    );
}
import { Text, View, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { NewSessionStyles } from '../styles/NewSessionStyle';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useDriveSession } from '../composables/useDriveSession';
import { formatDateTime, formatTime } from '../utils/format';

import SaveSessionModal from '../components/SaveSession';

export default function NewSessionScreen() {
    const { 
        isStart, locStart, timeStampStart, 
        elapsed, speedKmh, distanceMeters, route,
        locEnd, timeStampEnd,

        titleModalVisible, sessionTitle,
        setTitleModalVisible, setSessionTitle,

        handleSession, handleEndSession, handleSaveSession
    } = useDriveSession();

    return (
        <ScrollView >
            <View>

                {/* New Session */}
                <Pressable style={NewSessionStyles.sessionBtn} onPress={handleSession}>
                    {isStart ? (<Ionicons name="stop-circle-outline" size={120} color="#ffffff" />) 
                        : (<Ionicons name="caret-forward-circle-outline" size={120} color="#ffffff" />)}
                </Pressable>

                {/* Logs */}
                <View style={NewSessionStyles.logs}>
                    <View style={NewSessionStyles.startLog}>
                        <Text style={{ fontWeight: 'bold' }}>Start Logs</Text>
                        <Text>Start Location:{' '} {locStart ? `${locStart.latitude}, ${locStart.longitude}` : '--'}</Text>
                        <Text>{formatDateTime(timeStampStart)}</Text>
                    </View>

                    <View style={NewSessionStyles.liveLog}>
                        <Text style={{ fontWeight: 'bold' }}>Live Logs</Text>
                        <Text>Time: {formatTime(elapsed)}</Text>
                        <Text>Speed: {speedKmh.toFixed(1)} km/h</Text>
                        <Text>Distance: {distanceMeters.toFixed(0)} m</Text>
                        <Text>Distance: {(distanceMeters / 1000).toFixed(2)} km</Text>
                    </View>

                    <View style={NewSessionStyles.endLog}>
                        <Text style={{ fontWeight: 'bold' }}>End Logs</Text>
                        <Text>End Location:{' '}{locEnd ? `${locEnd.latitude}, ${locEnd.longitude}` : '--'}</Text>
                        <Text>{formatDateTime(timeStampEnd)}</Text>
                    </View>
                </View>

                {/* Map */}
                <View style={NewSessionStyles.mapWrapper}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Live Route</Text>
                    
                    <MapView key={route.length === 0 ? 'empty-map' : 'active-map'} style={NewSessionStyles.map} showsUserLocation 
                        followsUserLocation={isStart}
                        initialRegion={{
                            latitude: locStart?.latitude ?? 51.0447, longitude: locStart?.longitude ?? -114.0719,
                            latitudeDelta: 0.01, longitudeDelta: 0.01,
                    }}>
                        {locStart && (<Marker coordinate={locStart} title="Start" pinColor="green" />)}
                        {locEnd && (<Marker coordinate={locEnd} title="End" pinColor="red" />)}
                        {route.length > 1 && (<Polyline coordinates={route} strokeColor="#000" strokeWidth={4} />)}
                    </MapView>
                </View>

                <Pressable style={NewSessionStyles.endSessionBtn} onPress={handleEndSession}>
                    <Text style={NewSessionStyles.endSessionBtnText}>End Session</Text>
                </Pressable>

                <SaveSessionModal visible={titleModalVisible} sessionTitle={sessionTitle} setSessionTitle={setSessionTitle}
                    onClose={() => setTitleModalVisible(false)} onSave={handleSaveSession} />
            </View>
        </ScrollView>
    );
}
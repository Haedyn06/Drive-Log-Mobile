import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { SessionDetailsStyles } from '../styles/SessionDetailsStyle';
import type { RootStackParamList } from '../navigation/AppNavigator';

type SessionDetailsRouteProp = RouteProp<RootStackParamList, 'SessionDetails'>;

import { formatDateTime, formatDuration } from '../utils/format';


export default function SessionDetailsScreen() {
    const route = useRoute<SessionDetailsRouteProp>();
    const { session } = route.params;

    const initialLat = session.route[0]?.latitude ?? session.startLocation?.latitude ?? 51.0447;
    const initialLng = session.route[0]?.longitude ?? session.startLocation?.longitude ?? -114.0719;

    return (
        <SafeAreaView style={SessionDetailsStyles.container}>
            <ScrollView contentContainerStyle={SessionDetailsStyles.content}>
                <Text style={SessionDetailsStyles.title}>{session.title}</Text>

                <View style={SessionDetailsStyles.card}>
                    <Text style={SessionDetailsStyles.label}>Date</Text>
                    <Text>{new Date(session.date).toLocaleString()}</Text>

                    <Text style={SessionDetailsStyles.label}>Start Time</Text>
                    <Text>{formatDateTime(session.startTime)}</Text>

                    <Text style={SessionDetailsStyles.label}>End Time</Text>
                    <Text>{formatDateTime(session.endTime)}</Text>

                    <Text style={SessionDetailsStyles.label}>Duration</Text>
                    <Text>{formatDuration(session.durationMs)}</Text>

                    <Text style={SessionDetailsStyles.label}>Distance</Text>
                    <Text>{session.distanceMeters.toFixed(0)} m</Text>
                    <Text>{(session.distanceMeters / 1000).toFixed(2)} km</Text>

                    <Text style={SessionDetailsStyles.label}>Average Speed</Text>
                    <Text>{session.averageSpeedKmh.toFixed(1)} km/h</Text>

                    <Text style={SessionDetailsStyles.label}>Start Location</Text>
                    <Text>{session.startLocation ? `${session.startLocation.latitude}, ${session.startLocation.longitude}` : '--'}</Text>
                    
                    <Text style={SessionDetailsStyles.label}>End Location</Text>
                    <Text>{session.endLocation ? `${session.endLocation.latitude}, ${session.endLocation.longitude}` : '--'}</Text>

                    <Text style={SessionDetailsStyles.label}>Route Points</Text>
                    <Text>{session.route.length}</Text>
                </View>

                <View style={SessionDetailsStyles.mapWrapper}>
                    <MapView style={SessionDetailsStyles.map}
                        initialRegion={{ latitude: initialLat, longitude: initialLng, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                    >
                        { session.startLocation && (<Marker coordinate={session.startLocation} title="Start" pinColor="green" />) }
                        { session.endLocation && (<Marker coordinate={session.endLocation} title="End" pinColor="red" />) }
                        { session.route.length > 1 && (<Polyline coordinates={session.route} strokeColor="#000" strokeWidth={4} />) }
                    </MapView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
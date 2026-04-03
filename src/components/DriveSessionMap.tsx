import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import type { Coord } from '../types/Coord';

type DriveSessionMapProps = {
    title?: string;
    isStart?: boolean;
    showUserLocation?: boolean;
    locStart: Coord | null;
    locEnd: Coord | null;
    route: Coord[];
};

export default function DriveSessionMap({ title = 'Route', isStart = false, showUserLocation = false, locStart, locEnd, route }: DriveSessionMapProps) {
  const [fullScreen, setFullScreen] = useState(false);

  const initialLat = route[0]?.latitude ?? locStart?.latitude ?? 51.0447;
  const initialLng = route[0]?.longitude ?? locStart?.longitude ?? -114.0719;

    return (
        <>
            <Pressable onPress={() => setFullScreen(true)}>
                <View style={styles.mapWrapper}>
                    <Text style={styles.mapTitle}>{title}</Text>

                    <View pointerEvents="none">
                        <MapView key={route.length === 0 ? 'empty-map' : 'active-map'} style={styles.map} 
                            showsUserLocation={showUserLocation} followsUserLocation={isStart}
                            initialRegion={{
                                latitude: initialLat, longitude: initialLng,
                                latitudeDelta: 0.01, longitudeDelta: 0.01,
                            }}
                        >
                            {locStart && (<Marker coordinate={locStart} title="Start" pinColor="green" />)}

                            {locEnd && (<Marker coordinate={locEnd} title="End" pinColor="red" />)}

                            {route.length > 1 && (<Polyline coordinates={route} strokeColor="#000" strokeWidth={4} />)}
                        </MapView>
                    </View>
                </View>
            </Pressable>

            <Modal visible={fullScreen} animationType="slide" onRequestClose={() => setFullScreen(false)}>
                <View style={styles.fullScreenContainer}>
                    <MapView style={styles.fullScreenMap} showsUserLocation={showUserLocation} followsUserLocation={isStart}
                        initialRegion={{ latitude: initialLat, longitude: initialLng, latitudeDelta: 0.01,longitudeDelta: 0.01 }}
                    >
                        {locStart && (<Marker coordinate={locStart} title="Start" pinColor="green" />)}

                        {locEnd && (<Marker coordinate={locEnd} title="End" pinColor="red" />)}

                        {route.length > 1 && (<Polyline coordinates={route} strokeColor="#000" strokeWidth={4} />)}
                    </MapView>

                    <Pressable style={styles.closeBtn} onPress={() => setFullScreen(false)}>
                        <Text style={styles.closeBtnText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    mapWrapper: {
        padding: 20,
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        margin: 10,
    },

    mapTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 20,
    },

    map: {
        width: '100%',
        height: 350,
    },

    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    fullScreenMap: {
        flex: 1,
    },

    closeBtn: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        elevation: 3,
    },

    closeBtnText: {
        fontWeight: 'bold',
    },
});
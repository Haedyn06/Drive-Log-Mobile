import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


import { formatDriveTime, formatDistance, formatElevation } from '@/utils/format';
import { getTotalDistanceDB, getTotalDriveTimeDB, getTotalElevationGainDB } from '@/database/methods/driveSessions';


import FreeMiniMap from '@/components/maps/FreeMapMini';
import FreeFullMap from '@/components/maps/FreeMapFull';

import { ProfileStyles } from '@/styles/ProfileStyle';

import type { RootStackParamList } from '@/navigation/AppNavigator';

export default function ProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [totalDistance, setTotalDistance] = useState(0);
    const [totalDriveTime, setTotalDriveTime] = useState(0);
    const [totalElevation, setTotalElevation] = useState(0);

    const [fullMap, setFullMap] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const distance = await getTotalDistanceDB();
                const time = await getTotalDriveTimeDB();
                const elevation = await getTotalElevationGainDB();

                setTotalDistance(distance);
                setTotalDriveTime(time);
                setTotalElevation(elevation);
            } catch (error) {
                console.error('Failed to load profile stats:', error);
            }
        };

        loadStats();
    }, []);

    const goToSaves = () => navigation.navigate('SavedSessions');
    const goToVehicles = () => navigation.navigate('SavedVehicles');
    const goToLocations = () => navigation.navigate('SavedLocations');
    const goToSettings = () => navigation.navigate('SettingsSection');

    return (
        <ScrollView
            style={ProfileStyles.container}
            contentContainerStyle={[ProfileStyles.content, {paddingBottom: 50}]}
        >
            <View>
                <View style={ProfileStyles.header}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Driving stats</Text>
                </View>

                <View style={ProfileStyles.statsContainer}>
                    <View style={ProfileStyles.statsRow1}>
                        <View style={ProfileStyles.card}>
                            <Text style={ProfileStyles.cardLabel}>Total Distance Driven</Text>
                            <Text style={ProfileStyles.cardValue}>
                                {formatDistance(totalDistance)}
                            </Text>
                        </View>

                        <View style={ProfileStyles.card}>
                            <Text style={ProfileStyles.cardLabel}>Total Time On Road</Text>
                            <Text style={ProfileStyles.cardValue}>
                                {formatDriveTime(totalDriveTime)}
                            </Text>
                        </View>
                    </View>

                    <View style={ProfileStyles.statsRow2}>
                        <View style={ProfileStyles.card}>
                            <Text style={ProfileStyles.cardLabel}>Total Elevation Gain</Text>
                            <Text style={ProfileStyles.cardValue}>
                                {formatElevation(totalElevation)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <Pressable onPress={() => setFullMap(true)} style={{marginTop: 20}}>
                <FreeMiniMap />
            </Pressable>

            <View style={ProfileStyles.optBtnContainer}>
                <Pressable style={ProfileStyles.optBtn} onPress={goToSaves}>
                    <Text style={{fontSize: 20, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold'}}>Saves</Text>
                </Pressable>
                <Pressable style={ProfileStyles.optBtn} onPress={goToVehicles}>
                    <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>Vehicles</Text>
                </Pressable>
                <Pressable style={ProfileStyles.optBtn} onPress={goToLocations}>
                    <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>Locations</Text>
                </Pressable>
            </View>

            <Pressable style={ProfileStyles.settingsBtn} onPress={goToSettings}>
                <Text style={{fontSize:16, fontWeight:'bold'}}>Settings</Text>
            </Pressable>

            <FreeFullMap visible={fullMap} onClose={() => setFullMap(false)} />
        </ScrollView>
    );
}
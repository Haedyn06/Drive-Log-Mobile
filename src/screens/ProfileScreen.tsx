import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


import { formatDriveTime, formatDistance, formatElevation } from '@/utils/format';

import { dbTest, copyDbForDebug, importData } from '@/services/sessiondbService';
import { getTotalDistance, getTotalDriveTime, getTotalElevationGain } from '@/database/methods';


import FreeMiniMap from '@/components/maps/FreeMapMini';
import FreeFullMap from '@/components/maps/FreeMapFull';

import { ProfileStyles } from '@/styles/ProfileStyle';

import type { RootStackParamList } from '@/navigation/AppNavigator';
import { Coords } from '@/types/CoordinateType';

export default function ProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [totalDistance, setTotalDistance] = useState(0);
    const [totalDriveTime, setTotalDriveTime] = useState(0);
    const [totalElevation, setTotalElevation] = useState(0);

    const [fullMap, setFullMap] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const distance = await getTotalDistance();
                const time = await getTotalDriveTime();
                const elevation = await getTotalElevationGain();

                setTotalDistance(distance);
                setTotalDriveTime(time);
                setTotalElevation(elevation);
            } catch (error) {
                console.error('Failed to load profile stats:', error);
            }
        };

        loadStats();
    }, []);

    const handleDBTest = async () => await dbTest();

    const goToSaves = () => navigation.navigate('SavedSessions');
    const goToVehicles = () => navigation.navigate('SavedVehicles');
    const goToLocations = () => navigation.navigate('SavedLocations');

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

            <Pressable onPress={() => setFullMap(true)} style={{marginTop: 40}}>
                <FreeMiniMap />
            </Pressable>


            <FreeFullMap visible={fullMap} onClose={() => setFullMap(false)} />


            {/* Test Buttons */}
{/*             <View>
                <Pressable style={ProfileStyles.carAddBtn} onPress={handleDBTest}>
                    <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}} >DB Test</Text>
                </Pressable>

                <Pressable style={ProfileStyles.carAddBtn} onPress={copyDbForDebug}>
                    <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}} >Get DB</Text>
                </Pressable>

                <Pressable style={ProfileStyles.carAddBtn} onPress={importData}>
                    <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}} >Import To DB</Text>
                </Pressable>
            </View> */}


        </ScrollView>
    );
}
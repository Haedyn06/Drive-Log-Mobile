import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { getTotalDistance, getTotalDriveTime, getTotalElevationGain, exportSessions, importSessions, deleteSession } from '@/services/driveSessionService';

import { formatDriveTime, formatDistance, formatElevation } from '@/utils/format';


import { ProfileStyles } from '@/styles/ProfileStyle';

import type { RootStackParamList } from '@/navigation/AppNavigator';

export default function ProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [totalDistance, setTotalDistance] = useState(0);
    const [totalDriveTime, setTotalDriveTime] = useState(0);
    const [totalElevation, setTotalElevation] = useState(0);
    
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



    const handleExportSessions = async () => {
        await exportSessions();
    }

    const handleImportSessions = async () => await importSessions();

    const handleDelete = async () => await deleteSession('1776822446249');

    const goToSaves = () => navigation.navigate('SavedSessions');
    const goToVehicles = () => navigation.navigate('SavedVehicles');

    return (
        <ScrollView
            style={ProfileStyles.container}
            contentContainerStyle={ProfileStyles.content}
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
                <Pressable style={ProfileStyles.optBtn}>
                    <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>S</Text>
                </Pressable>
            </View>


            {/* <View>
                <Pressable style={ProfileStyles.carAddBtn} onPress={handleExportSessions}>
                    <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}} >Export Session Data</Text>
                </Pressable>

                <Pressable style={ProfileStyles.carAddBtn} onPress={handleImportSessions}>
                    <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}}>Import Session Data</Text>
                </Pressable>

                <Pressable style={ProfileStyles.carAddBtn} onPress={handleDelete}>
                    <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}}>Delete</Text>
                </Pressable>
            </View> */}


        </ScrollView>
    );
}
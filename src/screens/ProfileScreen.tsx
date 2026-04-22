import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

import { getTotalDistance, getTotalDriveTime, getTotalElevationGain } from '@/services/localStoreService';
import { getCars } from '@/services/carService';

import { useCarInfo } from '@/composables/useCarInfo';

import { formatDriveTime, formatDistance, formatElevation } from '@/utils/format';
import CarAddForm from '@/components/forms/CarAddForm';
import CarInfoCard from '@/components/cards/CarInfoCard';
import SavedSessions from '@/components/sessionLists/SavedSessions';

import { HomeStyles } from '@/styles/HomeStyle';
import { ProfileStyles } from '@/styles/ProfileStyle';

export default function ProfileScreen() {
    const { 
        carAddVis, car, cars,
        setCarAddVis, setCar, setCars, 
        deleteCar, saveCar 
    } = useCarInfo();

    const [totalDistance, setTotalDistance] = useState(0);
    const [totalDriveTime, setTotalDriveTime] = useState(0);
    const [totalElevation, setTotalElevation] = useState(0);
    
    useEffect(() => {
        const loadCars = async () => {
            const data = await getCars();
            setCars(data);
        };

        loadCars();
    }, []);

    
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

    const onClose = () => {
        setCarAddVis(false);
    };

    const handleAddCar = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCarAddVis(true);
    }

    return (
        <ScrollView
            style={ProfileStyles.container}
            contentContainerStyle={ProfileStyles.content}
        >
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

            
            <View style={{ marginTop: 20 }}>
                <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 5}}>Vehicles</Text>

                {cars.length === 0 ? (
                    <Text>No cars saved</Text>
                ) : (
                    cars.map((car) => (
                        <CarInfoCard
                            key={car.id}
                            carYear={car.year}
                            carBrand={car.brand}
                            carModel={car.model}
                            carColor={car.color}
                            carLicense={car.license}
                            onDelete={() => deleteCar(car.id)}
                        />
                    ))
                )}
            </View>


            {/* New Vehicle */}
            <View>
                <Pressable style={ProfileStyles.carAddBtn} onPress={handleAddCar}>
                    <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}}>Add New Vehicle</Text>
                </Pressable>
            </View>

            <CarAddForm visible={carAddVis} onClose={onClose} onSave={saveCar} />

            <View style={HomeStyles.recentList}>
                <View style={HomeStyles.recentHeading}>
                    <Text style={HomeStyles.recentTitle}>Saved</Text>
                </View>

                <SavedSessions limit={5} />
            </View>
            
        </ScrollView>
    );
}
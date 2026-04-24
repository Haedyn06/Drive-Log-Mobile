import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

import { getCars } from '@/services/carService';

import { useVehicleObj } from '@/composables/useVehicleObj';

import CarInfoCard from '@/components/cards/VehicleCard';
import CarAddForm from '@/components/forms/CarAddForm';

import { SessionLogsStyles } from '@/styles/SessionsLogsStyles';
import { ProfileStyles } from '@/styles/ProfileStyle';

export default function ManageVehiclesScreen() {
    const { 
        carAddVis, car, cars,
        setCarAddVis, setCar, setCars, 
        deleteCar, saveCar 
    } = useVehicleObj();

    useEffect(() => {
        const loadCars = async () => {
            const data = await getCars();
            setCars(data);
        };

        loadCars();
    }, []);

    const onClose = () => {
        setCarAddVis(false);
    };

    const handleAddCar = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCarAddVis(true);
    }

    return (
        <View style={SessionLogsStyles.container}>
            <ScrollView
                style={SessionLogsStyles.screen}
                contentContainerStyle={SessionLogsStyles.content}
                showsVerticalScrollIndicator={false}
            >
            <View style={SessionLogsStyles.header}>
                <Text style={SessionLogsStyles.title}>Vehicles</Text>
            </View>

            <View style={{padding: 20}}>
                <View>
                    <Pressable style={ProfileStyles.carAddBtn} onPress={handleAddCar}>
                        <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}}>Add New Vehicle</Text>
                    </Pressable>
                </View>

                <View style={{ marginTop: 20 }}>
                    {cars.length === 0 ? (
                        <Text>No cars saved</Text>
                    ) : (
                        cars.map((car) => (
                        <CarInfoCard
                            key={car.id}
                            vehicle={car}
                            onDelete={() => deleteCar(car.id)}
                        />
                        ))
                    )}
                </View>
            </View>

            </ScrollView>

            <CarAddForm visible={carAddVis} onClose={onClose} onSave={saveCar} />
        </View>
    );
}
import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';

import {
    getTotalDistance,
    getTotalDriveTime,
    getTotalElevationGain,
} from '../services/localStoreService';
import { ProfileStyles } from '../styles/ProfileStyle';

import CarAddForm from '../components/CarAddForm';
import CarInfoCard from '../components/CarInfoCard';

import { CarInfo } from '../types/CarInfo';

import { saveCarInfo, getCars } from '../services/carService';


export default function ProfileScreen() {
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalDriveTime, setTotalDriveTime] = useState(0);
    const [totalElevation, setTotalElevation] = useState(0);

    const [carAddVis, setCarAddVis] = useState(false);
    const [car, setCar] = useState<CarInfo | null>(null);
    const [cars, setCars] = useState<CarInfo[]>([]);
    
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

    const onSave = async (carData: Omit<CarInfo, 'id'>) => {
        try {
            const existing = await getCars();

            const newCar: CarInfo = {
                id: Date.now().toString(),
                ...carData,
            };

            const updatedCars = [...existing, newCar];

            await saveCarInfo(updatedCars);
            setCars(updatedCars);
            setCar(newCar);
            setCarAddVis(false);

            console.log('Saved car:', newCar);
        } catch (e) {
            console.log('Save failed:', e);
        }
    };

    const handleDeleteCar = async (id: string) => {
        try {
            const existing = await getCars();

            const updated = existing.filter(car => car.id !== id);

            await saveCarInfo(updated);
            setCars(updated);

            console.log('Deleted car:', id);
        } catch (e) {
            console.log('Delete failed:', e);
        }
    };

    const formatDistance = (meters: number) => {
        return `${(meters / 1000).toFixed(2)} km`;
    };

    const formatDriveTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return `${hours}h ${minutes}m`;
    };

    const formatElevation = (meters: number) => {
        return `${meters.toFixed(0)} m`;
    };

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
                            onDelete={() => handleDeleteCar(car.id)}
                        />
                    ))
                )}
            </View>


            <View>
                <Pressable style={ProfileStyles.carAddBtn} onPress={() => setCarAddVis(true)}>
                    <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}}>Add New Vehicle</Text>
                </Pressable>
            </View>

            <CarAddForm visible={carAddVis} onClose={onClose} onSave={onSave} />
        </ScrollView>
    );
}
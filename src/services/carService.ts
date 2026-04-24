import AsyncStorage from '@react-native-async-storage/async-storage';

import type { VehicleObj } from '@/types/vehicleObj/VehicleType';

const carStorage = 'cars';

export const saveCarInfo = async (cars: VehicleObj[]) => {
    try {
        await AsyncStorage.setItem(carStorage, JSON.stringify(cars));
    } catch (e) {
        console.log('Error saving cars', e);
    }
};

export const getCars = async (limit?: number): Promise<VehicleObj[]> => {
    try {
        const data = await AsyncStorage.getItem(carStorage);
        const cars: VehicleObj[] = data ? JSON.parse(data) : [];

        return limit ? cars.slice(0, limit) : cars;
    } catch (e) {
        console.log('Error getting cars', e);
        return [];
    }
};
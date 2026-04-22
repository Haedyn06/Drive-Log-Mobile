import AsyncStorage from '@react-native-async-storage/async-storage';

import { CarInfo } from '@/types/CarInfo';

const carStorage = 'cars';

export const saveCarInfo = async (cars: CarInfo[]) => {
    try {
        await AsyncStorage.setItem(carStorage, JSON.stringify(cars));
    } catch (e) {
        console.log('Error saving cars', e);
    }
};

export const getCars = async (limit?: number): Promise<CarInfo[]> => {
    try {
        const data = await AsyncStorage.getItem(carStorage);
        const cars: CarInfo[] = data ? JSON.parse(data) : [];

        return limit ? cars.slice(0, limit) : cars;
    } catch (e) {
        console.log('Error getting cars', e);
        return [];
    }
};
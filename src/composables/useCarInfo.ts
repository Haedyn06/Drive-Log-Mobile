import { useEffect, useState } from 'react';

import { saveCarInfo, getCars } from '@/services/carService';

import type { CarInfo } from '@/types/CarInfo';

export function useCarInfo() {

    const [carAddVis, setCarAddVis] = useState(false);
    const [car, setCar] = useState<CarInfo | null>(null);
    const [cars, setCars] = useState<CarInfo[]>([]);

    const saveCar = async (carData: Omit<CarInfo, 'id'>) => {
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

    const deleteCar = async (id: string) => {
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

    return {
        carAddVis, car, cars,
        setCarAddVis, setCar, setCars,
        deleteCar, saveCar
    }

}


import { useEffect, useState } from 'react';

import { saveVehicleDB, deleteVehicleDB } from '@/database/methods/vehicle';
import { getAllVehicles } from '@/services/vehicleService';
import type { VehicleObj } from '@/types/vehicleObj/VehicleType';

export function useVehicleObj() {
    const [carAddVis, setCarAddVis] = useState(false);
    const [car, setCar] = useState<VehicleObj | null>(null);
    const [cars, setCars] = useState<VehicleObj[]>([]);

    const loadCars = async () => {
        try {
            const vehicles = await getAllVehicles();
            setCars(vehicles);
        } catch (err) {
            console.log('Load cars failed:', err);
        }
    };

    useEffect(() => {
        loadCars();
    }, []);

    const saveCar = async (carData: Omit<VehicleObj, 'id'>) => {
        try {
            const newCar = await saveVehicleDB(carData.year, carData.brand, carData.model, carData.color, carData.license ?? '');

            setCars((prev) => [...prev, newCar]);
            setCar(newCar);
            setCarAddVis(false);

            console.log('Saved car:', newCar);
        } catch (err) {
            console.log('Save failed:', err);
        }
    };

    const deleteCar = async (id: string) => {
        try {
            await deleteVehicleDB(id);

            setCars((prev) => prev.filter((car) => car.id !== id));

            setCar((prev) => {
                if (prev?.id === id) return null;
                return prev;
            });

            console.log('Deleted car:', id);
        } catch (err) {
            console.log('Delete failed:', err);
        }
    };

    return {
        carAddVis, car, cars,
        setCarAddVis, setCar, setCars,
        loadCars, deleteCar, saveCar,
    };
}
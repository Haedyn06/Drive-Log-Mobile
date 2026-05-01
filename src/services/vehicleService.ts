import { getVehicleDB, getVehiclesDB } from "@/database/methods/vehicle";
import type { VehicleObj } from "@/types/vehicleObj/VehicleType";

export const getVehicleObj = async (vehicleId: string) => {
    const vehicles = await getVehicleDB(vehicleId);
    if (!vehicles) return;
    const vehicle = vehicles[0];

    const vehicleObj: VehicleObj = {
        id: vehicle.id,
        year: vehicle.year,
        brand: vehicle.brand,
        model: vehicle.model,
        color: vehicle.color,
        license: vehicle.license ?? '',
    };

    return vehicleObj;
}

export const getVehicles = async (vehicleIds: string[]): Promise<VehicleObj[]> => {
    const vehicleList: VehicleObj[] = [];

    for (const vehicleId of vehicleIds) {
        const pinnedLoc = await getVehicleObj(vehicleId);
        if (pinnedLoc) vehicleList.push(pinnedLoc);
    }

    return vehicleList;
}

export const getAllVehicles = async (): Promise<VehicleObj[]> => {
    const vehicles = await getVehiclesDB();
    if (!vehicles) return [];
    return getVehicles(vehicles);
}
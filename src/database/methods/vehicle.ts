import { db } from "@/database/db";
import { v4 as uuidv4 } from 'uuid';

import type { VehicleObj } from "@/types/vehicleObj/VehicleType";

export const getVehicleDB = async (vehicleId: string): Promise<any[]> => 
    await db.getAllAsync(`SELECT * FROM vehicle WHERE id = ? LIMIT 1`, [vehicleId]);

export const getVehiclesDB = async (): Promise<string[]> => {
    const rows = await db.getAllAsync<{ id: string }>(`SELECT id FROM vehicle ORDER BY year DESC;`);
    return rows.map(r => r.id);
};


export const saveVehicleDB = async (year: string, brand: string, model: string, color: string, license: string = ''): Promise<VehicleObj> => {
    const newCar: VehicleObj = {id: uuidv4(), year, brand, model, color, license};
    await db.runAsync(`INSERT INTO vehicle (id, year, brand, model, color, license) VALUES (?, ?, ?, ?, ?, ?)`,
        [newCar.id, year, brand, model, color, license || null]
    );

    return newCar;
};


export const deleteVehicleDB = async (id: string): Promise<void> => {
    await db.runAsync(`DELETE FROM vehicle WHERE id = ?`,[id]);
};
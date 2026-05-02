import { db } from "@/database/db";
import { v4 as uuidv4 } from 'uuid';

import type { PinnedLocation } from "@/types/PinnedLocation";
import { getLocationParts } from "@/utils/locationAccess";
import type { Coords } from "@/types/CoordinateType";

export const savePinnedLocationDB = async (id: string, name: string, note: string, location: Coords) => {
    try {

        const loc = await getLocationParts(location);
        
        const addr = `${loc?.name}, ${loc?.street}` || '';
        const country = loc?.country || '';
        const city = loc?.city || '';
        
        const dateSaved = Date.now();
        console.log('Saving Addr2');
        console.log(`Address: ${addr}`);        
        console.log(`Country: ${country}`);        
        console.log(`City: ${city}`);        

        await db.runAsync(`
            INSERT INTO pinned_locations (
                id, name, note,
                address, country, city, 
                latitude, longitude, altitude, 
                timestamp
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
            [
                id, name, note, 
                addr, country, city,
                location.latitude, location.longitude, location.altitude ?? 0, 
                dateSaved
            ]
        );
        console.log('Saving Addr Success');
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const getPinnedLocationDB = async (id: string): Promise<any> => 
    await db.getFirstAsync<any>(`SELECT * FROM pinned_locations WHERE id = ?`, [id]);

export const getPinnedLocationsDB = async (): Promise<string[]> =>  {
    const rows = await db.getAllAsync<{ id: string }>(`SELECT id FROM pinned_locations ORDER BY timestamp DESC;`);
    return rows.map(r => r.id);
};


export const checkPinnedLocation = async (id: string): Promise<boolean> => {
    const row = await db.getFirstAsync(`SELECT 1 FROM pinned_locations WHERE id = ? LIMIT 1`, [id]);
    return row !== null && row !== undefined;
};


export const deletePinnedLocationDB = async (id: string): Promise<void> => {
    try {
        await db.runAsync(`DELETE FROM pinned_locations WHERE id = ?`, [id]);
    } catch (err) {
        throw err;
    }
};



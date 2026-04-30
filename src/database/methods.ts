import { db } from "./db";
import { v4 as uuidv4 } from 'uuid';

import { getLocationParts } from "@/utils/locationAccess";

import type { DriveSession } from "@/types/dbObj/driveSessionType";
import type { SessionCheckpoint } from "@/types/dbObj/checkPointType";
import type { SessionRoutePoint } from "@/types/dbObj/routePointType";
import type { SessionStopPoint } from "@/types/dbObj/stopPointType";
import type { SessionTopSpeed, SessionTopAltitude } from "@/types/dbObj/topMetrics";
import type { VehicleObj } from "@/types/vehicleObj/VehicleType";
import type { PinnedLocation } from "@/types/PinnedLocation";

// Save Session
export const saveDriveSession = async (session: DriveSession) => {
    try {
        await db.runAsync(`
            INSERT INTO drive_session (
                id, title, date, notes,
                elapsed_time, timestamp_start, timestamp_end,
                latitude_start, longitude_start, altitude_start, start_location_name,
                latitude_end, longitude_end, altitude_end, end_location_name,
                average_speed, altitude_gained, distance,
                vehicle_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                session.id, session.title, session.date, session.notes ?? null,
                session.elapsedTime, session.timestampStart, session.timestampEnd,
                session.locationStart.latitude, session.locationStart.longitude, session.locationStart.altitude ?? null, session.startLocationName,
                session.locationEnd.latitude, session.locationEnd.longitude, session.locationEnd.altitude ?? null, session.endLocationName,
                session.averageSpeed, session.altitudeGained, session.distance,
                session.vehicleId ?? null
            ]
        );

        return session.id;
    } catch (err) {
        console.log("Insert error:", err);
        throw err;
    }
};


// Save Checkpoints
export const saveCheckpoints = async (sessionId: string, checkpoints: SessionCheckpoint[]) => {
    for (const checkpoint of checkpoints) {
        await db.runAsync(`
            INSERT INTO checkpoints (
                id, session_id,
                type, notes, distance,
                latitude, longitude, altitude, 
                timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                checkpoint.id, sessionId,
                checkpoint.type ?? "checkpoint", checkpoint.notes ?? null, checkpoint.distance ?? 0,
                checkpoint.location.latitude, checkpoint.location.longitude, checkpoint.location.altitude ?? null,
                checkpoint.timestamp,
            ]
        );

        if (checkpoint.images?.length) {
            for (const img of checkpoint.images) {
                await db.runAsync(`
                    INSERT INTO checkpoint_images (id, checkpoint_id, uri) VALUES (?, ?, ?)`,
                    [ uuidv4(), checkpoint.id, img ]
                );
            }
        }
    }
};


// Save Routepoints
export const saveRoute = async (sessionId: string, routepoints: SessionRoutePoint[]) => {
    for (let i = 0; i < routepoints.length; i++) {
        const point = routepoints[i];

        await db.runAsync(`
            INSERT INTO routepoints (
                session_id, point_index,
                latitude, longitude, altitude,
                timestamp
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                sessionId, i,
                point.location.latitude, point.location.longitude, point.location.altitude ?? null,
                point.timestamp,
            ]
        );
    }
};


// Save Stoppoints
export const saveStopPoints = async (sessionId: string, stopPoints: SessionStopPoint[]) => {
    for (let i = 0; i < stopPoints.length; i++) {
        const stop = stopPoints[i];

        await db.runAsync(`
            INSERT INTO stoppoints (
                session_id, point_index,
                latitude, longitude, altitude,
                duration, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                sessionId, i,
                stop.location.latitude, stop.location.longitude, stop.location.altitude ?? null,
                stop.duration, stop.timestamp,
            ]
        );
    }
};


// Save Top Speed
export const saveTopSpeed = async (sessionId: string, topSpeed: SessionTopSpeed) => {
    await db.runAsync(`
        INSERT INTO top_speeds (
            session_id, speed,
            latitude, longitude, altitude,
            timestamp
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            sessionId, topSpeed.speed,
            topSpeed.location.latitude, topSpeed.location.longitude, topSpeed.location.altitude ?? null,
            topSpeed.timestamp,
        ]
    );
};


// Save Top Altitude
export const saveTopAltitude = async (sessionId: string, topAltitude: SessionTopAltitude) => {
    await db.runAsync(`
        INSERT OR REPLACE INTO top_altitudes (
            session_id,
            latitude, longitude, altitude,
            timestamp
        ) VALUES (?, ?, ?, ?, ?)`,
        [
            sessionId,
            topAltitude.location.latitude, topAltitude.location.longitude, topAltitude.location.altitude ?? null,
            topAltitude.timestamp,
        ]
    );
};


// Save Session
export const addSessionDB = async (
    session: DriveSession,
    checkpoints: SessionCheckpoint[],
    routepoints: SessionRoutePoint[],
    stoppoints: SessionStopPoint[],
    topSpeed?: SessionTopSpeed | null,
    topAltitude?: SessionTopAltitude | null
) => {
    const sessionId = await saveDriveSession(session);

    await saveCheckpoints(sessionId, checkpoints);
    await saveRoute(sessionId, routepoints);
    await saveStopPoints(sessionId, stoppoints);

    if (topSpeed) await saveTopSpeed(sessionId, topSpeed);
    if (topAltitude) await saveTopAltitude(sessionId, topAltitude);
};




// Add A Vehicle
export const getVehicles = async (): Promise<VehicleObj[]> => {
const rows = await db.getAllAsync<VehicleObj>(
`SELECT * FROM vehicle ORDER BY year DESC;`
);

return rows;
};


export const saveVehicle = async (
year: string,
brand: string,
model: string,
color: string,
license: string = ''
): Promise<VehicleObj> => {
const newCar: VehicleObj = {
id: uuidv4(),
year,
brand,
model,
color,
license,
};

await db.runAsync(
`INSERT INTO vehicle (id, year, brand, model, color, license)
    VALUES (?, ?, ?, ?, ?, ?)`,
[newCar.id, year, brand, model, color, license || null]
);

return newCar;
};

export const deleteVehicle = async (id: string): Promise<void> => {
await db.runAsync(
`DELETE FROM vehicle WHERE id = ?`,
[id]
);
};
// Get List Of Session
export type SessionSortType = "newest" | "oldest" | "time" | "furthest";

export const getDriveSessions = async (
limit?: number,
sortType: SessionSortType = "newest"
): Promise<DriveSession[]> => {
const orderBy =
sortType === "oldest"
? "date ASC"
: sortType === "time"
? "elapsed_time DESC"
: sortType === "furthest"
? "distance DESC"
: "date DESC";

const sql = `
SELECT * FROM drive_session
ORDER BY ${orderBy}
${limit ? "LIMIT ?" : ""};
`;

const rows = limit
? await db.getAllAsync<any>(sql, [limit])
: await db.getAllAsync<any>(sql);

return rows.map((row) => ({
id: row.id,
title: row.title,
date: row.date,
notes: row.notes ?? undefined,

elapsedTime: row.elapsed_time,
timestampStart: row.timestamp_start,
timestampEnd: row.timestamp_end,

startLocationName: row.start_location_name ?? "",
locationStart: {
latitude: row.latitude_start,
longitude: row.longitude_start,
altitude: row.altitude_start ?? undefined,
},

endLocationName: row.end_location_name ?? "",
locationEnd: {
latitude: row.latitude_end,
longitude: row.longitude_end,
altitude: row.altitude_end ?? undefined,
},

averageSpeed: row.average_speed,
altitudeGained: row.altitude_gained,
distance: row.distance,

vehicleId: row.vehicle_id ?? undefined,
}));
};


// Get A Session
export const deleteDriveSession = async (id: string): Promise<void> => {
await db.runAsync(
`DELETE FROM drive_session WHERE id = ?`,
[id]
);
};



import { DriveSessionObj } from "@/types/sessionObj/DriveSessionType";
import { Coords } from "@/types/CoordinateType";

export const getFullSession = async (sessionId: string): Promise<DriveSessionObj | null> => {
// 1. base session
const sessionRows = await db.getAllAsync<any>(
`SELECT * FROM drive_session WHERE id = ? LIMIT 1`,
[sessionId]
);

if (sessionRows.length === 0) return null;
const s = sessionRows[0];

// 2. routepoints
const routeRows = await db.getAllAsync<any>(
`SELECT * FROM routepoints WHERE session_id = ? ORDER BY point_index ASC`,
[sessionId]
);

const mappedRoute: SessionRoutePoint[] = routeRows.map((r) => ({
location: {
latitude: r.latitude,
longitude: r.longitude,
altitude: r.altitude ?? undefined,
},
timestamp: r.timestamp,
}));

// 3. stops
const stopRows = await db.getAllAsync<any>(
`SELECT * FROM stoppoints WHERE session_id = ? ORDER BY point_index ASC`,
[sessionId]
);

const stops: SessionStopPoint[] = stopRows.map((r) => ({
location: {
latitude: r.latitude,
longitude: r.longitude,
altitude: r.altitude ?? undefined,
},
timestamp: r.timestamp,
duration: r.duration,
}));

// 4. checkpoints
const checkpointRows = await db.getAllAsync<any>(
`SELECT * FROM checkpoints WHERE session_id = ?`,
[sessionId]
);

const checkpoints: SessionCheckpoint[] = [];

for (const c of checkpointRows) {
const imgRows = await db.getAllAsync<any>(
`SELECT uri FROM checkpoint_images WHERE checkpoint_id = ?`,
[c.id]
);

checkpoints.push({
id: c.id,
type: c.type,
notes: c.notes ?? undefined,
distance: c.distance,
location: {
latitude: c.latitude,
longitude: c.longitude,
altitude: c.altitude ?? undefined,
},
timestamp: c.timestamp,
images: imgRows.map((i) => i.uri),
});
}

// 5. top speed
const speedRow = await db.getAllAsync<any>(
`SELECT * FROM top_speeds WHERE session_id = ? LIMIT 1`,
[sessionId]
);

// 6. top altitude
const altitudeRow = await db.getAllAsync<any>(
`SELECT * FROM top_altitudes WHERE session_id = ? LIMIT 1`,
[sessionId]
);

// 7. vehicle
let vehicle: VehicleObj | undefined;

if (s.vehicle_id) {
const v = await db.getAllAsync<any>(
`SELECT * FROM vehicle WHERE id = ? LIMIT 1`,
[s.vehicle_id]
);

if (v.length > 0) {
vehicle = {
id: v[0].id,
year: v[0].year,
brand: v[0].brand,
model: v[0].model,
color: v[0].color,
license: v[0].license ?? undefined,
};
}
}

// 8. final object
return {
id: s.id,
title: s.title,
date: s.date,
notes: s.notes ?? undefined,

mappedRoute,
checkpoints,
stops,

timestamps: {
elapsedTime: s.elapsed_time,
timestampStart: s.timestamp_start,
timestampEnd: s.timestamp_end,
},

locations: {
startLocation: {
name: s.start_location_name ?? "",
coords: {
latitude: s.latitude_start,
longitude: s.longitude_start,
altitude: s.altitude_start ?? undefined,
},
},
endLocation: {
name: s.end_location_name ?? "",
coords: {
latitude: s.latitude_end,
longitude: s.longitude_end,
altitude: s.altitude_end ?? undefined,
},
},
},

metrics: {
distance: s.distance,
altitude: {
altitudeGained: s.altitude_gained,
topAltitude: altitudeRow[0]
  ? {
      altitude: altitudeRow[0].altitude,
      location: {
        latitude: altitudeRow[0].latitude,
        longitude: altitudeRow[0].longitude,
      },
      timestamp: altitudeRow[0].timestamp,
    }
: undefined,
},
speed: {
avgSpeed: s.average_speed,
topSpeed: speedRow[0]
  ? {
      speed: speedRow[0].speed,
      location: {
        latitude: speedRow[0].latitude,
        longitude: speedRow[0].longitude,
        altitude: speedRow[0].altitude ?? undefined,
      },
      timestamp: speedRow[0].timestamp,
    }
: undefined,
},
},

vehicle,
};
};



export const getLatestSessionId = async (): Promise<string | null> => {
const rows = await db.getAllAsync<any>(
`SELECT id FROM drive_session
ORDER BY date DESC
LIMIT 1;`
);

return rows.length > 0 ? rows[0].id : null;
};




export const editSessionTitle = async (
sessionId: string,
newTitle: string
): Promise<void> => {
try {
await db.runAsync(
`UPDATE drive_session
SET title = ?
WHERE id = ?`,
[newTitle, sessionId]
);
} catch (err) {
console.log("Edit title error:", err);
throw err;
}
};


export const editSessionNotes = async (
sessionId: string,
newNotes?: string
): Promise<void> => {
try {
await db.runAsync(
`UPDATE drive_session
SET notes = ?
WHERE id = ?`,
[newNotes?.trim() || null, sessionId]
);
} catch (err) {
console.log("Edit notes error:", err);
throw err;
}
};

export const getTotalDistance = async (): Promise<number> => {
const rows = await db.getAllAsync<{ total: number }>(
`SELECT SUM(distance) as total FROM drive_session;`
);

return rows[0]?.total ?? 0;
};


export const getTotalDriveTime = async (): Promise<number> => {
const rows = await db.getAllAsync<{ total: number }>(
`SELECT SUM(elapsed_time) as total FROM drive_session;`
);

return rows[0]?.total ?? 0;
};

export const getTotalElevationGain = async (): Promise<number> => {
const rows = await db.getAllAsync<{ total: number }>(
`SELECT SUM(altitude_gained) as total FROM drive_session;`
);

return rows[0]?.total ?? 0;
};


export const deleteCheckpoint = async (checkpointId: string): Promise<void> => {
try {
await db.runAsync(
`DELETE FROM checkpoints WHERE id = ?`,
[checkpointId]
);
} catch (err) {
console.log("Delete checkpoint error:", err);
throw err;
}
};


export const saveSessionDB = async (sessionId: string) => {
    try {
        const dateSaved = Date.now();
        await db.runAsync(`INSERT INTO session_saves (session_id, timestamp) VALUES (?, ?);`, [sessionId, dateSaved]);
    } catch (err) {
        throw err;
    }
}


export const checkSessionSavedDB = async (sessionId: string): Promise<boolean> => {
    try {
        const result = await db.getFirstAsync(
            `SELECT 1 FROM session_saves WHERE session_id = ? LIMIT 1;`,
            [sessionId]
        );

        return !!result; // true if found, false if null
    } catch (err) {
        console.log("Check save error:", err);
        return false;
    }
};

export const unsaveSessionDB = async (sessionId: string): Promise<void> => {
    try {
        await db.runAsync(
            `DELETE FROM session_saves WHERE session_id = ?;`,
            [sessionId]
        );
    } catch (err) {
        console.log("Delete save error:", err);
        throw err;
    }
};

export const getSavedSessions = async (): Promise<DriveSession[]> => {

    const rows = await db.getAllAsync<any>(`
        SELECT ds.*
        FROM drive_session ds
        INNER JOIN session_saves ss
        ON ds.id = ss.session_id
        ORDER BY ss.timestamp DESC;
    `);

    return rows.map((row) => ({
        id: row.id,
        title: row.title,
        date: row.date,
        notes: row.notes ?? undefined,

        elapsedTime: row.elapsed_time,
        timestampStart: row.timestamp_start,
        timestampEnd: row.timestamp_end,

        startLocationName: row.start_location_name ?? "",
        locationStart: {
            latitude: row.latitude_start,
            longitude: row.longitude_start,
            altitude: row.altitude_start ?? undefined,
        },

        endLocationName: row.end_location_name ?? "",
        locationEnd: {
            latitude: row.latitude_end,
            longitude: row.longitude_end,
            altitude: row.altitude_end ?? undefined,
        },

        averageSpeed: row.average_speed,
        altitudeGained: row.altitude_gained,
        distance: row.distance,

        vehicleId: row.vehicle_id ?? undefined,
    }));
};


export const sessionExists = async (id: string): Promise<boolean> => {
    const row = await db.getFirstAsync(
        `SELECT 1 FROM drive_session WHERE id = ? LIMIT 1;`,
        [id]
    );

    return !!row;
};


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



export const getPinnedLocationsDB = async (): Promise<PinnedLocation[]> => {
    try {
        const rows = await db.getAllAsync<any>(`
            SELECT * FROM pinned_locations
            ORDER BY timestamp DESC;
        `);

        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            address: row.address,
            country: row.country,
            city: row.city,
            notes: row.note ?? undefined,
            location: {
                latitude: row.latitude,
                longitude: row.longitude,
                altitude: row.altitude ?? undefined,
            },
            timestamp: row.timestamp,
        }));
    } catch (err) {
        throw err;
    }
};


export const getPinnedLocationById = async (id: string): Promise<PinnedLocation | null> => {
    const row = await db.getFirstAsync<any>(
        `SELECT * FROM pinned_locations WHERE id = ?`,
        [id]
    );

    if (!row) return null;

    return {
        id: row.id,
        name: row.name,
        notes: row.note ?? undefined,
        location: {
            latitude: row.latitude,
            longitude: row.longitude,
            altitude: row.altitude ?? undefined,
        },
        timestamp: row.timestamp,
    };
};


export const checkPinnedLocation = async (id: string): Promise<boolean> => {
    const row = await db.getFirstAsync(
        `SELECT 1 FROM pinned_locations WHERE id = ? LIMIT 1`,
        [id]
    );

    return row !== null && row !== undefined;
};


export const deletePinnedLocationDB = async (id: string): Promise<void> => {
    try {
        await db.runAsync(
            `DELETE FROM pinned_locations WHERE id = ?`,
            [id]
        );
    } catch (err) {
        throw err;
    }
};
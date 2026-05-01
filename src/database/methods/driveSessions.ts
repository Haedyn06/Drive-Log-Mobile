import { db } from "@/database/db";
import { v4 as uuidv4 } from 'uuid';

import type { DriveSession } from "@/types/dbObj/driveSessionType";
import type { SessionRoutePoint, SessionStopPoint, SessionCheckpoint } from "@/types/dbObj/mapPointTypes";
import type { SessionTopSpeed, SessionTopAltitude } from "@/types/dbObj/topMetrics";

export type SessionSortType = "newest" | "oldest" | "time" | "furthest";

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
            INSERT INTO routepoints (session_id, point_index, latitude, longitude, altitude, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
            [sessionId, i, point.location.latitude, point.location.longitude, point.location.altitude ?? null, point.timestamp]
        );
    }
};


// Save Stoppoints
export const saveStopPoints = async (sessionId: string, stopPoints: SessionStopPoint[]) => {
    for (let i = 0; i < stopPoints.length; i++) {
        const stop = stopPoints[i];

        await db.runAsync(`
            INSERT INTO stoppoints (session_id, point_index, latitude, longitude, altitude, duration, timestamp) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sessionId, i, stop.location.latitude, stop.location.longitude, stop.location.altitude ?? null, stop.duration, stop.timestamp]
        );
    }
};


// Save Top Speed
export const saveTopSpeed = async (sessionId: string, topSpeed: SessionTopSpeed) => {
    await db.runAsync(`
        INSERT INTO top_speeds (session_id, speed, latitude, longitude, altitude, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
        [sessionId, topSpeed.speed, topSpeed.location.latitude, topSpeed.location.longitude, topSpeed.location.altitude ?? null, topSpeed.timestamp]
    );
};


// Save Top Altitude
export const saveTopAltitude = async (sessionId: string, topAltitude: SessionTopAltitude) => {
    await db.runAsync(`
        INSERT OR REPLACE INTO top_altitudes (session_id, latitude, longitude, altitude, timestamp) VALUES (?, ?, ?, ?, ?)`,
        [sessionId, topAltitude.location.latitude, topAltitude.location.longitude, topAltitude.location.altitude ?? null, topAltitude.timestamp]
    );
};


export const deleteDriveSessionDB = async (id: string): Promise<void> => {
    await db.runAsync(`DELETE FROM drive_session WHERE id = ?`, [id]);
};


export const getDriveSessionsDB = async (
    limit?: number,
    sortType: SessionSortType = "newest"
): Promise<string[]> => {
    const orderBy = sortType === "oldest" ? "date ASC"
        : sortType === "time" ? "elapsed_time DESC"
        : sortType === "furthest" ? "distance DESC"
        : "date DESC";

    const sql = `SELECT id FROM drive_session ORDER BY ${orderBy} ${limit ? "LIMIT ?" : ""};`;

    const rows = limit ? await db.getAllAsync<{ id: string }>(sql, [limit]) : await db.getAllAsync<{ id: string }>(sql);

    return rows.map(r => r.id);
};

export const getSessionDB = async (sessionId: string): Promise<any[]> => 
    await db.getAllAsync(`SELECT * FROM drive_session WHERE id = ? LIMIT 1`, [sessionId]);

export const getRouteSessionDB = async (sessionId: string): Promise<any[]> => 
    await db.getAllAsync(`SELECT * FROM routepoints WHERE session_id = ? ORDER BY point_index ASC`, [sessionId]);

export const getStopsSessionDB = async (sessionId: string): Promise<any[]> => 
    await db.getAllAsync(`SELECT * FROM stoppoints WHERE session_id = ? ORDER BY point_index ASC`, [sessionId]);

export const getCheckpointsSessionDB = async (sessionId: string): Promise<any[]> => 
    await db.getAllAsync(`SELECT * FROM checkpoints WHERE session_id = ?`, [sessionId]);

export const getCheckpointImgsDB = async (checkpointId: string): Promise<any[]> => 
    await db.getAllAsync(`SELECT * FROM checkpoint_images WHERE checkpoint_id = ?`, [checkpointId]);

export const getTopSpeedSessionDB = async (sessionId: string): Promise<any[]> => 
    await db.getAllAsync(`SELECT * FROM top_speeds WHERE session_id = ? LIMIT 1`, [sessionId]);

export const getTopAltitudeSessionDB = async (sessionId: string): Promise<any[]> => 
    await db.getAllAsync(`SELECT * FROM top_altitudes WHERE session_id = ? LIMIT 1`, [sessionId]);

export const getSessionIdDB = async (): Promise<string[] | null> => 
    await db.getAllAsync<any>(`SELECT id FROM drive_session ORDER BY date DESC;`);


export const editSessionTitleDB = async (sessionId: string, newTitle: string): Promise<void> => {
    try {
        await db.runAsync(`UPDATE drive_session SET title = ? WHERE id = ?`, [newTitle, sessionId]);
    } catch (err) {
        console.log("Edit title error:", err);
        throw err;
    }
};


export const editSessionNotesDB = async (sessionId: string, newNotes?: string): Promise<void> => {
    try {
        await db.runAsync(`UPDATE drive_session SET notes = ? WHERE id = ?`, [newNotes?.trim() || null, sessionId]);
    } catch (err) {
        console.log("Edit notes error:", err);
        throw err;
    }
};


export const sessionExistsDB = async (id: string): Promise<boolean> => {
    const row = await db.getFirstAsync(`SELECT 1 FROM drive_session WHERE id = ? LIMIT 1;`, [id]);
    return !!row;
};


export const deleteCheckpointDB = async (checkpointId: string): Promise<void> => {
    try {
        await db.runAsync(`DELETE FROM checkpoints WHERE id = ?`, [checkpointId]);
    } catch (err) {
        console.log("Delete checkpoint error:", err);
        throw err;
    }
};



export const getTotalDistanceDB = async (): Promise<number> => {
    const rows = await db.getAllAsync<{ total: number }>(`SELECT SUM(distance) as total FROM drive_session;`);
    return rows[0]?.total ?? 0;
};

export const getTotalDriveTimeDB = async (): Promise<number> => {
    const rows = await db.getAllAsync<{ total: number }>(`SELECT SUM(elapsed_time) as total FROM drive_session;`);
    return rows[0]?.total ?? 0;
};

export const getTotalElevationGainDB = async (): Promise<number> => {
    const rows = await db.getAllAsync<{ total: number }>(`SELECT SUM(altitude_gained) as total FROM drive_session;`);
    return rows[0]?.total ?? 0;
};

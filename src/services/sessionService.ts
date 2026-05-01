import { db } from "@/database/db";

import { 
    saveDriveSession, saveCheckpoints, saveRoute, saveStopPoints, saveTopSpeed, saveTopAltitude, 
    getDriveSessionsDB,
    getSessionDB, getRouteSessionDB, getStopsSessionDB, getCheckpointsSessionDB, getTopSpeedSessionDB, getTopAltitudeSessionDB,
    getCheckpointImgsDB
} from "@/database/methods/driveSessions";

import { getVehicleDB } from "@/database/methods/vehicle";


import type { DriveSession } from "@/types/dbObj/driveSessionType";
import type { DriveSessionObj } from "@/types/sessionObj/DriveSessionType";
import type { SessionRoutePoint, SessionStopPoint, SessionCheckpoint } from "@/types/dbObj/mapPointTypes";
import type { SessionTopSpeed, SessionTopAltitude } from "@/types/dbObj/topMetrics";
import type { SessionAltitudeMetrics, SessionSpeedMetrics } from "@/types/sessionObj/MetricsType";
import type { SessionLocation } from "@/types/sessionObj/LocationsType";
import type { SessionSortType } from "@/database/methods/driveSessions";

export const addSession = async (
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


export const getDriveSessionObj = async (sessionId: string) => {
    const driveSession = await getSessionDB(sessionId);
    if (!driveSession) return;
    const session = driveSession[0];
    
    const sessionObj: DriveSession = {
        id: session.id,
        title: session.title,
        date: session.date,
        notes: session.notes ?? undefined,

        elapsedTime: session.elapsed_time,
        timestampStart: session.timestamp_start,
        timestampEnd: session.timestamp_end,

        startLocationName: session.start_location_name ?? "",
        locationStart: {latitude: session.latitude_start, longitude: session.longitude_start, altitude: session.altitude_start ?? undefined},

        endLocationName: session.end_location_name ?? "",
        locationEnd: {latitude: session.latitude_end, longitude: session.longitude_end, altitude: session.altitude_end ?? undefined},

        averageSpeed: session.average_speed,
        altitudeGained: session.altitude_gained,
        distance: session.distance,

        vehicleId: session.vehicle_id ?? undefined,
    }

    return sessionObj;
}


export const getFullSessionObj = async (sessionId: string): Promise<DriveSessionObj | null> => {
    let vehicle;
    const driveSession = await getSessionDB(sessionId);
    if (!driveSession) return null;
    const session = driveSession[0];

    if (driveSession[0].vehicle_id) {
        vehicle = await getVehicleDB(driveSession[0].vehicle_id);
    }

    const routePoints = await getRouteSessionDB(sessionId);
    const stopPoints = await getStopsSessionDB(sessionId);
    const checkPoints = await getCheckpointsSessionDB(sessionId);
    
    const topSpeed = await getTopSpeedSessionDB(sessionId);
    const topAltitude = await getTopAltitudeSessionDB(sessionId);

    const route: SessionRoutePoint[] = routePoints.map((routePoint) => ({
        location: {latitude: routePoint.latitude, longitude: routePoint.longitude, altitude: routePoint.altitude ?? 0},
        timestamp: routePoint.timestamp,
    }));


    const stopsSession: SessionStopPoint[] = stopPoints.map((s) => ({
        location: {latitude: s.latitude, longitude: s.longitude, altitude: s.altitude ?? 0},
        timestamp: s.timestamp,
        duration: s.duration,
    }));

    const checkpointsSession: SessionCheckpoint[] = [];

    for (const c of checkPoints) {
        const imgs = await getCheckpointImgsDB(c.id);

        checkpointsSession.push({
            id: c.id,
            type: c.type as SessionCheckpoint["type"],
            location: {latitude: c.latitude, longitude: c.longitude, altitude: c.altitude ?? 0},
            distance: c.distance,
            timestamp: c.timestamp,
            images: imgs.map((img) => img.uri),
            notes: c.notes ?? undefined,
        });
    }

    const startLoc: SessionLocation = {
        name: session.start_location_name ?? "",
        coords: {latitude: session.latitude_start, longitude: session.longitude_start, altitude: session.altitude_start ?? 0}
    }

    const endLoc: SessionLocation = {
        name: session.end_location_name ?? "",
        coords: {latitude: session.latitude_end, longitude: session.longitude_end, altitude: session.altitude_end ?? 0}
    }

    const altitudeMetric: SessionAltitudeMetrics = {
        altitudeGained: session.altitude_gained,
        topAltitude: topAltitude[0]
            ? {
                altitude: topAltitude[0].altitude,
                location: {
                    latitude: topAltitude[0].latitude,
                    longitude: topAltitude[0].longitude,
                    altitude: topAltitude[0].altitude ?? 0,
                },
                timestamp: topAltitude[0].timestamp,
            }
            : undefined,
    };

    const speedMetric: SessionSpeedMetrics = {
        avgSpeed: session.average_speed,
        topSpeed: topSpeed[0]
            ? {
                speed: topSpeed[0].speed,
                location: {
                    latitude: topSpeed[0].latitude,
                    longitude: topSpeed[0].longitude,
                    altitude: topSpeed[0].altitude ?? 0,
                },
                timestamp: topSpeed[0].timestamp,
            }
            : undefined,
    };

    const sessionObj: DriveSessionObj = {
        id: session.id,
        title: session.title,
        date: session.date,
        notes: session.notes,
        mappedRoute: route,
        checkpoints: checkpointsSession,
        stops: stopsSession,
        
        timestamps: {
            elapsedTime: session.elapsed_time,
            timestampStart: session.timestamp_start,
            timestampEnd: session.timestamp_end
        },

        locations: {
            startLocation: startLoc,
            endLocation: endLoc
        },

        metrics: {
            altitude: altitudeMetric,
            speed: speedMetric,
            distance: session.distance
        },

        vehicle: vehicle?.[0] ? {
            id: vehicle[0].id,
            year: vehicle[0].year,
            brand: vehicle[0].brand,
            model: vehicle[0].model,
            color: vehicle[0].color,
            license: vehicle[0].license ?? undefined,
        } : undefined,
    }

    return sessionObj;
}


export const getDriveSessions = async (sessionIds: string[]): Promise<DriveSession[]> => {
    const driveSessionList: DriveSession[] = [];

    for (const sessionId of sessionIds) {
        const session = await getDriveSessionObj(sessionId);
        if (session) driveSessionList.push(session);
    }

    return driveSessionList;
};


export const getFullDriveSessions = async (sessionIds: string[]): Promise<DriveSessionObj[]> => {
    const fullDriveSessionList: DriveSessionObj[] = [];

    for (const sessionId of sessionIds) {
        const session = await getFullSessionObj(sessionId);
        if (session) fullDriveSessionList.push(session);
    }
    console.log('passed');
    return fullDriveSessionList;
};

export const getAllDriveSessions = async (limit?: number, sortType: SessionSortType = "newest"): Promise<DriveSession[]> =>  {
    const driveSessions = await getDriveSessionsDB(limit, sortType);
    if (!driveSessions) return [];

    return getDriveSessions(driveSessions);
}




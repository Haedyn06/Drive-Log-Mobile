import { v4 as uuidv4 } from 'uuid';
import { sessionExists } from '@/database/methods';

// Location Type
type Coords = {
    latitude: number;
    longitude: number;
    altitude?: number;
}

type SessionLocation = {
    name?: string;
    coords?: Coords;
}

type SessionLocations = {
    startLocation: SessionLocation;
    endLocation: SessionLocation;
};

// Checkpoint
 type SessionCheckpointA = {
    id: string;
    type?: 'checkpoint' | 'break' | 'gas' | 'food' | 'issue' | 'scenery';
    location: Coords;
    distance: number;
    timestamp: number;
    images?: string[];
    notes?: string;
}


// Tops
 type TopAltitude = {
    altitude: number;
    location: Coords;
    timestamp?: number;
};

 type TopSpeed = {
    speed: number;
    location: Coords;
    timestamp?: number;
};


// Metrics
 type AltitudeMetrics = {
    altitudeGained: number;
    topAltitude?: TopAltitude;
}

 type SpeedMetrics = {
    avgSpeed: number;
    topSpeed?: TopSpeed;
}


// Overall
 type SessionMetrics = {
    altitude: AltitudeMetrics;
    speed: SpeedMetrics;
    distance: number;
};

 type SessionStopPointA = {
    location: Coords,
    timestamp: number,
    duration: number,
};

 type SessionTimes = {
    elapsedTime: number;
    timestampStart: number;
    timestampEnd: number;
};

type VehicleObj = {
    id: string;
    year: string;
    brand: string;
    model: string;
    color: string;
    license?: string;
}

// Drive Session
type DriveSessionObj = {
    id: string;
    title: string;
    date: string;
    images?: string[];
    notes?: string;
    mappedRoute?: Coords[];

    timestamps: SessionTimes;
    locations: SessionLocations;
    metrics: SessionMetrics;

    checkpoints: SessionCheckpointA[];
    stops?: SessionStopPointA[];
    vehicle?: VehicleObj;
}
import previousData from "./previousData.json";

import { DriveSession } from "@/types/dbObj/driveSessionType";
import { SessionCheckpoint } from '@/types/dbObj/checkPointType';
import { SessionRoutePoint } from '@/types/dbObj/routePointType';
import { SessionStopPoint } from '@/types/dbObj/stopPointType';
import { SessionTopSpeed, SessionTopAltitude } from '@/types/dbObj/topMetrics';
import { addSessionDB } from '@/database/methods';


export const loadPreviousSessions = (): DriveSessionObj[] => {
    return previousData as DriveSessionObj[];
};

const migrateDriveSession = (session: DriveSessionObj): DriveSession => {
    return {
        id: session.id ?? uuidv4(),
        title: session.title || "Drive",
        date: session.timestamps.timestampEnd ?? Date.now(),
        notes: session.notes ?? "",

        elapsedTime: session.timestamps.elapsedTime ?? 0,
        timestampStart: session.timestamps.timestampStart ?? 0,
        timestampEnd: session.timestamps.timestampEnd ?? 0,

        startLocationName: session.locations.startLocation.name || "Point A",
        locationStart: session.locations.startLocation.coords ?? {
            latitude: 0,
            longitude: 0,
        },

        endLocationName: session.locations.endLocation.name || "Point B",
        locationEnd: session.locations.endLocation.coords ?? {
            latitude: 0,
            longitude: 0,
        },

        averageSpeed: session.metrics.speed.avgSpeed ?? 0,
        altitudeGained: session.metrics.altitude.altitudeGained ?? 0,
        distance: session.metrics.distance ?? 0,

        vehicleId: undefined,
    };
};


const migrateCheckpoints = (
    checkpoints: SessionCheckpointA[] = []
): SessionCheckpoint[] => {
    return checkpoints.map((checkpoint) => ({
        id: checkpoint.id ?? uuidv4(),
        type: checkpoint.type ?? "checkpoint",
        location: checkpoint.location ?? {
            latitude: 0,
            longitude: 0,
        },
        distance: checkpoint.distance ?? 0,
        timestamp: checkpoint.timestamp ?? Date.now(),
        images: checkpoint.images ?? [],
        notes: checkpoint.notes ?? "",
    }));
};


const migrateRoutepoints = (
    session: DriveSessionObj
): SessionRoutePoint[] => {
    const route = session.mappedRoute ?? [];

    return route.map((point: Coords, index: number) => {
        const start = session.timestamps.timestampStart ?? Date.now();
        const end = session.timestamps.timestampEnd ?? start;

        const estimatedTimestamp =
            route.length > 1
                ? start + ((end - start) * index) / (route.length - 1)
                : start;

        return {
            location: point,
            timestamp: estimatedTimestamp,
        };
    });
};


const migrateStoppoints = (
    stopPoints: SessionStopPoint[] = []
): SessionStopPoint[] => {
    return stopPoints.map((stop) => ({
        location: stop.location ?? {
            latitude: 0,
            longitude: 0,
        },
        duration: stop.duration ?? 0,
        timestamp: stop.timestamp ?? Date.now(),
    }));
};

const migrateTopSpeed = (
    session: DriveSessionObj
): SessionTopSpeed | null => {
    const topSpeed = session.metrics.speed.topSpeed;

    if (!topSpeed) return null;

    return {
        speed: topSpeed.speed ?? 0,
        location: topSpeed.location ?? {
            latitude: 0,
            longitude: 0,
        },
        timestamp: topSpeed.timestamp ?? session.timestamps.timestampEnd ?? Date.now(),
    };
};

const migrateTopAltitude = (
    session: DriveSessionObj
): SessionTopAltitude | null => {
    const topAltitude = session.metrics.altitude.topAltitude;

    if (!topAltitude) return null;

    return {
        altitude: topAltitude.altitude ?? 0,
        location: topAltitude.location ?? {
            latitude: 0,
            longitude: 0,
        },
        timestamp: topAltitude.timestamp ?? session.timestamps.timestampEnd ?? Date.now(),
    };
};


export const migrateOldSessionsToSQLite = async (oldSessions: DriveSessionObj[]) => {
    try {
        for (const oldSession of oldSessions) {
            const driveSession = migrateDriveSession(oldSession);

            if (await sessionExists(driveSession.id)) {
                console.log("Skipping existing session:", driveSession.id);
                continue;
            }

            await addSessionDB(
                driveSession,
                migrateCheckpoints(oldSession.checkpoints ?? []),
                migrateRoutepoints(oldSession),
                migrateStoppoints(oldSession.stops ?? []),
                migrateTopSpeed(oldSession),
                migrateTopAltitude(oldSession)
            );
        }

        console.log("Migration complete");
    } catch (err) {
        console.log("Migration failed:", err);
        throw err;
    }
};
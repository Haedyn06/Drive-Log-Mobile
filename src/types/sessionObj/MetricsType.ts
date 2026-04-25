import type { Coords } from "@/types/sessionObj/LocationType";

// Tops
export type TopAltitude = {
    altitude: number;
    location: Coords;
    timestamp?: number;
};

export type TopSpeed = {
    speed: number;
    location: Coords;
    timestamp?: number;
};


// Metrics
export type AltitudeMetrics = {
    altitudeGained: number;
    topAltitude?: TopAltitude;
}

export type SpeedMetrics = {
    avgSpeed: number;
    topSpeed?: TopSpeed;
}


// Overall
export type SessionMetrics = {
    altitude: AltitudeMetrics;
    speed: SpeedMetrics;
    distance: number;
};
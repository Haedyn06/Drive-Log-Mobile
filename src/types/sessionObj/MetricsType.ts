import type { Coords } from "@/types/CoordinateType";
import { SessionTopAltitude, SessionTopSpeed } from "../dbObj/topMetrics";

// Metrics
export type SessionAltitudeMetrics = {
    altitudeGained: number;
    topAltitude?: SessionTopAltitude;
}

export type SessionSpeedMetrics = {
    avgSpeed: number;
    topSpeed?: SessionTopSpeed;
}


// Overall
export type SessionMetrics = {
    altitude: SessionAltitudeMetrics;
    speed: SessionSpeedMetrics;
    distance: number;
};
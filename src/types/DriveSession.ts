import { Coord } from "./Coord";

export type DriveSession = {
    id: string;
    title: string;
    date: string;
    startTime: number | null;
    endTime: number | null;
    startLocation: Coord | null;
    endLocation: Coord | null;

    startLocationLabel?: string;
    endLocationLabel?: string;
    carType?: string;
    notes?: string;

    durationMs: number;
    distanceMeters: number;
    averageSpeedKmh: number;
    maxSpeedKmh: number;
    maxAltitudeMeters: number;
    altitudeGainMeters: number;
    route: Coord[];
};
import { Coord } from "./Coord";

export type DriveSession = {
    id: string;
    title: string;
    date: string;
    startTime: number | null;
    endTime: number | null;
    startLocation: Coord | null;
    endLocation: Coord | null;
    durationMs: number;
    distanceMeters: number;
    averageSpeedKmh: number;
    maxSpeedKmh: number;
    route: Coord[];
};
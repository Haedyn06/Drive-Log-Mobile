import type { Coords } from "@/types/CoordinateType";

export type DriveSession = {
    id: string;
    title: string;
    date: number;
    notes?: string;
    elapsedTime: number;
    timestampStart: number;
    timestampEnd: number;
    startLocationName: string;
    locationStart: Coords;
    endLocationName: string;
    locationEnd: Coords;
    averageSpeed: number;
    altitudeGained: number;
    distance: number;
    vehicleId?: string;
}
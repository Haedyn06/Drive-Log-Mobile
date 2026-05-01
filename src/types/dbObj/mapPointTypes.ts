import { Coords } from "@/types/CoordinateType"

export type SessionRoutePoint = {
    location: Coords;
    timestamp: number;
}

export type SessionStopPoint = {
    location: Coords;
    duration: number;
    timestamp: number;
}

export type SessionCheckpoint = {
    id: string;
    type?: 'checkpoint' | 'break' | 'gas' | 'food' | 'issue' | 'scenery';
    location: Coords;
    distance: number;
    timestamp: number;
    images?: string[];
    notes?: string;
}

export type SessionCheckpointImgs = {
    id: string;
    checkpointID: string;
    uri: string;
}
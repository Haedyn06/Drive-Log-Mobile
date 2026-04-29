import type { Coords } from "@/types/CoordinateType";

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
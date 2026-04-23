import type { Coords } from "@/types/sessionObj/LocationType";

export type SessionCheckpoint = {
    id: string;
    type?: 'checkpoint' | 'stop' | 'gas' | 'food' | 'issue' | 'scenery';
    location: Coords;
    distance: number;
    timestamp: number;
    images?: string[];
    notes?: string;
}
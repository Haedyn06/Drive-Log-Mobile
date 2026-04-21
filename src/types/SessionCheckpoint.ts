import type { Coord } from "./Coord";

export type SessionCheckpoint = {
    id: string;
    location: Coord;
    timestamp: number;
    note?: string;
    type?: 'checkpoint' | 'stop' | 'gas' | 'food' | 'issue' | 'scenery';
    distance?: number;
};
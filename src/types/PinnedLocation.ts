import type { Coords } from "./CoordinateType";

export type PinnedLocation = {
    id: string;
    name: string;
    notes?: string;
    location: Coords;
    timestamp: number;
}
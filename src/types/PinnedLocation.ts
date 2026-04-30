import type { Coords } from "./CoordinateType";

export type PinnedLocation = {
    id: string;
    name: string;
    address?: string;
    country?: string;
    city?: string;
    notes?: string;
    location: Coords;
    timestamp: number;
}
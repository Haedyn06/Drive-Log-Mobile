import { Coords } from "@/types/CoordinateType";

export type SessionLocation = {
    name?: string;
    coords?: Coords;
}

export type SessionLocations = {
    startLocation: SessionLocation;
    endLocation: SessionLocation;
};
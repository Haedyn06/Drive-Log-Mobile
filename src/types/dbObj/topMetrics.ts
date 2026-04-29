import { Coords } from "@/types/CoordinateType";

export type SessionTopSpeed = {
    speed: number;
    location: Coords;
    timestamp: number;
};

export type SessionTopAltitude = {
    altitude: number;
    location: Coords;
    timestamp: number;
};

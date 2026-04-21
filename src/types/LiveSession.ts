import type { Coord } from "./Coord";

export type LiveSession = {
    isStart: boolean;
    isPaused: boolean;
    elapsed: number;
    speedKmh: number;
    distanceMeters: number;
    altitudeMeters: number;
    locStart: Coord | null;
    locEnd: Coord | null;
    route: Coord[];
    handleSession: () => Promise<void> | void;
    handleEndSession: () => Promise<void> | void;
    resetSession: () => void;
};
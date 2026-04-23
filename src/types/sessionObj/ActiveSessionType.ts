import { Coords } from "@/types/sessionObj/LocationType";
import { SessionCheckpoint } from "@/types/sessionObj/CheckpointType";

export type ActiveDriveSession = {
    id: string;
    mapRoute: Coords[];

    startTime: number;
    startLocation: Coords;

    currentSpeed: number;
    currentDistance: number;
    currentAltitude?: number;

    checkpoints: SessionCheckpoint[];
};
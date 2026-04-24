import type { Coords } from "@/types/sessionObj/LocationType";
import type { SessionTimes } from "@/types/sessionObj/TimeType";
import type { SessionLocations } from "@/types/sessionObj/LocationType";
import type { SessionMetrics } from "@/types/sessionObj/MetricsType";
import type { VehicleObj } from "@/types/vehicleObj/VehicleType";
import type { SessionCheckpoint } from "@/types/sessionObj/CheckpointType";

export type DriveSessionObj = {
    id: string;
    title: string;
    date: string;
    images?: string[];
    notes?: string;
    mappedRoute?: Coords[];

    timestamps: SessionTimes;
    locations: SessionLocations;
    metrics: SessionMetrics;

    checkpoints: SessionCheckpoint[];
    vehicle?: VehicleObj;
}
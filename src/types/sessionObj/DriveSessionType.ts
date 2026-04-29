import { SessionCheckpoint } from "@/types/dbObj/checkPointType";
import { SessionStopPoint } from "@/types/dbObj/stopPointType";
import { SessionRoutePoint } from "@/types/dbObj/routePointType";

import { SessionTimestamps } from "./TimestampsType";
import { SessionLocations } from "./LocationsType";
import { SessionMetrics } from "./MetricsType";
import { VehicleObj } from "../vehicleObj/VehicleType";

export type DriveSessionObj = {
    id: string;
    title: string;
    date: number;
    images?: string[];
    notes?: string;

    mappedRoute?: SessionRoutePoint[];
    checkpoints: SessionCheckpoint[];
    stops?: SessionStopPoint[];

    timestamps: SessionTimestamps;
    locations: SessionLocations;
    metrics: SessionMetrics;

    vehicle?: VehicleObj;
}
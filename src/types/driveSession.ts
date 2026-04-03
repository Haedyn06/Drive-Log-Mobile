export type DriveSession = {
    id: string;
    title: string;
    date: string;
    startTime: number | null;
    endTime: number | null;
    startLocation: { latitude: number; longitude: number } | null;
    endLocation: { latitude: number; longitude: number } | null;
    durationMs: number;
    distanceMeters: number;
    averageSpeedKmh: number;
    route: { latitude: number; longitude: number }[];
};
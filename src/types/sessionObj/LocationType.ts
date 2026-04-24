export type Coords = {
    latitude: number;
    longitude: number;
    altitude?: number;
}

export type SessionLocation = {
    name?: string;
    coords?: Coords;
}

export type SessionLocations = {
    startLocation: SessionLocation;
    endLocation: SessionLocation;
};
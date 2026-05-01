import { getPinnedLocationDB, getPinnedLocationsDB } from "@/database/methods/pinnedLocations";
import type { Coords } from "@/types/CoordinateType";
import type { PinnedLocation } from "@/types/PinnedLocation";

export const getPinnedLocationObj = async (locId: string) => {
    const pinnedLoc = await getPinnedLocationDB(locId);
    if (!pinnedLoc) return;

    const locCoord: Coords = {
        latitude: pinnedLoc.latitude,
        longitude: pinnedLoc.longitude,
        altitude: pinnedLoc.altitude ?? undefined,
    };

    const locStruct: PinnedLocation = {
        id: pinnedLoc.id,
        name: pinnedLoc.name,
        address: pinnedLoc.address ?? "",
        country: pinnedLoc.country ?? "",
        city: pinnedLoc.city ?? "",
        notes: pinnedLoc.note ?? undefined,
        location: locCoord,
        timestamp: pinnedLoc.timestamp,
    };

    return locStruct;
};


export const getPinnedLocations = async (locIds: string[]) => {
    const pinnedLocsList: PinnedLocation[] = [];

    for (const locId of locIds) {
        const pinnedLoc = await getPinnedLocationObj(locId);
        if (pinnedLoc) pinnedLocsList.push(pinnedLoc);
    }

    return pinnedLocsList;
}

export const getAllPinnedLocations = async (): Promise<PinnedLocation[]> => {
    const pinnedLocs = await getPinnedLocationsDB();
    if (!pinnedLocs) return [];
    return getPinnedLocations(pinnedLocs);
}
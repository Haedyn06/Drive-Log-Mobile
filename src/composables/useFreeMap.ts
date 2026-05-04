import { useEffect, useState, useRef } from 'react';
import MapView, { Marker, Region, Polyline } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Location from "expo-location";

import { getAllPinnedLocations } from '@/services/pinnedLocationService';
import { getSavedFullSessions } from '@/services/savedSessionService';

import { wait } from "@/utils/times";
import { formatToKm } from "@/utils/format";

import type { Coords } from "@/types/CoordinateType";
import type { PinnedLocation } from "@/types/PinnedLocation";
import type { DriveSessionObj } from "@/types/sessionObj/DriveSessionType";

export type MapType = "standard" | "hybrid";
export type FPSType = "first" | "third";
export type FilterType = "none" | "pinned" | "saved";

export function useFreeMap() {
    const mapRef = useRef<MapView | null>(null);
    const headingRef = useRef(0);
    const sheetRef = useRef<BottomSheet>(null);

    const [region, setRegion] = useState<any>(null);
    const [heading, setHeading] = useState(0);

    const [mapType, setMapType] = useState<MapType>("standard");
    const [fpsType, setFpsType] = useState<FPSType>("third");
    const [filterType, setFilterType] = useState<FilterType>('none');
    
    const [pinMode, setPinMode] = useState(false);
    const [pinLoc, setPinLoc] = useState<Coords>();
    const [pinMapForm, setPinMapForm] = useState(false);
    const [pinnedLocations, setPinnedLocations] = useState<PinnedLocation[]>([]);

    const [savedSessions, setSavedSessions] = useState<DriveSessionObj[]>([]);
    const [savedSession, setSavedSession] = useState<DriveSessionObj | null>();
    const centerTrigger = 0.0006;

    const [selectedPinnedLoc, setSelectedPinLoc] = useState<string | null>(null);

// Use Effects

    // Initialize Location
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const loc = await Location.getCurrentPositionAsync({});

            setRegion({
                latitude: loc.coords.latitude, longitude: loc.coords.longitude,
                latitudeDelta: 0.005, longitudeDelta: 0.005,
            });
        })();
    }, []);

    
    // Track Direction Orientation
    useEffect(() => {
        let sub: Location.LocationSubscription | null = null;

        const smoothHeading = (prev: number, next: number, factor = 0.15) => {
            let diff = ((next - prev + 540) % 360) - 180;
            return (prev + diff * factor + 360) % 360;
        };

        const start = async () => {
            sub = await Location.watchHeadingAsync((data) => {
                const raw = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
                const smoothed = smoothHeading(headingRef.current, raw);
                headingRef.current = smoothed;
                setHeading(smoothed);
            });
        };

        start();

        return () => sub?.remove();
    }, []);


    // Track Orientation
    useEffect(() => {
        if (fpsType !== "first") return;
        mapRef.current?.animateCamera({heading}, {duration: 100});
    }, [heading, fpsType]);

    useEffect(() => {
        if (!selectedPinnedLoc && pinnedLocations.length > 0) {
            setSelectedPinLoc(pinnedLocations[0].id);
        }
    }, [pinnedLocations, selectedPinnedLoc]);

// Map Methods
    const handlefocusLoc = async (lat:number, lon:number, altitude = 1200) => {
        mapRef.current?.animateCamera(
            {
                center: { latitude: lat, longitude: lon },
                altitude: altitude, zoom: 18, pitch: 0, heading: 0,
            },
            { duration: 500 }
        );
    }

    const handleRecenter = async () => {
        const loc = await Location.getCurrentPositionAsync({});

        mapRef.current?.animateCamera(
            {center: { latitude: loc.coords.latitude, longitude: loc.coords.longitude }, altitude: 200, zoom: 18, pitch: 0, heading: 0},
            {duration: 200}
        );
    };

    const checkCentered = async (currentRegion = region) => {
        const loc = await Location.getCurrentPositionAsync({});
        if (!currentRegion) return false;

        const latDiff = Math.abs(currentRegion.latitude - loc.coords.latitude);
        const lonDiff = Math.abs(currentRegion.longitude - loc.coords.longitude);

        return latDiff < centerTrigger && lonDiff < centerTrigger;
    };

    const resetValues = () => {
        setMapType('standard');
        setFpsType('third');
        setFilterType('none');
        setHeading(0);
        setPinMode(false);
        setPinMapForm(false);
        setPinnedLocations([]);
        setSavedSessions([]);
        setSavedSession(null);
    }



// Handle Type Methods
    const handleMapType = () => {
        if (mapType === 'hybrid') setMapType('standard');
        else setMapType('hybrid');
    }

    const handleFirstPerson = async () => {
        const loc = await Location.getCurrentPositionAsync({});
        if (!mapRef.current) return;
        
        setMapType("standard");
        await handleRecenter();
        await wait(200);
        setFpsType('first');
        mapRef.current.animateCamera(
            {
                center: { latitude: loc.coords.latitude, longitude: loc.coords.longitude }, 
                altitude: 250, zoom: 20, pitch: 50, heading: heading
            },
            { duration: 500 }
        );
    }

    const handleThirdPerson = async () => {
        const loc = await Location.getCurrentPositionAsync({});
        if (!mapRef.current) return;
        
        setFpsType('third');
        mapRef.current.animateCamera(
            {
                center: { latitude: loc.coords.latitude, longitude: loc.coords.longitude }, 
                pitch: 0, heading: 0, altitude: 1500, zoom: 14
            },
            { duration: 500 }
        );
    }

    const handleMapPerspective = async () => {
        const next = fpsType === "first" ? "third" : "first";
        const isCentered = await checkCentered();
        setPinMode(false);
        if (!mapRef.current) return;
        
        if (next === 'first') {
            if (isCentered) await handleFirstPerson();
            else await handleRecenter();
        } else await handleThirdPerson();
    }


    const handleFilterType = async (typeFilter: FilterType) => {
        if (typeFilter == 'saved') {
            setFilterType('saved');
            setPinnedLocations([]);
            const data = await getSavedFullSessions();
            setSavedSessions(data);
        } else if (typeFilter == 'pinned') {
            setFilterType('pinned')
            setSavedSessions([]);
            const data = await getAllPinnedLocations();
            setSavedSession(null);
            setPinnedLocations(data);
            setSelectedPinLoc(null);
        } else resetValues();
            
    }




// Pinned Location Methods
    const handleSaveLoc = (lat = region.latitude, lon = region.longitude) => {
        setPinLoc({latitude: lat, longitude: lon});
        setPinMode(false);
        setPinMapForm(true);
    }

    const handleCancelLoc = () => setPinMode(false);

    const handlePinMapClose = () => setPinMapForm(false);

    const handleFirstPinLoc = async () => {
        const loc = await Location.getCurrentPositionAsync({});
        handleSaveLoc(loc.coords.latitude, loc.coords.longitude);
    }

    const togglePinMode = async () => setPinMode(!pinMode);


    const handlePrevPinnedLoc = () => {
        if (pinnedLocations.length === 0) return;

        const i = pinnedLocations.findIndex(p => p.id === selectedPinnedLoc);
        const currentIndex = i === -1 ? 0 : i;

        const prevIndex =
            currentIndex <= 0 ? pinnedLocations.length - 1 : currentIndex - 1;

        setSelectedPinLoc(pinnedLocations[prevIndex].id);
    };

    const refreshPinnedLocations = async () => {
        const data = await getAllPinnedLocations();
        setPinnedLocations(data);
        setSelectedPinLoc(null);
    };

    const handleNextPinnedLoc = () => {
        if (pinnedLocations.length === 0) return;

        const i = pinnedLocations.findIndex(p => p.id === selectedPinnedLoc);
        const currentIndex = i === -1 ? 0 : i;

        const nextIndex = currentIndex >= pinnedLocations.length - 1 ? 0 : currentIndex + 1;

        setSelectedPinLoc(pinnedLocations[nextIndex].id);
    };



// Saved Sessions Methods
    const handleMapRoute = async (session: DriveSessionObj) => {
        const routePoints = session.mappedRoute ?? [];

        if (session.id === savedSession?.id && savedSession) {
            setSavedSession(null);
            return;
        }

        const pos = routePoints.at((Math.round(routePoints.length / 2)));
        const distance = formatToKm(session.metrics.distance);
        let alt = 0;
        
        if (distance <= 1) alt = 10000;
        else if (distance <= 10) alt = 20000;
        else if (distance <= 20) alt = 35000;
        else if (distance <= 30) alt = 55000;
        else if (distance <= 80) alt = 120000;
        else if (distance <= 100 ) alt = 500000;
        else if (distance <= 500 ) alt = 5000000;
        else alt = 50000000

        setSavedSession(session);
        if (fpsType === 'third') handlefocusLoc(pos?.location.latitude ?? 0, pos?.location.longitude ?? 0, alt);
    };



    return {
        mapRef, headingRef, sheetRef,
        region, heading,
        mapType, fpsType, filterType,
        pinMode, pinLoc, pinMapForm, pinnedLocations, selectedPinnedLoc, 
        savedSessions, savedSession,

        setRegion, setPinMode, togglePinMode, setSelectedPinLoc,

        handlefocusLoc, handleRecenter, resetValues, checkCentered,
        handleMapType, handleMapPerspective, handleFilterType, 
        handleSaveLoc, handleCancelLoc, handlePinMapClose, handleFirstPinLoc, handlePrevPinnedLoc, handleNextPinnedLoc,
        refreshPinnedLocations,
        handleMapRoute
    };
}


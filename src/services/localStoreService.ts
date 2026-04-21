import AsyncStorage from "@react-native-async-storage/async-storage";

const sessionStorage = 'sessions';

export const saveSessions = async (sessions: any[]) => {
    try {
        await AsyncStorage.setItem(sessionStorage, JSON.stringify(sessions));
    } catch (e) {
        console.log('Error saving sessions', e);
    }
};

export const getSessions = async (limit?: number) => {
    try {
        const data = await AsyncStorage.getItem(sessionStorage);
        const sessions = data ? JSON.parse(data) : [];

        return limit ? sessions.slice(0, limit) : sessions;
    } catch (e) {
        console.log('Error getting sessions', e);
        return [];
    }
};

export const getSessionById = async (id: string) => {
    try {
        const sessions = await getSessions();
        return sessions.find((session: any) => session.id === id) || null;
    } catch (e) {
        console.log("Error getting session by id", e);
        return null;
    }
};

export const addSession = async (session: any) => {
    const sessions = await getSessions();
    sessions.push(session);
    await saveSessions(sessions);
};

export const deleteSession = async (id: string) => {
    try {
        const sessions = await getSessions();
        const updatedSessions = sessions.filter((session: any) => session.id !== id);
        await saveSessions(updatedSessions);
    } catch (e) {
        console.log("Error deleting session", e);
    }
};

export const clearSessions = async () => {
    await AsyncStorage.removeItem(sessionStorage);
};


// Total Stats

export const getTotalDistance = async () => {
    try {
        const sessions = await getSessions();

        const totalMeters = sessions.reduce((sum: number, session: any) => {
            return sum + (session.distanceMeters || 0);
        }, 0);

        return totalMeters; // keep meters
    } catch (e) {
        console.log("Error getting total distance", e);
        return 0;
    }
};


export const getTotalDriveTime = async () => {
    try {
        const sessions = await getSessions();

        const totalMs = sessions.reduce((sum: number, session: any) => {
            return sum + (session.durationMs || 0);
        }, 0);

        return totalMs;
    } catch (e) {
        console.log("Error getting total drive time", e);
        return 0;
    }
};

export const getTotalElevationGain = async () => {
    try {
        const sessions = await getSessions();

        const totalGain = sessions.reduce((sum: number, session: any) => {
            return sum + (session.altitudeGainMeters || 0);
        }, 0);

        return totalGain; // meters
    } catch (e) {
        console.log("Error getting elevation gain", e);
        return 0;
    }
};



// High Record Sessions

export const getMaxSpeedSession = async () => {
    try {
        const sessions = await getSessions();

        if (!sessions.length) return null;

        const bestSession = sessions.reduce((best: any, current: any) => {
            if (!best) return current;

            return (current.maxSpeedKmh || 0) > (best.maxSpeedKmh || 0)
                ? current
                : best;
        }, null);

        return bestSession;
    } catch (e) {
        console.log("Error finding max speed session", e);
        return null;
    }
};


export const getLongestDistanceSession = async () => {
    try {
        const sessions = await getSessions();

        if (!sessions.length) return null;

        const longest = sessions.reduce((best: any, current: any) => {
            if (!best) return current;

            return (current.distanceMeters || 0) > (best.distanceMeters || 0)
                ? current
                : best;
        }, null);

        return longest;
    } catch (e) {
        console.log("Error finding longest session", e);
        return null;
    }
};


// Edits


const updateSession = async (id: string, updates: any) => {
    const sessions = await getSessions();

    const updated = sessions.map((session: any) =>
        session.id === id ? { ...session, ...updates } : session
    );

    await saveSessions(updated);
};


export const editSessionName = (id: string, name: string) => updateSession(id, { title: name });

export const editSessionNotes = (id: string, notes: string) => updateSession(id, { notes });
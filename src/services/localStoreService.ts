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

        const sorted = [...sessions].reverse();

        return limit ? sorted.slice(0, limit) : sorted;
    } catch (e) {
        console.log('Error getting sessions', e);
        return [];
    }
};

export const addSession = async (session: any) => {
    const sessions = await getSessions();
    sessions.push(session);
    await saveSessions(sessions);
};

export const clearSessions = async () => {
    await AsyncStorage.removeItem(sessionStorage);
};
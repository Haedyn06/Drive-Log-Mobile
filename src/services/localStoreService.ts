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
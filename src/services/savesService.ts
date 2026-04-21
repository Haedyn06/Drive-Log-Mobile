import AsyncStorage from "@react-native-async-storage/async-storage";

const savesStorage = 'saved_sessions';

// 
export const saveSession = async (sessionID: string) => {
    try {
        const existing = await AsyncStorage.getItem(savesStorage);
        const ids: string[] = existing ? JSON.parse(existing) : [];

        if (!ids.includes(sessionID)) {
            ids.push(sessionID);
            await AsyncStorage.setItem(savesStorage, JSON.stringify(ids));
        }
    } catch (e) {
        console.log('Error saving session id', e);
    }
};


export const isExist = async (sessionID: string): Promise<boolean> => {
    const existing = await AsyncStorage.getItem(savesStorage);
    const ids: string[] = existing ? JSON.parse(existing) : [];

    return ids.includes(sessionID);
};


export const unsaveSession = async (sessionID: string) => {
    try {
        const existing = await AsyncStorage.getItem(savesStorage);
        const ids: string[] = existing ? JSON.parse(existing) : [];

        const updated = ids.filter(id => id !== sessionID);

        await AsyncStorage.setItem(savesStorage, JSON.stringify(updated));
    } catch (e) {
        console.log('Error removing session id', e);
    }
};


export const getSaves = async (limit?: number) => {
    try {
        const data = await AsyncStorage.getItem(savesStorage);
        const sessions = data ? JSON.parse(data) : [];

        return limit ? sessions.slice(0, limit) : sessions;
    } catch (e) {
        console.log('Error getting sessions', e);
        return [];
    }
};
import { db } from "@/database/db";
import { v4 as uuidv4 } from 'uuid';


export const saveSessionDB = async (sessionId: string) => {
    try {
        const dateSaved = Date.now();
        await db.runAsync(`INSERT INTO session_saves (session_id, timestamp) VALUES (?, ?);`, [sessionId, dateSaved]);
    } catch (err) {
        throw err;
    }
}


export const checkSessionSavedDB = async (sessionId: string): Promise<boolean> => {
    try {
        const result = await db.getFirstAsync(`SELECT 1 FROM session_saves WHERE session_id = ? LIMIT 1;`, [sessionId]);
        return !!result;
    } catch (err) {
        console.log("Check save error:", err);
        return false;
    }
};


export const unsaveSessionDB = async (sessionId: string): Promise<void> => {
    try {
        await db.runAsync(`DELETE FROM session_saves WHERE session_id = ?;`, [sessionId]);
    } catch (err) {
        console.log("Delete save error:", err);
        throw err;
    }
};


export const getSavedSessionDB = async (sessionId: string): Promise<any[]> => 
    await db.getAllAsync<any>(`SELECT * FROM session_saves WHERE session_id = ?;`, [sessionId]);

export const getSavedSessionsDB = async (): Promise<string[]> => {
    const rows = await db.getAllAsync<{ session_id: string }>(`SELECT session_id FROM session_saves ORDER BY timestamp DESC;`);
    return rows.map(r => r.session_id);
};
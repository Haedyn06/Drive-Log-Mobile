import * as SQLite from 'expo-sqlite';
import { createTablesSQL } from './schema';

export const db = SQLite.openDatabaseSync('drive_logger.db');

export async function initDB() {
    try {
        await db.execAsync(createTablesSQL);
        console.log('DB initialized');
    } catch (err) {
        console.log('DB error:', err);
    }
}


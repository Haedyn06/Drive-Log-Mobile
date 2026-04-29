import { db } from "@/database/db";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { loadPreviousSessions, migrateOldSessionsToSQLite } from "@/data/migrateData";


export const dbTest = async () => {
  const sessions = await db.getAllAsync(`
    SELECT * FROM drive_session
     ORDER BY date DESC
     LIMIT 1;`
  );

  console.log(sessions);
};




export const copyDbForDebug = async () => {
  try {
    const dbPath = FileSystem.documentDirectory + "SQLite/drive_logger.db";
    const newPath = FileSystem.documentDirectory + "debug.db";

    await FileSystem.copyAsync({
      from: dbPath,
      to: newPath,
    });

    console.log("DB copied to:", newPath);

    // share it (this opens iOS share sheet)
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(newPath);
    } else {
      console.log("Sharing not available");
    }

  } catch (e) {
    console.log("DB EXPORT ERROR:", e);
  }
};


export const importData = async () => {
    const oldSessions = loadPreviousSessions();
    await migrateOldSessionsToSQLite(oldSessions);
};
import { db } from "@/database/db";



export const dbTest = async () => {
  const sessions = await db.getAllAsync(`
    SELECT * FROM drive_session
     ORDER BY date DESC
     LIMIT 1;`
  );

  console.log(sessions);
};
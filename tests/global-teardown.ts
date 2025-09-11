import { getDatabaseInstance } from "@framework/adapters/database/DatabaseConnection";

async function globalTeardown() {
  if (!getDatabaseInstance) return;
  const db = getDatabaseInstance({} as any);
  await db.closeConnection();
}

export default globalTeardown;

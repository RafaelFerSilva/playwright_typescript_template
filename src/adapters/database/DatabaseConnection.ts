import { IDBConfig } from "@framework/interfaces/IDbConfig";
import { MySQLAdapter } from "./MySQLAdapter";

let instance: MySQLAdapter | null = null;

export function getDatabaseInstance(config: IDBConfig): MySQLAdapter {
  if (!instance) {
    instance = new MySQLAdapter(config);
  }
  return instance;
}

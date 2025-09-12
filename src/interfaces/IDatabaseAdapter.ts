export interface IDatabaseAdapter {
  connect(): Promise<void>;
  executeScript(scriptPath: string): Promise<any[]>;
  replaceValuesAndExecuteScript(
    scriptPath: string,
    values: string[],
  ): Promise<{ modifiedSql: string; rows: any[] }>;
  closeConnection(): Promise<void>;
  query(sql: string, params?: any[]): Promise<any[]>;
  execute(sql: string, params?: any[]): void;
}

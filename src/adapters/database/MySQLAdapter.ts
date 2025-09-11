import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import fs from 'fs';
import { IDatabaseAdapter } from '@interfaces/IDatabaseAdapter';
import { IDBConfig } from '@framework/interfaces/IDbConfig';

export class MySQLAdapter implements IDatabaseAdapter {
  private config: IDBConfig;
  private connection: Connection | null = null;
  private TIMEOUT = 60_000; // ms
  private INTERVAL = 5_000; // ms

  constructor(dbConfig: IDBConfig) {
    this.config = dbConfig;
  }

  async connect(): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < this.TIMEOUT) {
      try {
        this.connection = await mysql.createConnection({
          host: this.config.DB_HOST,
          port: this.config.DB_PORT,
          user: this.config.DB_USER,
          password: this.config.DB_PASSWORD,
          database: this.config.DB_NAME,
          connectTimeout: 5_000,
        });
        return;
      } catch (err) {
        console.log(`Connection attempt failed: ${err}`);
        await new Promise(res => setTimeout(res, this.INTERVAL));
      }
    }
    throw new Error('Failed to connect to database after timeout');
  }

  async executeScript(scriptPath: string): Promise<any[]> {
    if (!this.connection) throw new Error('Not connected');
    const sql = fs.readFileSync(scriptPath, 'utf-8').trim();
    if (!sql) throw new Error('Script file is empty');
    const [rows] = await this.connection.query<RowDataPacket[]>(sql);
    return Array.isArray(rows) ? rows : [];
  }

  async replaceValuesAndExecuteScript(scriptPath: string, values: string[]): Promise<{ modifiedSql: string; rows: any[] }> {
    if (!this.connection) throw new Error('Not connected');
    let sql = fs.readFileSync(scriptPath, 'utf-8').trim();

    let i = 0;
    const modifiedSql = sql.replace(/\$\$/g, () => {
      if (i < values.length) {
        return values[i++];
      }
      return '$$';
    });

    const [rows] = await this.connection.query<RowDataPacket[]>(modifiedSql);
    return {
      modifiedSql,
      rows: Array.isArray(rows) ? rows : [],
    };
  }

  async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    if (!this.connection) throw new Error('Not connected');
    const [rows] = await this.connection.query(sql, params);
    return Array.isArray(rows) ? rows : [];
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    if (!this.connection) throw new Error('Not connected');
    await this.connection.execute(sql, params);
  }
}

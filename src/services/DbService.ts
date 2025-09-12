import { test } from "@playwright/test";
import { AllureLogger } from "@utils/AllureLogger";
import { IDatabaseAdapter } from "@interfaces/IDatabaseAdapter";

export class DbService {
  constructor(private adapter: IDatabaseAdapter) {}

  async executeScript(scriptPath: string) {
    return test.step(`Executar script SQL: ${scriptPath}`, async () => {
      AllureLogger.info(`Iniciando execução do script SQL: ${scriptPath}`);
      const result = await this.adapter.executeScript(scriptPath);
      AllureLogger.attachment(
        "Resultado do script SQL",
        JSON.stringify(result, null, 2),
        "application/json",
      );
      return result;
    });
  }

  async replaceValuesAndExecuteScript(scriptPath: string, values: string[]) {
    return test.step(`Executar script SQL com substituição de valores: ${scriptPath}`, async () => {
      AllureLogger.info(`Iniciando execução do script SQL com valores: ${values.join(", ")}`);
      const { modifiedSql, rows } = await this.adapter.replaceValuesAndExecuteScript(
        scriptPath,
        values,
      );
      AllureLogger.attachment("SQL modificado", modifiedSql, "text/plain");
      AllureLogger.attachment(
        "Resultado do script SQL",
        JSON.stringify(rows, null, 2),
        "application/json",
      );
      return { modifiedSql, rows };
    });
  }

  async query(sql: string, params?: any[]) {
    return test.step(`Executar consulta SQL: ${sql}`, async () => {
      if (params && params.length > 0) {
        AllureLogger.info(`Executando consulta SQL com parâmetros: ${params.join(", ")}`);
      }

      const rows = await this.adapter.query(sql, params);
      AllureLogger.attachment("Consulta SQL", sql, "text/plain");
      if (params && params.length > 0) {
        AllureLogger.attachment(
          "Parâmetros da consulta",
          JSON.stringify(params, null, 2),
          "application/json",
        );
      }
      if (!rows || rows.length === 0) {
        AllureLogger.info("A consulta SQL não retornou resultados.");
      }
      return rows;
    });
  }

  async execute(sql: string, params?: any[]) {
    return test.step(`Executar comando SQL: ${sql}`, async () => {
      AllureLogger.info(`Executando comando SQL com parâmetros: ${params?.join(", ")}`);
      const result = await this.adapter.execute(sql, params);
      AllureLogger.attachment("Comando SQL", sql, "text/plain");
      AllureLogger.attachment(
        "Parâmetros do comando",
        JSON.stringify(params, null, 2),
        "application/json",
      );
      return result;
    });
  }
}

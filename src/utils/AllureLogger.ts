import { test } from "@playwright/test";

export class AllureLogger {
  static log(message: string) {
    test.step(message, async () => {});
  }

  static info(message: string) {
    this.log(`INFO: ${message}`);
  }

  static warn(message: string) {
    this.log(`WARN: ${message}`);
  }

  static error(message: string, error?: Error) {
    console.error(`[ALLURE ERROR] ${message}`, error || "");
    test.step(`❌ ${message}`, async () => {
      if (error) {
        this.attachment("Error Details", error.stack || error.message, "text/plain");
      }
    });
  }

  static success(message: string, details?: any) {
    console.info(`[ALLURE SUCCESS] ✅ ${message}`, details || "");
    test.step(`✅ ${message}`, async () => {
      if (details) {
        this.attachment("Success Details", JSON.stringify(details, null, 2), "application/json");
      }
    });
  }

  static step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return test.step(name, async () => {
      try {
        return await fn();
      } catch (error) {
        this.error(`Erro no step "${name}": ${(error as Error).message}`);
        throw error;
      }
    });
  }

  static async attachment(name: string, content: string | Buffer, type: string) {
    const testInfo = test.info();
    if (testInfo) {
      await testInfo.attach(name, {
        body: typeof content === "string" ? Buffer.from(content, "utf-8") : content,
        contentType: type,
      });
    } else {
      console.warn(`Attachment "${name}" não anexado: fora do contexto do teste`);
    }
  }

  static apiRequest(method: string, url: string, payload?: any) {
    const message = `API ${method.toUpperCase()} ${url}`;
    test.step(message, async () => {
      this.attachment("Request URL", url, "text/plain");
      this.attachment("HTTP Method", method.toUpperCase(), "text/plain");
      if (payload) {
        this.attachment("Request Payload", JSON.stringify(payload, null, 2), "application/json");
      }
    });
  }

  static apiResponse(statusCode: number, responseBody?: any) {
    const message = `API Response [${statusCode}]`;
    test.step(message, async () => {
      this.attachment("Status Code", statusCode.toString(), "text/plain");
      if (responseBody) {
        this.attachment("Response Body", JSON.stringify(responseBody, null, 2), "application/json");
      }
    });
  }
}

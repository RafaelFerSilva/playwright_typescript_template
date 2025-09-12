import { AllureLogger } from "@utils/AllureLogger";

export class TestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TestError";
    AllureLogger.error(message);
  }
}

export class TaskFailedError extends TestError {
  constructor(taskName: string, message: string) {
    super(`Task "${taskName}" failed: ${message}`);
    this.name = "TaskFailedError";
  }
}

export class QuestionValidationError extends TestError {
  constructor(questionName: string, message: string) {
    super(`Question "${questionName}" validation failed: ${message}`);
    this.name = "QuestionValidationError";
  }
}

export class DatabaseConnectionError extends TestError {
  constructor(message: string) {
    super(`Database connection error: ${message}`);
    this.name = "DatabaseConnectionError";
  }
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly endpoint: string,
    message: string,
  ) {
    super(`API Error [${statusCode}] ${endpoint}: ${message}`);
    this.name = "ApiError";
  }
}


import { test } from "@playwright/test";
import { AllureLogger } from "@utils/AllureLogger";
import { TaskFailedError, QuestionValidationError } from "@errors/TestErrors";
import { IAbility } from "@framework/interfaces/IAbility";
import { IQuestion } from "@framework/interfaces/IQuestion";
import { IQuestionValidationOptions } from "@framework/interfaces/IQuestionValidationOptions";
import { ITask } from "@framework/interfaces/ITask";


export class Actor {
  private abilities = new Map<Function, IAbility>();
  private static indent = "  "; 

  constructor(public name: string) {}

  static named(name: string): Actor {
    return new Actor(name);
  }

  whoCan(...abilities: IAbility[]) {
    for (const ability of abilities) {
      this.abilities.set(ability.constructor, ability);
    }
    return this;
  }

  abilityTo<T extends IAbility>(abilityType: new (...args: any[]) => T): T {
    const ability = this.abilities.get(abilityType);
    if (!ability) {
      throw new Error(`${this.name} does not have ability ${abilityType.name}`);
    }
    return ability as T;
  }

  async attemptsTo(...tasks: ITask[]) {
    return Promise.all(
      tasks.map((task) =>
        test.step(
          task.stepName?.() || `Task: ${task.constructor.name}`,
          async () => {
            const stepName = task.stepName?.() || task.constructor.name;
            const testName = test.info().title;
            console.info(
              `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Iniciando Task: ${stepName}`
            );
            AllureLogger.info(`Iniciando Task: ${stepName}`);

            try {
              await task.performAs(this);
              console.info(
                `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Task concluída: ${stepName}`
              );
              AllureLogger.success(`Task concluída: ${stepName}`);
            } catch (error) {
              console.error(
                `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] `,
                error
              );
              throw new TaskFailedError(stepName, (error as Error).message);
            }
          }
        )
      )
    );
  }

  async asksFor<T extends string | number | boolean | null | undefined>(
    question: IQuestion<T>,
    options?: IQuestionValidationOptions<T>
  ): Promise<T> {
    const invalidValues =
      options?.invalidValues ?? ([false, null, undefined] as T[]);
    const ErrorClass = options?.errorClass ?? QuestionValidationError;

    return test.step(
      question.stepName?.() || `Question: ${question.constructor.name}`,
      async () => {
        const stepName = question.stepName?.() || question.constructor.name;
        const testName = test.info().title;
        console.info(
          `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Respondendo Question: ${stepName}`
        );
        AllureLogger.info(`Respondendo Question: ${stepName}`);

        try {
          const result = await question.answeredBy(this);

          if (invalidValues.includes(result)) {
            const errorMessage =
              options?.errorMessage ??
              `Question "${stepName}" retornou valor inválido: ${result}`;
            console.error(
              `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] ${errorMessage}`
            );
            throw new ErrorClass(stepName, errorMessage);
          }

          console.info(
            `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Question respondida: ${stepName} = ${result}`
          );
          AllureLogger.success(`Question respondida: ${stepName}`);
          return result;
        } catch (error) {
          console.error(
            `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] `,
            error
          );
          throw error;
        }
      }
    );
  }
}

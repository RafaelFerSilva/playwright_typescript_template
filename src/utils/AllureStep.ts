import { AllureLogger } from "@utils/AllureLogger";

export function withAllureSteps<T extends { new (...args: any[]): {} }>(
  Base: T,
  stepNamePrefix?: string,
) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);

      const propertyNames = Object.getOwnPropertyNames(Base.prototype);

      for (const propertyName of propertyNames) {
        if (propertyName === "constructor") continue;

        const originalMethod = (this as any)[propertyName];
        if (typeof originalMethod === "function") {
          (this as any)[propertyName] = async (...methodArgs: any[]) => {
            const stepName = stepNamePrefix
              ? `${stepNamePrefix} - ${propertyName}(${methodArgs.map((a) => JSON.stringify(a)).join(", ")})`
              : `${propertyName}(${methodArgs.map((a) => JSON.stringify(a)).join(", ")})`;

            console.info(`${stepName} is being executed`);
            return AllureLogger.step(stepName, async () => {
              return await originalMethod.apply(this, methodArgs);
            });
          };
        }
      }
    }
  };
}

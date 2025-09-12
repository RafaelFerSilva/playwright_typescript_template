import { Actor } from "@screenplay/core/Actor";

export interface IQuestion<T = any> {
  answeredBy(actor: Actor): Promise<T>;
  stepName?(): string;
}

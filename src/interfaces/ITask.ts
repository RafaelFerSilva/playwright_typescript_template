import { Actor } from "@screenplay/core/Actor";

export interface ITask {
  performAs(actor: Actor): Promise<void>;
  stepName?(): string;
}

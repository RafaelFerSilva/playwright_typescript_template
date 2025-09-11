import { Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';
import { ITask } from '@interfaces/ITask';

export class ExecuteSqlScriptWithValues implements ITask {
  private scriptPath: string;
  private values: string[];

  constructor(scriptPath: string, values: string[]) {
    this.scriptPath = scriptPath;
    this.values = values;
  }

  static fromFileWithValues(scriptPath: string, values: string[]) {
    return new ExecuteSqlScriptWithValues(scriptPath, values);
  }

  async performAs(actor: Actor): Promise<void> {
    const db = actor.abilityTo(AccessDatabase).db();
    await db.replaceValuesAndExecuteScript(this.scriptPath, this.values);
  }
}

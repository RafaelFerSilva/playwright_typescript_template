import { Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';
import { ITask } from '@interfaces/ITask';

export class ExecuteSqlScript implements ITask {
  private scriptPath: string;

  constructor(scriptPath: string) {
    this.scriptPath = scriptPath;
  }

  static fromFile(scriptPath: string) {
    return new ExecuteSqlScript(scriptPath);
  }

  async performAs(actor: Actor): Promise<void> {
    const db = actor.abilityTo(AccessDatabase).db();
    await db.executeScript(this.scriptPath);
  }
}

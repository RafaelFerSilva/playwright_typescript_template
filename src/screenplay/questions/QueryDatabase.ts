import { Actor } from "@screenplay/core/Actor";
import { AccessDatabase } from "@screenplay/abilities/AccessDatabase";
import { IQuestion } from "@interfaces/IQuestion";

export class QueryDatabase implements IQuestion<any[]> {
  private scriptPath: string;

  constructor(scriptPath: string) {
    this.scriptPath = scriptPath;
  }

  static fromFile(scriptPath: string) {
    return new QueryDatabase(scriptPath);
  }

  async answeredBy(actor: Actor): Promise<any[]> {
    const db = actor.abilityTo(AccessDatabase).db();
    const results = await db.executeScript(this.scriptPath);
    return results;
  }
}

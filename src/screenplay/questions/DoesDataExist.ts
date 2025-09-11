import { Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';
import { IQuestion } from '@interfaces/IQuestion';

export class DoesDataExist implements IQuestion<any> {
  private rows: any[];

  constructor(rows: any[]) {
    this.rows = rows;
  }

  static fromRows(rows: any[]) {
    return new DoesDataExist(rows);
  }

  async answeredBy(actor: Actor): Promise<any>{
    actor.abilityTo(AccessDatabase).db();
    return this.rows.length > 0;
  }
}

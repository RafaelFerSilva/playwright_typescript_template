
import { IAbility } from '@framework/interfaces/IAbility';
import { IDatabaseAdapter } from '@interfaces/IDatabaseAdapter';
import { DbService } from '@services/DbService';

export class AccessDatabase implements IAbility {
  constructor(private readonly service: DbService) {}

  static using(adapter: IDatabaseAdapter): AccessDatabase {
    return new AccessDatabase(new DbService(adapter));
  }

  db(): DbService {
    return this.service;
  }
}

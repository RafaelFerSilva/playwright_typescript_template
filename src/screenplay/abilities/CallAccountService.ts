import { IAbility } from "@framework/interfaces/IAbility";
import { IAccountApiPort } from "@interfaces/IAccountApiPort";

/**
 * Ability que permite ao Actor usar um AccountService
 * Encapsula o acesso ao service layer
 */
export class CallAccountService implements IAbility {
  constructor(private readonly accountService: IAccountApiPort) {}

  static using(accountService: IAccountApiPort): CallAccountService {
    return new CallAccountService(accountService);
  }

  get service(): IAccountApiPort {
    return this.accountService;
  }
}

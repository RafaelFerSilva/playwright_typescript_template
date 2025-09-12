import { Actor } from "@screenplay/core/Actor";
import { CallAccountService } from "@screenplay/abilities/CallAccountService";
import { IUser } from "@interfaces/IUser";
import { ITask } from "@framework/interfaces/ITask";

/**
 * Task simples para criar um usuário via Service
 * Usa apenas a funcionalidade básica de criação sem validações extras
 */
export class CreateUserViaService implements ITask {
  private constructor(private readonly userData: IUser) {}

  static withCredentials(userName: string, password: string): CreateUserViaService {
    return new CreateUserViaService({ userName, password });
  }

  static withData(userData: IUser): CreateUserViaService {
    return new CreateUserViaService(userData);
  }

  stepName(): string {
    return `Criar usuário via Service: ${this.userData.userName}`;
  }

  async performAs(actor: Actor): Promise<void> {
    const accountService = actor.abilityTo(CallAccountService).service;

    try {
      const response = await accountService.createUser(this.userData);

      // Armazenar resposta no contexto do ator
      (actor as any).lastUserCreationResponse = response;
    } catch (error) {
      throw error;
    }
  }
}

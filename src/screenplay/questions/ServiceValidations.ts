import { Actor } from "@screenplay/core/Actor";
import { IUserCreationResponse } from "@interfaces/IUser";
import { IQuestion } from "@framework/interfaces/IQuestion";

/**
 * Question para verificar se Service aplicou validações de negócio corretamente
 */
export class ServiceValidationsWereApplied implements IQuestion<boolean> {
  private constructor(private readonly expectedUserName: string) {}

  static for(userName: string): ServiceValidationsWereApplied {
    return new ServiceValidationsWereApplied(userName);
  }

  stepName(): string {
    return `Verificar se validações de negócio foram aplicadas para: ${this.expectedUserName}`;
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const creationResponse = (actor as any).lastUserCreationResponse as IUserCreationResponse;

    if (!creationResponse) {
      return false;
    }

    const validations = {
      hasValidUsername: creationResponse.username === this.expectedUserName,
      hasValidUserId: !!(creationResponse.userID && creationResponse.userID.trim() !== ""),
      hasBooksArray: Array.isArray(creationResponse.books),
      usernameMatches: creationResponse.username === this.expectedUserName,
    };

    const allValidationsPassed = Object.values(validations).every((v) => v === true);

    return allValidationsPassed;
  }
}

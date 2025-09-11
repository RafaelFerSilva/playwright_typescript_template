import { IAccountApiPort } from "@interfaces/IAccountApiPort";
import { IUser, IUserCreationResponse } from "@interfaces/IUser";
import { AllureLogger } from "@utils/AllureLogger";

export class AccountService implements IAccountApiPort {
  constructor(private readonly accountApiPort: IAccountApiPort) {}

  async createUser(userData: IUser): Promise<IUserCreationResponse> {
    // Validações de negócio antes de chamar o adapter
    this.validateUserData(userData);

    try {
      const response = await this.accountApiPort.createUser(userData);

      // Lógica de negócio pós-criação
      await this.logUserCreation(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  private validateUserData(userData: IUser): void {
    if (!userData.userName || userData.userName.trim() === "") {
      throw new Error("Username é obrigatório");
    }

    if (!userData.password || userData.password.length < 6) {
      throw new Error("Password deve ter pelo menos 6 caracteres");
    }

    // Validações específicas do DemoQA
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(userData.password)) {
      throw new Error(
        "Password deve conter pelo menos: 1 maiúscula, 1 número, 1 caractere especial"
      );
    }
  }

  private async logUserCreation(
    response: IUserCreationResponse
  ): Promise<void> {
    AllureLogger.info(
      `[SERVICE] Usuário registrado no sistema - ${response.username}`
    );
  }
}

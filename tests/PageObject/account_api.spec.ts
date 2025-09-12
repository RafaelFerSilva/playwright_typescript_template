import { DemoQAAccountApiAdapter } from "@framework/adapters/api/DemoQAAccountApiAdapter";
import { IAccountApiPort } from "@interfaces/IAccountApiPort";
import { IUser } from "@interfaces/IUser";
import { test, expect } from "@playwright/test";
import { AccountService } from "@services/AccountService";

test.describe("DemoQA Account API Tests - Page Object Pattern", () => {
  let accountService: IAccountApiPort;

  test.beforeEach(async ({ request }) => {
    // 1. Adapter (Infraestrutura - Comunicação HTTP)
    const apiAdapter = new DemoQAAccountApiAdapter(request);

    // 2. Service (Domínio - Lógica de Negócio)
    accountService = new AccountService(apiAdapter);
  });

  test("Must register a new user", async () => {
    const userName = `testuser_${Date.now()}`;
    const password = "784512Aas!";
    const user: IUser = { userName, password };

    const response = await accountService.createUser(user);

    expect(response.username).toBe(userName);
    expect(response.userID).toBeDefined();
    expect(response.userID).not.toBe("");
    expect(response.books).toEqual([]);
  });

  test("Should fail when trying to create user with invalid password", async () => {
    const userName = `invaliduser_${Date.now()}`;
    const password = "123"; // Senha muito simples
    const user: IUser = { userName, password };

    await expect(accountService.createUser(user)).rejects.toThrow();
  });

  test("Should fail when trying to create duplicate user", async () => {
    const userName = `duplicateuser_${Date.now()}`;
    const password = "784512Asd!";
    const user: IUser = { userName, password };

    // Criar primeiro usuário
    await accountService.createUser(user);

    // Tentar criar usuário com mesmo nome deve falhar
    await expect(accountService.createUser(user)).rejects.toThrow();
  });
});

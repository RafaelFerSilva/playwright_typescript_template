import { expect } from "@playwright/test";
import { test } from "@framework/fixtures/dbAdapter";
import { DbService } from "@services/DbService";
import { UserRepository } from "@repositories/UserRepository";

test.describe("Connect Database - PageObject", () => {
  test("Execute SQL Script", async ({ dbAdapter }) => {
    const dbService = new DbService(dbAdapter);
    const user = await dbService.executeScript("src/sql/test.sql");
    expect(user[0].id).toEqual(1);
  });

  test("Get User By ID", async ({ dbAdapter }) => {
    const dbService = new DbService(dbAdapter);
    const userRepository = new UserRepository(dbService);
    const user = await userRepository.getUserById(1);
    expect(user?.id).toEqual(1);
  });
});

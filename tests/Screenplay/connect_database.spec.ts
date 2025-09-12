import { expect } from "@playwright/test";
import { test } from "@framework/fixtures/dbAdapter";
import { Actor } from "@screenplay/core/Actor";
import { AccessDatabase } from "@screenplay/abilities/AccessDatabase";
import { ExecuteSqlScript } from "@screenplay/tasks/ExecuteSqlScript";
import { DoesDataExist } from "@screenplay/questions/DoesDataExist";

test.describe("Connect Database - Screenplay", () => {
  test("Should Be Possible Connect Database", async ({ dbAdapter }) => {
    const actor = new Actor("Tester").whoCan(AccessDatabase.using(dbAdapter));
    const scriptResult = await actor.attemptsTo(ExecuteSqlScript.fromFile("src/sql/test.sql"));
    const hasRows = await actor.asksFor(DoesDataExist.fromRows(scriptResult));
    expect(hasRows).toBeTruthy();
  });
});

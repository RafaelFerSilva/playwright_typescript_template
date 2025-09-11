import { test } from "@playwright/test";
import { HomePage } from "@pages/HomePage";

test.describe("Home Page Tests - Page Object", () => {
  let homePage: InstanceType<typeof HomePage>;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("should navigate to the home page and verify hero title", async () => {
    await homePage.goto();
    await homePage.expectHeroTitleVisible("Test Automation Practice");
  });
});

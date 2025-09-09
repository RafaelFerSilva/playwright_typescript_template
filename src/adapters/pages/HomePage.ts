import { Page, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string = "/"): Promise<void> {
    await this.page.goto(url);
  }

  async expectHeroTitleVisible(title: string): Promise<void> {
    await expect(this.page.getByTestId("hero-title")).toHaveText(title);
  }
}
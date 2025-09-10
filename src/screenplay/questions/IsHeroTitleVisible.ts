import { expect } from '@playwright/test';
import { BrowseTheWeb } from '@screenplay/abilities/BrowseTheWeb';
import { Actor } from '@screenplay/core/Actor';
import { IQuestion } from '@interfaces/IQuestion';


export class IsHeroTitleVisible implements IQuestion {
  static onPage() {
    return new IsHeroTitleVisible();
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const element = browser.page.getByTestId('hero-title');
    try {
      await expect(element).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }
}

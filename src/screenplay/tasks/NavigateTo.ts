import { ITask } from "@framework/interfaces/ITask";
import { BrowseTheWeb } from "@screenplay/abilities/BrowseTheWeb";
import { Actor } from "../core/Actor";

export class NavigateTo implements ITask {
  constructor(private url: string) {}

  static theUrl(url: string = "/") {
    return new NavigateTo(url);
  }

  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    await browser.page.goto(this.url);
  }
}

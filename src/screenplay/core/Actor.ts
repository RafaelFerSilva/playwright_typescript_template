import { IAbility } from "@framework/interfaces/IAbility";
import { IQuestion } from "@framework/interfaces/IQuestion";
import { ITask } from "@framework/interfaces/ITask";


export class Actor {
  private abilities = new Map<Function, IAbility>();

  constructor(public name: string) {}

  whoCan(...abilities: IAbility[]) {
    for (const ability of abilities) {
      this.abilities.set(ability.constructor, ability);
    }
    return this;
  }

  abilityTo<T extends IAbility>(abilityType: new (...args: any[]) => T): T {
    const ability = this.abilities.get(abilityType);
    if (!ability) {
      throw new Error(`${this.name} does not have ability ${abilityType.name}`);
    }
    return ability as T;
  }

  attemptsTo(...tasks: ITask[]) {
    return Promise.all(tasks.map(task => task.performAs(this)));
  }

  asksFor<T>(question: IQuestion): Promise<T> {
    return question.answeredBy(this);
  }
}

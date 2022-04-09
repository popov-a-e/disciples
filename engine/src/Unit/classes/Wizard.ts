import { Unit } from '@engine/Unit/Unit'
import { BattleFieldPosition } from '@engine/BattleField/BattleFieldPosition'

export abstract class Wizard extends Unit {
  act (target: BattleFieldPosition): void {
    this.canOnlyTargetEnemies(target)
    this.canOnlyTargetUnits(target)

    this.bf
      .armies[target[0]]
      .forEach(unit => unit.dealDamage(this.damage))
  }
}
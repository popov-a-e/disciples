import { BattleFieldPosition } from '@engine/BattleField/BattleFieldPosition'
import { Unit } from '@engine/Unit/Unit'

export abstract class Archer extends Unit {
  act (target: BattleFieldPosition): void {
    this.canOnlyTargetEnemies(target)
    this.canOnlyTargetUnits(target)

    this.bf
      .getUnitOnPosition(target)!
      .dealDamage(this.damage)
  }
}
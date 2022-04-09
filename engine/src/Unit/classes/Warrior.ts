import { Unit } from '@engine/Unit/Unit'
import { BattleFieldPosition } from '@engine/BattleField/BattleFieldPosition'

export abstract class Warrior extends Unit {
  private canOnlyTargetFirstLine (target: BattleFieldPosition): void {

  }

  act (target: BattleFieldPosition): void {
    this.canOnlyTargetEnemies(target)
    this.canOnlyTargetUnits(target)
    this.canOnlyTargetFirstLine(target)

    this.bf.getUnitOnPosition(target)!
      .dealDamage(this.damage)
  }
}
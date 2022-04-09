import { Warrior as WarriorClass } from '@engine/Unit'

export class Warrior extends WarriorClass {
  readonly name = 'Воин'
  readonly isBig = false
  readonly baseDamage = 25
  readonly baseHealth = 120
  readonly baseInitiative = 50
}
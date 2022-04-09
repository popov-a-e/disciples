import { Warrior } from '@engine/Unit'

export class Leyf extends Warrior {
  readonly name = 'Лейф'
  readonly isBig = false
  readonly baseDamage = 40
  readonly baseHealth = 150
  readonly baseInitiative = 30
}
import { Archer } from '@engine/Unit'

export class Baldarik extends Archer {
  readonly name = 'Бальдарик'
  readonly isBig = false
  readonly baseDamage = 40
  readonly baseHealth = 135
  readonly baseInitiative = 50
}
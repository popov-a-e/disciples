import { Wizard } from '@engine/Unit'

export class DemonUther extends Wizard {
  readonly name = 'Демон Утер'
  readonly isBig = true
  readonly baseDamage = 150
  readonly baseHealth = 1500
  readonly baseInitiative = 65
}
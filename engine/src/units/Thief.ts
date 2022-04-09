import { Warrior } from '@engine/Unit'

export class Thief extends Warrior {
  readonly name = 'Вор'
  readonly isBig = false
  readonly baseDamage = 40
  readonly baseHealth = 150
  readonly baseInitiative = 50
}
import { BattleFieldPosition } from '@engine/BattleField/BattleFieldPosition'
import { BattleField } from '@engine/BattleField/BattleField'
import { BattleFieldSide, invertBattleFieldSide } from '@engine/BattleField/BattleFieldSide'
import { UnitState } from '@engine/Unit/UnitState'
import { UnitId } from '@engine/Unit/UnitId'
import { ArmyPosition, columnAtPosition } from '@engine/Army/ArmyPosition'
import { ArmyState } from '@engine/Army/ArmyState'

export abstract class Unit {
  abstract readonly name: string
  abstract readonly isBig: boolean
  abstract readonly baseDamage: number
  abstract readonly baseHealth: number
  abstract readonly baseInitiative: number

  protected _bf: BattleField | null = null
  private _state: UnitState | null = null

  setState (state: UnitState) {
    this._state = state

    return this
  }

  private get state (): UnitState {
    if (!this._state) {
      console.trace()
      throw new Error("No state set for this unit")
    }

    return this._state
  }

  private set state (state: UnitState) {
    this._state = state
  }

  getState () {
    return this.state
  }

  get id () {
    return this.state.id
  }

  get position(): ArmyPosition[] {
    return this.state.position
  }

  set position(position) {
    this.state.position = position
  }

  get bfPosition(): BattleFieldPosition {
    return [this.side, ...this.position[0]]
  }

  get side (): BattleFieldSide {
    return this.bf.armies[BattleFieldSide.ALLY].includes(this)
      ? BattleFieldSide.ALLY
      : BattleFieldSide.ENEMY
  }

  addToArmy (army: ArmyState, id: UnitId, position: ArmyPosition): UnitState {
    army.push({
      id,
      type: this.constructor.name,
      position: this.isBig ? columnAtPosition(position) : [position],
      health: this.baseHealth,
      initiative: this.baseInitiative,
    })

    this.state = army[army.length - 1]

    return this.state
  }

  enterBattleField (bf: BattleField): this {
    this._bf = bf

    return this
  }

  leaveBattleField () {
    this._bf = null

    return this
  }

  abstract act (target: BattleFieldPosition): void

  get bf () {
    if (!this._bf) {
      throw new Error("Not on battlefield")
    }

    return this._bf
  }

  get isOnBattleField (): boolean {
    return this._bf !== null
  }

  get damage () {
    return this.baseDamage
  }

  get health () {
    return this.state.health
  }

  get initiative () {
    return this.state.initiative
  }

  get type () {
    return this.constructor.name
  }

  get isAlive (): boolean {
    return this.health > 0
  }

  dealDamage (damage: number) {
    this.state.health = Math.max(this.state.health - damage, 0)

    this._bf?.emit('unit-attacked', this.state)

    if (this.state.health === 0) {
      this._bf?.emit('unit-dead', this.state)
    }
  }

  protected canOnlyTargetEnemies (target: BattleFieldPosition): void {
    const [side] = this.bf.activeUnitWithSide

    const oppositeSide = invertBattleFieldSide(side)
    const [targetSide] = target

    if (oppositeSide !== targetSide) {
      throw new Error("This unit can target only enemy units")
    }
  }

  protected canOnlyTargetUnits (target: BattleFieldPosition): void {
    const targetUnit = this.bf.getUnitOnPosition(target)

    if (!targetUnit) {
      throw new Error("This unit needs a target to attack")
    }
  }
}

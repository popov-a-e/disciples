import { BattleFieldPosition } from '@engine/BattleField/BattleFieldPosition'
import { BattleFieldSide } from '@engine/BattleField/BattleFieldSide'
import { ArmyState } from '@engine/Army/ArmyState'
import { UnitId } from '@engine/Unit/UnitId'
import { ArmyPosition } from '@engine/Army/ArmyPosition'
import { Unit } from '@engine/Unit/Unit'
import { UnitState } from '@engine/Unit/UnitState'
import { keyBy } from '@engine/util/keyBy'
import { Army } from '@engine/Army/Army'

export class BattleField {
  #armies: Record<BattleFieldSide, Army> = {
    [BattleFieldSide.ALLY]: [],
    [BattleFieldSide.ENEMY]: []
  }

  #turnOrder: UnitId[] = []
  #currentTurn: UnitId | null = null

  #units: Unit[] = []

  setArmies (armies: Record<BattleFieldSide, Army>) {
    this.#armies = armies
    this.#units = Object.values(armies).flat(1).map(unit => unit.enterBattleField(this))

    this.#turnOrder = []
    this.#currentTurn = null
  }

  initBattle () {
    this.checkArmiesNonEmpty()
    this.checkUniqueIds()
    this.checkValidPositions()

    this.calcTurnOrder()
    this.nextTurn()
  }

  private checkArmiesNonEmpty () {
    Object.values(this.armies).forEach(armyState => {
      if (armyState.length === 0) {
        throw new Error("Both armies must have at least one unit")
      }
    })
  }

  private checkUniqueIds () {
    this.units.map(unit => unit.id).reduce((p, c) => {
      if (p.includes(c)) {
        throw new Error("Cannot initialize units with same Id")
      }

      p.push(c)

      return p
    }, [] as UnitId[])
  }

  private checkValidPositions () {
    Object.values(this.armies).forEach(units => units.reduce((agg, unit) => {
      if (!unit.isBig && unit.position.length !== 1) {
        throw new Error("Regular unit must take exactly one slot")
      }

      if (unit.isBig) {
        if (unit.position.length !== 2) {
          throw new Error("Big unit must take exactly 2 adjacent slots")
        }

        if (unit.position[0][1] !== unit.position[1][1] || unit.position[0][0] === unit.position[1][0]) {
          throw new Error("Big unit can only take adjacent slots")
        }
      }

      unit.position.forEach(position => {
        if (agg.find(pos => pos[0] === position[0] && pos[1] === position[1])) {
          throw new Error("2 or more units cannot take the same slot")
        }

        agg.push(position)
      })

      return agg
    }, [] as ArmyPosition[]))
  }

  public get units () {
    return this.#units
  }

  public get currentTurn () {
    return this.#currentTurn
  }

  get activeUnitWithSide (): [BattleFieldSide, Unit] {
    return [BattleFieldSide.ALLY, BattleFieldSide.ENEMY]
      .map(side => [side, this.armies[side].find(unit => unit.id === this.#currentTurn) ?? null])
      .find(([_side, unit]) => unit !== null) as [BattleFieldSide, Unit]
  }

  get activeUnit (): Unit {
    return this.units.find(unit => unit.id === this.#currentTurn)!
  }

  private calcTurnOrder () {
    this.#turnOrder = this.units.slice().sort((a, b) => {
      if (a.initiative !== b.initiative) {
        return Math.sign(a.initiative - b.initiative)
      }

      return Math.sign(Math.random() - 0.5)
    }).map(unit => unit.id)
  }

  private nextTurn () {
    const nextTurn = this.#turnOrder[this.#turnOrder.indexOf(this.#currentTurn ?? 0) + 1]

    if (!nextTurn) {
      if ([BattleFieldSide.ALLY, BattleFieldSide.ENEMY].some(side => this.armies[side].filter(unit => unit.isAlive).length === 0)) {
        this.emit('game-ended')

        this.#currentTurn = 0

        return
      }

      this.#currentTurn = this.#turnOrder[0]
    } else {
      this.#currentTurn = nextTurn
    }

    if (!this.activeUnit.isAlive) {
      this.nextTurn()
    }

    this.emit('turn-changed', this.#currentTurn)
  }

  get armies (): Record<BattleFieldSide, Unit[]> {
    return this.#armies
  }

  get armiesState () {
    return this.forEachArmy(
      side => this.armies[side].map(unit => unit.getState())
    )
  }

  attack (target: BattleFieldPosition) {
    this.activeUnit.act(target)

    this.emit('unit-made-action', this.activeUnit)
    this.emit('state-changed', this.armiesState)

    this.nextTurn()
  }

  protected forEachArmy<T> (cb: (side: BattleFieldSide) => T): Record<BattleFieldSide, T> {
    return keyBy([BattleFieldSide.ALLY, BattleFieldSide.ENEMY], cb)
  }

  public getUnitOnPosition (position: BattleFieldPosition): Unit | null {
    const [posSide, posLine, posOrder] = position

    return this.armies[posSide].find(
      unit => unit.isAlive && unit.position.find(pos => pos[0] === posLine && pos[1] === posOrder)
    ) ?? null
  }

  listeners: Record<string, ((...args: any[]) => void)[]> = {}

  public emit (event: 'game-ended'): void
  public emit (event: 'state-changed', state: Record<BattleFieldSide, ArmyState>): void
  public emit (event: 'turn-changed', turnOwnerUnitId: number): void
  public emit (event: 'unit-made-action', unit: UnitState): void
  public emit (event: 'unit-attacked', unit: UnitState): void
  public emit (event: 'unit-dead', unit: UnitState): void

  public emit(event: string, ...args: any[]): void {
    this.listeners[event]?.forEach(listener => listener(...args))
  }

  public on (event: 'game-ended', cb: () => void): void
  public on (event: 'state-changed', cb: (state: Record<BattleFieldSide, ArmyState>) => void): void
  public on (event: 'turn-changed', cb: (turnOwnerUnitId: number) => void): void
  public on (event: 'unit-made-action', cb: (unit: UnitState) => void): void
  public on (event: 'unit-attacked', cb: (unit: UnitState) => void): void
  public on (event: 'unit-dead', cb: (unit: UnitState) => void): void

  public on (event: string, cb: (...args: any[]) => void): void {
    this.listeners[event] = this.listeners[event] ?? []

    this.listeners[event].push(cb)
  }
}
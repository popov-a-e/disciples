import { ArmyLine } from '@engine/Army/ArmyLine'
import { ArmyOrder } from '@engine/Army/ArmyOrder'

export type ArmyPosition = [ArmyLine, ArmyOrder]

export const columnAtPosition = (position: ArmyPosition) => [[ArmyLine.REARGUARD, position[1]], [ArmyLine.VANGUARD, position[1]]] as ArmyPosition[]
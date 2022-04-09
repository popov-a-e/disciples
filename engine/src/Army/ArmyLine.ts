export enum ArmyLine {
  VANGUARD = 'VANGUARD',
  REARGUARD = 'REARGUARD'
}

export const invertArmyLine = (position: ArmyLine): ArmyLine =>
  ({
    [ArmyLine.VANGUARD]: ArmyLine.REARGUARD,
    [ArmyLine.REARGUARD]: ArmyLine.VANGUARD
  }[position])
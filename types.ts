export interface NamedRolls {
  [key: string]: string
}

export interface RollDetails {
  roll: string
  namedRoll?: string
  results: number[]
  detail?: RollDetails[]
  named?: NamedRolls
  sum?: number
}

export interface ComplexResult {
  results: RollDetails[]
  expression: string
  sum: number
}

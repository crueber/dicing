export interface NamedRolls {
  [key: string]: string
}

export interface ComplexRollResult {
  expression: string
  roll: string
  result: object
}

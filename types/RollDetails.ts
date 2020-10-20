
import { NamedRolls } from './NamedRolls.ts'

export interface RollDetails {
  roll: string
  namedRoll?: string
  results: number[]
  detail?: RollDetails[]
  named?: NamedRolls
  sum?: number
}

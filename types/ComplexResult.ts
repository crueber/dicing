
import { RollDetails } from './RollDetails.ts'

export interface ComplexResult {
  results: RollDetails[]
  expression: string
  sum: number
}

import { NamedRolls, ComplexResult, RollDetails } from './types.ts'
import { simpleExpression, wholeDieExpression, parenMatches } from './regex.ts'

import roll from './roll.ts'

// -2d10+8d4+12
export default async function expressionRoll(input: string) {
  const result = input.match(new RegExp(wholeDieExpression.source, 'g')) || []

  const detail = await Promise.all(result.map(async (shortExp) => {
    return { roll: shortExp, results: await roll(shortExp) }
  }))

  const results = detail.map((i) => i.results).flat();
  const sum = results.reduce((agg, i) => { return i + agg }, 0)

  return { roll: input, results, detail, sum }
}

import { NamedRolls, ComplexResult, RollDetails } from './types.ts'
import { simpleExpression, wholeDieExpression, parenMatches } from './regex.ts'

import expressionRoll from './expressionRoll.ts'

async function rollExpressions(expressions: string[], namedRolls: NamedRolls) {
  return await Promise.all(expressions.map(async (exp) => {
    const named: NamedRolls = {}

    const matches = exp.match(new RegExp(parenMatches.source, 'g')) || []

    const roll = matches.reduce((exp, i) => {
      const match = i.slice(1, -1)
      named[match] = namedRolls[match]
      return exp.replace(i, namedRolls[match])
    }, exp)

    const rollResult: RollDetails = await expressionRoll(roll)
    if (exp !== roll) rollResult.namedRoll = exp

    return { named, ...rollResult }
  }))
}

// namedRolls: { "attack": "d20+13", "damage": "2d6+13", "rage": "5" }
// expression: (attack)+(rage)+3 & (damage)+(rage)
export default async function complexRoll(expression: string, namedRolls?: NamedRolls) {
  const cleanedExpression = expression.replaceAll(' ', '').replaceAll('&', ' and ')
  const parsedExpression = cleanedExpression.split(' and ')

  try {
    const results = await rollExpressions(parsedExpression, namedRolls || {})
    const sum = results.reduce((prev, curr) => { return prev + (curr.sum || 0)}, 0)
    const complexRoll: ComplexResult = { results, expression: cleanedExpression, sum }
  
    return complexRoll  
  } catch(e) {
    return { results: [], expression: "", sum: 0, error: e.error };
  }
}

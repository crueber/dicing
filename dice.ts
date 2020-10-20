import { NamedRolls, ComplexResult, RollDetails } from './types.ts'
import { simpleExpression, wholeDieExpression, parenMatches } from './regex.ts'

// 2d10
export async function roll(expression: string) {
  const result = (new RegExp(simpleExpression.source, 'g')).exec(expression[0] === '+' ? expression.slice(1) : expression)

  const data = result?.groups;
  const output: number[] = [];

  if (data) {
    const num = parseInt(data.num) || 1
    const sides = data.sides ? parseInt(data.sides) : null;

    if (sides) {
      for (let i = 0; i < num; i++) {
        const dieRoll = Math.ceil(Math.random() * sides);
        output.push(data.sign === '-' ? -dieRoll : dieRoll)
      }
    }

    if (data.val) {
      const val = parseInt(data.val)
      output.push(data.sign === '-' ? -val : val)
    }
  }

  return output; // [2, 8]
}

// -2d10+8d4+12
export async function expressionRoll(input: string) {
  const result = input.match(new RegExp(wholeDieExpression.source, 'g')) || []

  const detail = await Promise.all(result.map(async (shortExp) => {
    return { roll: shortExp, results: await roll(shortExp) }
  }))

  const results = detail.map((i) => i.results).flat();
  const sum = results.reduce((agg, i) => { return i + agg }, 0)

  return { roll: input, results, detail, sum }
}


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
export async function complexRoll(expression: string, namedRolls?: NamedRolls) {
  const cleanedExpression = expression.replaceAll(' ', '').replaceAll('&', ' and ')
  const parsedExpression = cleanedExpression.split(' and ')

  const results = await rollExpressions(parsedExpression, namedRolls || {})

  const sum = results.reduce((prev, curr) => { return prev + (curr.sum || 0)}, 0)
  const complexRoll: ComplexResult = { results, expression: cleanedExpression, sum }

  return complexRoll
}

// (async () => {
//   const results = await complexRoll("(attack)- (rage) +3& (damage)+(rage)", { "attack": "d20+13", "damage": "2d6+13", "rage": "5" });
//   console.log(JSON.stringify(results,null,3))
// })()

import { NamedRolls, ComplexRollResult } from './types.ts'

const simpleExpression = /(?<sign>[+-]*)((?<num>\d*)[dD](?<sides>\d+)|(?<val>\d+))/g
const wholeDieExpression = /(\+)(\w+)|(\-)(\w+)|()(\w+)/g
const regexParenMatches = /\((\w+)\)/g

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

  return { input, detail, results, sum }
}

// namedRolls: { "attack": "d20+13", "damage": "2d6+13", "rage": "5" }
// expression: (attack)+(rage)+3 & (damage)+(rage)
export async function complexRoll(namedRolls: NamedRolls, expression: string) {
  const usedNamedExpressions = new Set()
  const rollableExpressions = expression.replaceAll(' ', '').split('&').map((exp) => {
    const matches = exp.match(new RegExp(regexParenMatches.source, 'g')) || []

    const rollableExpression = matches.reduce((exp, i) => {
      const match = i.slice(1, -1)
      usedNamedExpressions.add(match)
      return exp.replace(i, namedRolls[match])
    }, exp)

    return { expression: exp, roll: rollableExpression, result: {} }
  })

  const promises = rollableExpressions.map(async (i: ComplexRollResult) => {
    const result = await expressionRoll(i.roll)
    i.result = { sum: result.sum, results: result.results, details: result.detail }

    return i
  })
  await Promise.all(promises)

  return { expression, rollableExpressions, namedExpressionsUsed: Array.from(usedNamedExpressions) }
}

(async () => {
  const results = await complexRoll({ "attack": "d20+13", "damage": "2d6+13", "rage": "5" }, "(attack)+ (rage) +3& (damage)+(rage)");
  console.log(JSON.stringify(results,null,3))
})()

// // https://regex101.com/
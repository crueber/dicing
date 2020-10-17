
const simpleExpression = /(?<sign>[+-]*)((?<num>\d*)[dD](?<sides>\d+)|(?<val>\d+))/g
const wholeDieExpression = /(\+)(\w+)|(\-)(\w+)|()(\w+)/g

// 2d10
export async function roll(expression: string) {
  const result = (new RegExp(simpleExpression.source, 'g')).exec(expression[0] === '+' ? expression.slice(1) : expression)
  // const result = expression.match(simpleExpression)
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

  return { input, detail, results, sum, errors: [] }
}

// TODO: Next... Need to accept named rolls.

// input = {
// 	"namedRolls": {
// 		"attack": "d20+13",
// 		"damage": "2d6+13",
// 		"rage": "5"
// 	},
// 	"roll": "(attack)+(rage)+3 & (damage)+(rage)"
// }
export async function complexRoll(expression: string) {
  return {}
}
// output = {
// 	"input": "(attack)+(rage)+3 & (damage)+(rage)", 
// 	"detail": [
// 		[
// 			{ "name": "attack", "roll": "d20+13", "results": [8, 13] },
// 			{ "name": "rage", "roll": "5", "results": [5] },
// 			{ "results": [3] }
// 		],
// 		[
// 			{ "name": "damage", "roll": "2d6+13", "results": [4, 6, 13] },
// 			{ "name": "rage", "roll": "5", "results": [5] },
// 		]
// 	],
// 	"results": [21, 23],
// 	"errors": []
// }

// (attack)+(rage): [8] + 13 = 21
// (damage)+(rage): [4,6] + 13 = 23

// // https://regex101.com/
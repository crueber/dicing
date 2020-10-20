
import { simpleExpression } from './lib/regex.ts'

// Expression string: [+ - or not present][optional number]d[number]
// Examples: d6, -d6, +d6, 1d6, -1d6, +1d6, 20d10, 80d100, -100d1000 
export default async function roll(expression: string) {
  if (!(new RegExp(simpleExpression.source, 'g')).test(expression)) throw new Error('Unable to parse expression')
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

import expressionRoll from './expressionRoll.ts'
import { assert, equal } from "https://deno.land/std/testing/asserts.ts";

Deno.test("basics of and expression when no roll is present", async () => {
  const exp = await expressionRoll('')

  assert(typeof exp == 'object')
  assert(!!exp.results && Array.isArray(exp.results) && exp.results.length === 0)
  assert(exp.roll === '')
  // exp.results.forEach((i) => assert(typeof i === 'number'))
})

Deno.test("basics of and expression when a roll is present", async () => {
  const theExpression = 'd6+d10'
  const exp = await expressionRoll(theExpression)

  assert(typeof exp == 'object')
  assert(!!exp.results && Array.isArray(exp.results) && exp.results.length === 2)
  assert(exp.roll === theExpression)
  exp.results.forEach((i) => assert(typeof i === 'number'))
})

Deno.test("complex expression (+20d20-5d6+10-5)", async () => {
  const theExpression = '+20d20-5d6+10-5' // 20 - 375
  const exp = await expressionRoll(theExpression)

  assert(typeof exp == 'object')
  assert(exp.roll === theExpression)

  assert(!!exp.results && Array.isArray(exp.results) && exp.results.length === 27)
  exp.results.forEach((i) => assert(typeof i === 'number'))
  const { positives, negatives } = exp.results.reduce((obj, result) => {
    if (result > 0) obj.positives += 1
    else obj.negatives += 1
    return obj
  }, { positives: 0, negatives: 0 })
  assert(positives === 21 && negatives === 6)
  assert(exp.sum >= 20 && exp.sum <= 375)
})

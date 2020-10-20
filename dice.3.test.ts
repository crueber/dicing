
import { complexRoll } from './dice.ts'
import { assert, equal } from "https://deno.land/std/testing/asserts.ts";

const namedRolls = { "attack": "d20+13", "damage": "2d6+13", "rage": "5" }

Deno.test("happy path complex expression", async () => {
  const expression = "(attack) + (rage) + 3"
  const results = await complexRoll(expression, namedRolls)

  assert(results.expression === "(attack)+(rage)+3")
  assert(results.results[0].roll === "d20+13+5+3")
  assert(typeof results.sum === 'number')
  assert(typeof results.results[0].sum === 'number')
})

Deno.test("dual complex expression", async () => {
  const expression = "(attack) - (rage) + 3 &(damage)+(rage) "
  const results = await complexRoll(expression, namedRolls)

  assert(results.expression === "(attack)-(rage)+3 and (damage)+(rage)")
  assert(results.results[0].roll === namedRolls.attack + "-" + namedRolls.rage + "+3")
  assert(results.results[1].roll === namedRolls.damage + "+" + namedRolls.rage)
  assert(typeof results.sum === 'number')
})

// {
//   "results": [
//     {
//       "named": { "attack": "d20+13", "rage": "5" },
//       "roll": "d20+13-5+3",
//       "results": [ 10, 13, -5, 3 ],
//       "detail": [
//         { "roll": "d20", "results": [ 10 ] },
//         { "roll": "+13", "results": [ 13 ] },
//         { "roll": "-5", "results": [ -5 ] },
//         { "roll": "+3", "results": [ 3 ] }
//       ],
//       "sum": 21
//     },
//     {
//       "named": { "damage": "2d6+13", "rage": "5" },
//       "roll": "2d6+13+5",
//       "results": [ 6, 3, 13, 5 ],
//       "detail": [
//         { "roll": "2d6", "results": [ 6, 3 ] },
//         { "roll": "+13", "results": [ 13 ] },
//         { "roll": "+5", "results": [ 5 ] }
//       ],
//       "sum": 27
//     }
//   ],
//   "expression": "(attack)-(rage)+3 and (damage)+(rage)",
//   "sum": 48
// }

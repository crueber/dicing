import { roll } from './dice.ts'
import { assert, equal } from "https://deno.land/std/testing/asserts.ts";

Deno.test("if the environment works", () => {
  if (!roll) throw Error("Unable to import dice.")
})

Deno.test("basics of dice", async () => {
  try {
    const result = await roll('')
    assert(false)
  } catch (e) {
    assert(typeof e.message === 'string')

    const result = await roll('d6')
    assert(typeof result === 'object')
  }
})

Deno.test("1000 die rolls w/constraints", async () => {
  const runner = new Array(1000).map(async () => {
    const outcome = await roll('1d8')

    assert(outcome.length === 1)
    assert(outcome[0] > 0 && outcome[0] <= 8)
  })
  assert(runner.length === 1000)
  await Promise.all(runner);
})

Deno.test("multiple dice (20d6, 10d8, 5d4)", async () => {
  const rolls = ['20d6', '10d8', '5d4']
  const results = [20, 10, 5]

  const runner = rolls.map(async (i, idx) => {
    const outcome = await roll(i)
    assert(outcome.length === results[idx])
  })
  assert(runner.length = rolls.length)
  await Promise.all(runner)
})

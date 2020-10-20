import roll from './roll.ts'
import { assert } from "https://deno.land/std/testing/asserts.ts";

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
  for (let index = 1; index < 1000; index++) {
    const outcome = await roll('1d8')

    assert(outcome.length === 1)
    assert(outcome[0] > 0 && outcome[0] <= 8)
  }
})

Deno.test("10000 rolls that have a statistically reasonable distribution", async () => {
  const dist: { [key: string]: number } = {}

  for (let index = 1; index < 10000; index++) {
    const r = `${(await roll('1d8'))[0]}`
    dist[r] = dist[r] ? dist[r] + 1 : 1
  }
  // console.log(JSON.stringify(dist, null, 3))

  Object.values(dist).forEach((value) => {
    assert(value > 1100) // Statistically reasonable weighting.
  })

  assert(Object.keys(dist).length === 8)
})

Deno.test("multiple dice (20d6, 10d8, 5d4)", async () => {
  const rolls = ['20d6', '10d8', '5d4']
  const results = [20, 10, 5]

  for (let index = 0; index < rolls.length; index++) {
    const outcome = await roll(rolls[index])
    assert(outcome.length === results[index])
  }
})

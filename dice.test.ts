import { roll } from './dice.ts'
import { assert, equal } from "https://deno.land/std/testing/asserts.ts";

Deno.test("if the environment works", () => {
  if (!roll) throw Error("Unable to import dice.")
})

Deno.test("basics of dice", () => {
  const result = roll('')

  assert(typeof result === 'object')
})

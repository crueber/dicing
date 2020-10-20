
import expressionRoll from '../expressionRoll.ts'

(async () => {
  const promises = Deno.args.map(async (i) => {
    console.log(JSON.stringify(await expressionRoll(i)))
  })
  await Promise.all(promises)
})()

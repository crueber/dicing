
import complexRoll from '../complexRoll.ts'

(async () => {
  const results = await complexRoll("(attack)- (rage) +3& (damage)+(rage)", { "attack": "d20+13", "damage": "2d6+13", "rage": "5" });
  console.log(JSON.stringify(results,null,3))
})()


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

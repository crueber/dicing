// https://regex101.com/
export const simpleExpression = /^(?<sign>[+-]*)((?<num>\d*)[dD](?<sides>\d+)|(?<val>\d+))$/g
export const wholeDieExpression = /(\+)(\w+)|(\-)(\w+)|()(\w+)/g
export const parenMatches = /\((\w+)\)/g

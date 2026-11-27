/** ['Joi', 'Mige'] → 'Joi und Mige'; ['A', 'B', 'C'] → 'A, B und C' */
export function joinNames(list) {
  if (!list?.length) return ''
  if (list.length === 1) return list[0]
  return `${list.slice(0, -1).join(', ')} und ${list[list.length - 1]}`
}

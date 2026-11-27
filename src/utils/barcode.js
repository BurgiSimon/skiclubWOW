// Deterministic fake barcode for the ski-pass tickets: same id → same stripes.

export function barcode(seed, count = 38) {
  let hash = 2166136261
  for (const char of seed) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }

  const bars = []
  let x = 0
  for (let i = 0; i < count; i++) {
    hash ^= hash << 13
    hash ^= hash >>> 17
    hash ^= hash << 5
    const value = hash >>> 0
    const width = 1 + (value % 3)
    bars.push({ x, width })
    x += width + 1 + ((value >>> 8) % 2)
  }
  return { bars, width: x }
}

export function seeded(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export const seededRotation = (id: string, max = 3) =>
  (seeded(id) * 2 - 1) * max;

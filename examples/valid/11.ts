function wrap<T extends { id: string }>(value: T) {
  return { value };
}
function mapValues<T, U>(values: readonly T[], project: (value: T) => U): U[] {
  return values.map(project);
}
export const wrapped = wrap({ id: "j1", attempts: 2 });
export const counts = mapValues([wrapped.value], (job) => job.attempts);
console.log(counts.join(","));
export {};

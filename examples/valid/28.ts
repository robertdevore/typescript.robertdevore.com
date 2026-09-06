export function summarize(values: readonly number[]): { total: number } {
  return { total: values.reduce((sum, value) => sum + value, 0) };
}
console.log(JSON.stringify(summarize([2, 3])));
export {};

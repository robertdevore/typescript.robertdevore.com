type Summary = { total: number; failed: number };
function read(summary: Summary): Summary;
function read(summary: Summary, key: keyof Summary): number;
function read(summary: Summary, key?: keyof Summary): Summary | number {
  return key === undefined ? summary : summary[key];
}
export const count = read({ total: 4, failed: 1 }, "total");
console.log(count);
export {};

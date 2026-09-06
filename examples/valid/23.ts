import assert from "node:assert/strict";
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;
function get<T, K extends keyof T>(value: T, key: K): T[K] {
  return value[key];
}
const count = get({ count: 2 }, "count");
export type Check = Expect<Equal<typeof count, number>>;
assert.equal(count, 2);
console.log("runtime and type contract passed");
export {};

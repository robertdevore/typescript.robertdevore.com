type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;
type Each<T> = T extends unknown ? T[] : never;
type Together<T> = [T] extends [unknown] ? T[] : never;
export type CheckEach = Expect<Equal<Each<string | number>, string[] | number[]>>;
export type CheckTogether = Expect<Equal<Together<string | number>, (string | number)[]>>;
type Payload<T> = T extends { ok: true; value: infer V } ? V : never;
export type Value = Payload<{ ok: true; value: number } | { ok: false }>;
console.log(["job", 2].join(": "));
export {};

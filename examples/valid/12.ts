function get<T, K extends keyof T>(value: T, key: K): T[K] {
  return value[key];
}
const job = { id: "j1", attempts: 2 };
export const attempts = get(job, "attempts");
export const phases = ["queued", "running", "done"] as const;
export type Phase = (typeof phases)[number];
console.log(attempts, get(job, "id"));
export {};

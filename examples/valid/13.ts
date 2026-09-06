type Job = { readonly id: string; label: string; attempts: number };
type Patch = Partial<Pick<Job, "label" | "attempts">>;
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
function update(job: Job, patch: Patch): Job {
  return { ...job, ...patch };
}
const job: Mutable<Job> = { id: "j1", label: "Import", attempts: 0 };
console.log(update(job, { attempts: 2 }).attempts);
export {};

export type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
export type JobGetters = Getters<Job>;

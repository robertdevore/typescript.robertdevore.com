declare const jobIdBrand: unique symbol;
export type JobId = string & { readonly [jobIdBrand]: true };
export function parseJobId(value: unknown): JobId {
  if (typeof value !== "string" || !/^job_[a-z0-9]+$/.test(value))
    throw new Error("Invalid job ID");
  // The runtime regex establishes the invariant; TypeScript cannot infer a brand from it.
  return value as JobId;
}
console.log(parseJobId("job_abc"));
export {};

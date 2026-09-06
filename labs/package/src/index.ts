export type Job = Readonly<{ id: string; label: string; attempts: number }>;
export type ParseError = Readonly<{ code: "invalid_job"; message: string }>;
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
export type Summary = Readonly<{ total: number; attempts: number }>;

export function parseJob(input: unknown): Result<Job, ParseError> {
  const fail = (message: string): Result<Job, ParseError> => ({
    ok: false,
    error: { code: "invalid_job", message },
  });
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return fail("Expected an object");
  if (Object.keys(input).some((key) => !["id", "label", "attempts"].includes(key)))
    return fail("Unexpected property");
  if (!("id" in input) || typeof input.id !== "string" || !/^job_[a-z0-9]+$/.test(input.id))
    return fail("Expected id matching job_[a-z0-9]+");
  if (
    !("label" in input) ||
    typeof input.label !== "string" ||
    input.label.trim().length === 0 ||
    input.label.length > 120
  )
    return fail("Expected label of 1–120 characters");
  if (
    !("attempts" in input) ||
    typeof input.attempts !== "number" ||
    !Number.isSafeInteger(input.attempts) ||
    input.attempts < 0
  )
    return fail("Expected nonnegative safe integer attempts");
  return {
    ok: true,
    value: Object.freeze({ id: input.id, label: input.label.trim(), attempts: input.attempts }),
  };
}

export function parseJobs(input: unknown): Result<readonly Job[], ParseError> {
  if (!Array.isArray(input) || input.length > 10000)
    return { ok: false, error: { code: "invalid_job", message: "Expected at most 10000 jobs" } };
  const values: Job[] = [];
  const ids = new Set<string>();
  for (const item of input) {
    const result = parseJob(item);
    if (!result.ok) return result;
    if (ids.has(result.value.id))
      return { ok: false, error: { code: "invalid_job", message: "Duplicate job ID" } };
    ids.add(result.value.id);
    values.push(result.value);
  }
  return { ok: true, value: Object.freeze(values) };
}

export function summarize(jobs: readonly Job[]): Summary {
  const attempts = jobs.reduce((total, job) => total + job.attempts, 0);
  if (!Number.isSafeInteger(attempts))
    throw new RangeError("Attempt total exceeds safe integer range");
  return { total: jobs.length, attempts };
}

export function groupBy<T, K>(values: readonly T[], keyOf: (value: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const value of values) {
    const key = keyOf(value);
    const group = groups.get(key);
    if (group) group.push(value);
    else groups.set(key, [value]);
  }
  return groups;
}

type Job = { id: string; owner?: string; meta: { attempts: number } };
const job: Job = { id: "j1", meta: { attempts: 0 } };
const copy = { ...job };
copy.meta.attempts += 1;
const summary: readonly [string, number] = [job.id, job.meta.attempts];
console.log(summary.join(": "));
export {};

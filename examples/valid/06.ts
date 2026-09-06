interface Identified {
  id: string;
}
interface Job extends Identified {
  label: string;
}
type Outcome = { ok: true; job: Job } | { ok: false; error: string };
function summarize(job: Job) {
  return `${job.id}: ${job.label}`;
}
const job = { id: "j1", label: "Import", owner: "internal" };
const outcome: Outcome = { ok: true, job };
if (outcome.ok) console.log(summarize(outcome.job));
console.log(Object.keys(job).join(","));
export {};

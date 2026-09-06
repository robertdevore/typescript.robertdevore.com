interface Summary {
  total: number;
  attempts: number;
}
function summarize(jobs: readonly { attempts: number }[]): Summary {
  return { total: jobs.length, attempts: jobs.reduce((sum, job) => sum + job.attempts, 0) };
}
console.log(JSON.stringify(summarize([{ attempts: 2 }])));
export {};

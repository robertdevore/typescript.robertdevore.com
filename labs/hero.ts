type Job =
  | { state: "queued"; id: string }
  | { state: "done"; result: string };

function describe(job: Job) {
  if (job.state === "done") {
    return job.result; // narrowed to string
  }
  return `Waiting: ${job.id}`;
}

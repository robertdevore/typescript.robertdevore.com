type Job = { id: string };
type Labeled = Job & { label: string };
const specialized = (job: Labeled) => job.label.toUpperCase();
const handler: (job: Job) => string = specialized;
export {};

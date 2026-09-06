type Job = { id: string };
type OwnedJob = Job & { owner: string };
const consume = (job: Job) => console.log(job.id);
const ownedConsumer: (job: OwnedJob) => void = consume;
ownedConsumer({ id: "j1", owner: "Ada" });
const produce = (): OwnedJob => ({ id: "j2", owner: "Lin" });
const generalProducer: () => Job = produce;
console.log(generalProducer().id);
export {};

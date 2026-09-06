type Job = { id: string; label: string };
interface JobReader {
  find(id: string): Promise<Job | undefined>;
}
async function describe(reader: JobReader, id: string): Promise<string> {
  const job = await reader.find(id);
  return job ? `${job.id}: ${job.label}` : "not found";
}
const memory: JobReader = {
  async find(id) {
    return id === "j1" ? { id, label: "Import" } : undefined;
  },
};
console.log(await describe(memory, "j1"));
export {};

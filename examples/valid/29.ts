interface JobRepository {
  find(id: string): Promise<string | undefined>;
}
const memory: JobRepository = {
  async find(id) {
    return id === "j1" ? "Import" : undefined;
  },
};
console.log(await memory.find("j1"));
export {};

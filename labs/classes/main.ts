class Store<T> {
  #values = new Map<string, T>();
  set(id: string, value: T): void {
    this.#values.set(id, value);
  }
  get(id: string): T | undefined {
    return this.#values.get(id);
  }
}
class JobStore extends Store<{ label: string }> {
  override set(id: string, value: { label: string }): void {
    if (!id.startsWith("job_")) throw new Error("Invalid ID");
    super.set(id, value);
  }
}
const jobs = new JobStore();
jobs.set("job_a", { label: "Import" });
console.log(jobs.get("job_a")?.label);
console.log(Object.getPrototypeOf(jobs) === JobStore.prototype);
const read = () => jobs.get("job_a");
console.log(read()?.label);
export {};

type Verb = "queued" | "finished";
export type EventName = `job:${Verb}`;
type Events = { "job:queued": { id: string }; "job:finished": { id: string; durationMs: number } };
function emit<K extends keyof Events>(name: K, payload: Events[K]) {
  console.log(name, payload.id);
}
emit("job:finished", { id: "j1", durationMs: 12 });
export {};

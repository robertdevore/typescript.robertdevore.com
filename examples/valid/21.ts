import { setTimeout as delay } from "node:timers/promises";
const pending = Promise.resolve().then(() => console.log("microtask"));
console.log("sync");
await pending;
const controller = new AbortController();
controller.abort();
try {
  await delay(10, undefined, { signal: controller.signal });
} catch {
  console.log("cancelled");
}
const [a, b] = await Promise.all([Promise.resolve(2), Promise.resolve("jobs")]);
console.log(a, b);
export {};

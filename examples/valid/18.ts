const counts: Record<string, number> = { queued: 2 };
const running = counts["running"] ?? 0;
console.log(running);
export {};

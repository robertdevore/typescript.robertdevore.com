type State =
  | { kind: "queued" }
  | { kind: "running"; startedAt: number }
  | { kind: "finished"; durationMs: number };
function unreachable(value: never): never {
  throw new Error(`Unexpected state: ${JSON.stringify(value)}`);
}
function format(state: State): string {
  switch (state.kind) {
    case "queued":
      return "waiting";
    case "running":
      return `started ${state.startedAt}`;
    case "finished":
      return `done in ${state.durationMs}ms`;
    default:
      return unreachable(state);
  }
}
console.log(format({ kind: "finished", durationMs: 12 }));
export {};

type State = { kind: "queued" } | { kind: "done"; result: string };
function check(value: never) {
  return value;
}
function format(state: State) {
  if (state.kind === "queued") return "waiting";
  return check(state);
}
export {};

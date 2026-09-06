function makeFormatter(prefix: string, separator = ": ") {
  let calls = 0;
  return (...parts: string[]) => {
    calls += 1;
    return `${prefix}${separator}${parts.join(" ")} (#${calls})`;
  };
}
const format = makeFormatter("job");
console.log(format("ready"));
console.log(format("done", "today"));
export {};

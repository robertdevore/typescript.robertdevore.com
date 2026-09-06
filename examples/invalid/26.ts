function read(value: { total: number }, key: "total"): number {
  return value[key];
}
read({ total: 4 }, "missing");
export {};

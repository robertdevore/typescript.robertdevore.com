function get<T, K extends keyof T>(value: T, key: K): T[K] {
  return value[key];
}
get({ id: "j1" }, "missing");
export {};

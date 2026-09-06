export const limits = { small: 2, large: 8 } satisfies Record<string, number>;
export const routes = ["jobs", "health"] as const;
console.log(limits.small, routes[0]);
export {};

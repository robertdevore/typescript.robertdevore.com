type Patch = Partial<Pick<{ id: string; attempts: number }, "attempts">>;
const patch: Patch = { id: "j2" };
export {};

declare const brand: unique symbol;
type JobId = string & { readonly [brand]: true };
const id: JobId = "job_abc";
export {};

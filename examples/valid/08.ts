type Identified = { id: string };
function identify(value: Identified) {
  return value.id;
}
const job = { id: "j1", internal: true };
console.log(identify(job));
console.log(JSON.stringify(job));
export {};

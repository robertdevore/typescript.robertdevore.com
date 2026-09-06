const source = { attempts: 0 };
const view: Readonly<typeof source> = source;
source.attempts = 3;
console.log(view.attempts);
export function requireButton(root: Document): HTMLButtonElement {
  const element = root.querySelector("#run");
  if (!(element instanceof HTMLButtonElement)) throw new Error("Expected run button");
  return element;
}
export {};

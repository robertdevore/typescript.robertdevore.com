type Transport = (url: string, init?: RequestInit) => Promise<Response>;
async function readId(transport: Transport, signal: AbortSignal): Promise<string> {
  const response = await transport("https://example.invalid/jobs/j1", { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const value: unknown = await response.json();
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    typeof value.id !== "string"
  )
    throw new Error("Invalid payload");
  return value.id;
}
const fixture: Transport = async () => Response.json({ id: "j1" });
console.log(await readId(fixture, new AbortController().signal));
export {};

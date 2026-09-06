import { parseJobs, summarize } from "@typescript-course/job-summary";
import type { Summary } from "@typescript-course/job-summary";
export class UpstreamError extends Error {
  constructor(
    public readonly code: "status" | "payload" | "size" | "transport",
    message: string,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}
export async function readSummary(
  url: URL,
  signal: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<Summary> {
  let response: Response;
  try {
    response = await fetcher(url, {
      signal,
      redirect: "error",
      headers: { accept: "application/json" },
    });
  } catch (cause: unknown) {
    if (signal.aborted) throw cause;
    throw new UpstreamError("transport", "Upstream unavailable");
  }
  if (!response.ok) {
    await response.body?.cancel();
    throw new UpstreamError("status", `Upstream returned ${response.status}`);
  }
  if (!response.body) throw new UpstreamError("payload", "Missing body");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      total += part.value.byteLength;
      if (total > 1024 * 1024) {
        await reader.cancel();
        throw new UpstreamError("size", "Upstream payload exceeds 1 MiB");
      }
      chunks.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }
  let raw: unknown;
  try {
    raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new UpstreamError("payload", "Invalid JSON");
  }
  const result = parseJobs(raw);
  if (!result.ok) throw new UpstreamError("payload", result.error.message);
  try {
    return summarize(result.value);
  } catch {
    throw new UpstreamError("payload", "Invalid summary total");
  }
}

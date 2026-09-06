export type Config = Readonly<{ port: number; upstream: URL; timeoutMs: number }>;
export function parseConfig(env: Record<string, string | undefined>): Config {
  const rawPort = env["PORT"] ?? "3100";
  if (!/^\d+$/.test(rawPort)) throw new Error("PORT must be an integer");
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT must be between 1 and 65535");
  const rawUpstream = env["UPSTREAM_URL"];
  if (!rawUpstream) throw new Error("UPSTREAM_URL is required");
  const upstream = new URL(rawUpstream);
  if (!["http:", "https:"].includes(upstream.protocol) || upstream.username || upstream.password)
    throw new Error("UPSTREAM_URL must use HTTP(S) without embedded credentials");
  // The operator controls this fixed URL; request input cannot choose an upstream target.
  return { port, upstream, timeoutMs: 2000 };
}

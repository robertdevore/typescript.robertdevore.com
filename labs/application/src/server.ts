import { createServer } from "node:http";
import type { Server } from "node:http";
import type { Config } from "./config.js";
import { readSummary } from "./client.js";
export type Logger = (event: string, context: Record<string, string | number | boolean>) => void;
export function createApplication(
  config: Config,
  log: Logger,
): { server: Server; stop: () => Promise<void> } {
  let stopping = false;
  const controllers = new Set<AbortController>();
  const server = createServer((request, response) => {
    const respond = (status: number, body: unknown) => {
      if (!response.destroyed && !response.writableEnded) {
        response.writeHead(status, {
          "content-type": "application/json; charset=utf-8",
          "x-content-type-options": "nosniff",
        });
        response.end(JSON.stringify(body));
      }
    };
    if (stopping) {
      respond(503, { error: "shutting_down" });
      return;
    }
    if (request.method !== "GET") {
      respond(405, { error: "method_not_allowed" });
      return;
    }
    if (request.url === "/health") {
      respond(200, { ok: true });
      return;
    }
    if (request.url !== "/summary") {
      respond(404, { error: "not_found" });
      return;
    }
    if (controllers.size >= 8) {
      respond(503, { error: "busy" });
      return;
    }
    const controller = new AbortController();
    controllers.add(controller);
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
    const onClose = () => {
      if (!response.writableEnded) controller.abort();
    };
    response.on("close", onClose);
    void readSummary(config.upstream, controller.signal)
      .then((summary) => {
        respond(200, summary);
        log("summary", { jobs: summary.total });
      })
      .catch(() => {
        respond(controller.signal.aborted ? 504 : 502, {
          error: controller.signal.aborted ? "cancelled_or_timeout" : "upstream_failure",
        });
        log("upstream_failure", { cancelled: controller.signal.aborted });
      })
      .finally(() => {
        clearTimeout(timeout);
        response.off("close", onClose);
        controllers.delete(controller);
      });
  });
  server.headersTimeout = 5000;
  server.requestTimeout = 5000;
  let stopPromise: Promise<void> | undefined;
  function stop(): Promise<void> {
    if (stopPromise) return stopPromise;
    stopping = true;
    for (const controller of controllers) controller.abort();
    stopPromise = new Promise((resolve, reject) => {
      const deadline = setTimeout(() => server.closeAllConnections(), 3000);
      server.close((error) => {
        clearTimeout(deadline);
        if (error) reject(error);
        else resolve();
      });
      server.closeIdleConnections();
    });
    return stopPromise;
  }
  return { server, stop };
}

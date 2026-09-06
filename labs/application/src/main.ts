import { parseConfig } from "./config.js";
import { createApplication } from "./server.js";
const log = (event: string, context: Record<string, string | number | boolean>) =>
  console.log(JSON.stringify({ event, ...context }));
try {
  const config = parseConfig(process.env);
  const app = createApplication(config, log);
  app.server.on("error", () => {
    log("server_error", {});
    process.exitCode = 1;
  });
  app.server.listen(config.port, "127.0.0.1", () => log("listening", { port: config.port }));
  const shutdown = () => {
    void app
      .stop()
      .then(() => log("stopped", {}))
      .catch(() => {
        log("shutdown_failed", {});
        process.exitCode = 1;
      });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
} catch (error: unknown) {
  // Configuration errors contain field names and constraints, never the environment dump.
  console.error(error instanceof Error ? error.message : "Startup failed");
  process.exitCode = 1;
}

import { createServer } from "node:http";
const server = createServer((_request, response) => {
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify([{ id: "job_a", label: "Import", attempts: 2 }]));
});
server.listen(3101, "127.0.0.1", () => console.log("Fixture listening on 127.0.0.1:3101"));
process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());

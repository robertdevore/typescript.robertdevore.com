{"number": 25, "slug": "node-application", "title": "Building a Node.js application", "stage": 3, "description": "Own configuration, filesystem, HTTP, logging, and graceful process lifecycle."}

## Where you are

You can build a validated client and test it. An application adds ownership: who opens resources, who closes them, where configuration becomes trusted, and which boundary decides process success or failure?

## Mental model

Keep the domain independent of the process. Configuration enters once, is parsed into a concrete value, and is passed to application services. Adapters own filesystem and HTTP details. The process entry point assembles those pieces and owns shutdown.

## JavaScript and Node reality

Environment values are strings or absent. A port needs numeric validation and a legal range; an empty string should not quietly become port zero. Filesystem calls can fail for missing paths, permissions, or partial storage conditions. Async resources outlive the function that created them unless explicitly closed.

Signals request lifecycle changes. SIGTERM and SIGINT should stop new work, cancel in-flight work where possible, close the HTTP listener, flush necessary state, and terminate within a deadline. Calling process.exit immediately can truncate output or writes. Setting process.exitCode permits ordinary cleanup, but leaked resources can still keep the process alive.

## TypeScript model

Describe a parsed Config separately from process.env. An application service should receive that Config and narrow adapter interfaces rather than importing mutable globals. Promises describe completion but cannot guarantee cleanup; finally and explicit close methods do that.

## Working example

{{example}}

{{output}}

The temporary directory is cleaned in finally. Parsing the file returns unknown before the program reads a field. The longer application lab builds an HTTP service around this same pattern with typed configuration, a bounded upstream client, structured logs, and graceful shutdown.

## Type-checker drill

{{invalid}}

{{diagnostic}}

An environment variable is not a definite number. Validate it at startup and fail with a clear configuration error before opening the server. A number assertion neither converts the string nor proves its range.

## Classes at an adapter boundary

The comparison client uses an Error subclass to attach a stable category. In JavaScript, a class is a runtime constructor: new creates an instance, methods live on its prototype, and extends links that prototype to the base class. A subclass constructor calls super before using this. An instanceof Error check tests that runtime relationship; an interface could not provide it. TypeScript checks fields and method contracts around this existing JavaScript mechanism. Prefer a plain result object when you do not need exception behavior. Lesson 32 examines class ownership, private fields, and generic classes in more depth.

## Application lab

Work in `labs/application`. Build the shared package first, then the application. Run it with an explicit upstream base URL and a port. Use a loopback fixture API while learning so tests do not depend on network availability. The application exposes a health route and a validated job summary route; it uses only Node APIs initially.

Its logger writes JSON events with event names and bounded context. It never logs bearer headers or raw environment contents. The HTTP boundary translates errors into status codes without exposing stack traces. A timeout bounds upstream work, and a byte limit bounds response memory.

## Runtime drill

Start the service with an invalid port, request an invalid upstream payload, and send SIGTERM during a delayed request. Verify no new requests are admitted after shutdown begins and the process settles within its deadline. Restart and confirm persistence fixtures remain readable. Type-checking cannot detect a forgotten server.close call.

## Professional pattern

Use dependency injection for resources that need alternate ownership or controlled tests, not for every local helper. Make shutdown idempotent because more than one signal can arrive. Treat an in-memory cache as a cache, not durable persistence. Document operational limits before calling a sample deployment production-ready.

## Exercise

Complete [Build 3: the application](/builds/application/) with a configuration parser, external API adapter, health endpoint, bounded logging, and a shutdown deadline. Add integration tests for malformed JSON, invalid domain values, upstream non-OK status, oversized response, and signal handling. Explain the resource owner for every server, timer, file handle, and controller.

## Checkpoint

- You parse configuration before startup side effects.
- You can trace error reporting to one boundary.
- You close resources and bound shutdown time.
- You can run the application against a deterministic local fixture.

## Sources

[Node process](https://nodejs.org/docs/latest-v24.x/api/process.html), [HTTP](https://nodejs.org/docs/latest-v24.x/api/http.html), and [filesystem](https://nodejs.org/docs/latest-v24.x/api/fs.html).

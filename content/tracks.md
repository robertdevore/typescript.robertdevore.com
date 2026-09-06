These are optional project tracks after the core course. They extend the completed foundation; they are not prerequisites and do not replace the capstone. Choose one that matches software you actually need to build.

## Backend TypeScript

Extend the capstone with an authenticated HTTP boundary, transactional database storage, a queue, and a separate worker process. Keep transport DTOs separate from domain transitions. Test authorization on every job read and mutation, transaction failure, duplicate delivery, and worker restart. Document at-least-once versus exactly-once claims honestly.

Begin with [Node application](/lessons/node-application/), [async](/lessons/async/), and [architecture](/lessons/architecture/). Evaluate current database and queue drivers using their own maintained documentation at implementation time. Success means a second worker can restart without corrupting ownership or silently duplicating an unsafe operation.

## Frontend TypeScript

Build a browser dashboard for the capstone. Start with the [DOM lab](/labs/browser/), then add a framework only when its current typing model has been reviewed. Model loading, empty, success, failure, and cancelled requests as correlated states. Parse HTTP responses and cancel stale requests; JSX types do not validate remote data.

Test keyboard navigation, focus restoration, empty lists, invalid API responses, and out-of-order request completion. If using React, study current event, ref, state, and component typing from its official docs rather than copying obsolete generic component recipes. Success includes accessible behavior and stale-response protection, not merely a typed component tree.

## Library engineering

Expand [package publishing](/lessons/publishing/) into a real support matrix. Test ESM consumers, any intentionally supported CommonJS consumers, the compiler support floor, package exports, declaration navigation, and browser bundler assumptions. Contribute a precise declaration correction to an owned library or DefinitelyTyped after reproducing the actual runtime API.

Success means the tarball works from each advertised environment and errors remain readable for an ordinary consumer. Avoid dual output unless actual users need it.

## Type-level TypeScript

Explore recursive helpers, type parsers, and sophisticated builders in an isolated package. Compare each abstraction with a runtime or concrete-contract alternative. Measure compiler cost and test inference, never, unknown, unions, and invalid calls.

Start from [conditional types](/lessons/conditional-types/) and [advanced design](/lessons/advanced-design/). Type challenges can sharpen understanding, but solving puzzles is not the same as building maintainable application software. Success is a useful public API with understandable diagnostics and measured cost.

## Tooling & compiler APIs

Build a small code generator or source-analysis tool. Confirm the current native API release status before selecting an integration. A stable CLI boundary may be preferable while an embedding API changes. Understand parser, AST, symbols, checker, emit, and LSP responsibilities through [compiler tooling](/lessons/compiler-tooling/).

Test malformed input, generated output compilation, stable formatting, source-map expectations, and incremental invalidation. Success means reproducible generated artifacts and a documented compatibility boundary, not dependence on undocumented compiler internals.

## Monorepo & enterprise TypeScript

Split the capstone into owned packages with explicit dependency direction, release boundaries, and environment-specific configs. Use [workspaces](/lessons/workspaces/) and [performance](/lessons/performance/) to compare clean, incremental, and affected-package CI builds on current TypeScript.

Plan a gradual JavaScript migration with checkJs and tested boundary contracts. Track shared configuration, compiler upgrade policy, generated types, and package ownership. Success means a clean independent consumer works and teams can change one domain without importing a giant global type model everywhere.

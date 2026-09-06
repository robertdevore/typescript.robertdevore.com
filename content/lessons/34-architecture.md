{"number": 34, "slug": "architecture", "title": "Architecture for large TypeScript systems", "stage": 5, "description": "Separate domain rules, application services, and adapters with clear dependencies."}

## Where you are

You can reason about both type power and its limits. Architecture now organizes where that reasoning belongs. A shared types folder is not an architecture, and a generic framework cannot decide domain ownership for you.

## Mental model

Domain code describes rules and valid transitions. Application services coordinate use cases. Adapters translate between those rules and external systems. Dependencies point toward the owned contracts, while the entry point supplies concrete implementations.

## JavaScript reality

Import graphs execute module initialization. Cycles can expose partially initialized values, cause runtime errors, or make startup order significant. Type-only imports erase runtime edges but do not automatically make conceptual coupling healthy. A global singleton can hide resource ownership even if every property is typed.

## TypeScript model

Small interfaces express capabilities a service needs. A storage port can return a domain value or absence without exposing SQL row types. DTOs describe external transfer contracts and may need different fields and versioning from domain objects. Derive types where they genuinely share ownership; keep separate schemas where their changes have different consequences.

Avoid universal entities imported by every package. An authentication identity, a database user row, and a public author card can be different models even if all carry an ID. A narrowly owned contract often scales better than one elaborate conditional type adapting a global model to every context.

## Working example

{{example}}

{{output}}

The service knows how to label a job and depends on a small reader capability. The memory adapter satisfies that structure without inheritance. An HTTP or database adapter can perform parsing before returning the same trusted domain value.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The port promises a string label. The storage representation must be translated at its adapter boundary. Widening the domain to accommodate one accidental numeric label spreads uncertainty to every consumer.

## Runtime drill

Make the adapter throw after an I/O failure. Decide where the application translates that error, who logs it, and whether retry is safe. Then load malformed persisted data and prove that the adapter rejects it rather than asserting it into the domain model. Interfaces describe the outcome; adapters must establish it.

## Professional pattern

Keep public entry points explicit in package exports and avoid sibling deep imports. Track dependency direction in review or a repository rule. Use one application service per coherent use case, not a class for every function. Make resource owners visible in construction and shutdown APIs.

For the capstone, separate job definitions from execution attempts. Retrying creates a new attempt, not a magical rewrite of an old success. Keep cancellation state, persistence revision, and stale-completion checks in domain operations. This prevents a late callback from silently overwriting a newer terminal state.

## Exercise

Draw the capstone's package and runtime boundaries in a small diagram. Implement a job reader port and two adapters, one in memory and one persisted. Test the same service contract against both. Add a dependency rule preventing domain imports from HTTP or filesystem modules. Explain where validation, authorization, and error translation belong.

## Checkpoint

- You can name the owner of each contract.
- You keep transfer models and domain rules distinct when needed.
- You can swap an adapter without rewriting the use case.
- You avoid global types and hidden resource singletons.

## Sources

[TypeScript modules](https://www.typescriptlang.org/docs/handbook/modules/theory.html) and [project references](https://www.typescriptlang.org/docs/handbook/project-references.html).

{"number": 33, "slug": "runtime-safety", "title": "Type safety versus runtime safety", "stage": 5, "description": "Recognize deliberate unsoundness and protect DOM, JSON, arrays, mutation, and declarations."}

## Where you are

You have several tools for stronger static contracts. Now examine their limits. TypeScript deliberately balances useful JavaScript compatibility with checking; it does not promise a fully sound proof that every accepted program is safe.

## Mental model

Treat a type as knowledge under assumptions. Ask where those assumptions came from, whether mutation can invalidate them, and whether the next boundary shares them. Compile-time trust and runtime evidence are different resources.

## JavaScript reality

External JSON can lie about shape, array indexing can return undefined, DOM selectors can return null or a different kind of element, and mutable aliases can invalidate earlier observations. A third-party declaration can describe a function differently from its implementation. Any and assertions can bypass checks entirely.

Security adds requirements the type system cannot infer: authentication, authorization, origin restrictions, size limits, injection resistance, and resource budgets. A string branded as a JobId does not prove the requester owns that job. A typed URL can still target a private network if accepted from an untrusted caller.

## TypeScript model

noUncheckedIndexedAccess makes many dynamic lookups explicitly optional. Readonly inputs limit mutation through that view. Unknown boundaries require narrowing. None is a universal proof: a mutable alias can still change data, and a dishonest predicate can manufacture knowledge.

Browser code should narrow actual DOM elements. A selector's generic type parameter can merely assert the expected element shape; check instanceof HTMLButtonElement when behavior depends on that constructor. Null checking alone only proves an element exists, not that it is the expected kind.

## Working example

{{example}}

{{output}}

The runtime output demonstrates alias mutation despite a readonly view. The exported browser function compiles against DOM declarations and is executed by the browser lab, not invoked in Node. Its checked constructor prevents a paragraph with the expected ID from being treated as a button.

## Type-checker drill

{{invalid}}

{{diagnostic}}

A selector can fail. Check its result and constructor before reading button-specific properties. A non-null assertion would hide the absent-element case, and a generic selector annotation would not validate the constructor.

## Runtime drill

Open `/labs/browser/` and inspect the source in the repository. Change its button into a paragraph with the same ID and rerun. The guard reports the mismatch instead of relying on a cast. The browser verification tests the normal behavior and the malformed-element case. The separate unsafe-boundary tests execute false JSON assertions and mutable-array covariance in controlled fixtures.

## Professional pattern

Put validation where trust changes and keep owned values from uncontrolled mutation. Favor explicit output projection for disclosure boundaries. Audit declaration assumptions at dependency upgrades. Treat no compiler errors as one release gate among behavior, security, and operational checks.

## Exercise

Audit the application for five assumptions: external shape, optional lookup, mutable alias, DOM element kind, and third-party declaration correctness. For each, write a failing runtime fixture and the smallest useful guard or ownership change. Label which failures the compiler catches and which remain runtime responsibilities.

## Checkpoint

- You can explain deliberate unsoundness with a concrete example.
- You validate element kinds and external data.
- You understand readonly's aliasing limit.
- You do not confuse branded identity with authorization.

## Sources

[TypeScript design goals](https://github.com/microsoft/TypeScript/wiki/TypeScript-Design-Goals), [type compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html), and [DOM manipulation](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html).

{"number": 27, "slug": "declaration-files", "title": "Declaration files", "stage": 4, "description": "Read, write, and test declaration files that describe JavaScript APIs."}

## Where you are

Your public API deserves a stable description. Declaration files carry that description to TypeScript consumers even when the package ships JavaScript. They are a contract about existing runtime exports, not a mechanism for creating them.

## Mental model

JavaScript supplies the values. Declarations describe their types. A package can have perfect-looking declarations and missing or incompatible runtime exports. Verify both halves using an installed consumer.

## JavaScript reality

An ambient declaration such as a declared global tells the checker that something exists elsewhere. It does not allocate it. If no host or script supplies the promised global, execution still throws a ReferenceError. The same risk applies when declaring a third-party module that does not actually export the named function.

## TypeScript model

`declaration` emits .d.ts files alongside JavaScript, while emitDeclarationOnly produces only declarations. Declaration maps can improve source navigation when corresponding source information is available. Review emitted types for accidental private dependencies or overly broad inferred unions.

A declaration file with top-level imports or exports is a module. A script-like declaration file can contribute globals. Module augmentation extends an existing module's declarations and does not manufacture runtime behavior. Global augmentation inside a module uses an explicit declare global block. Be precise about that boundary to avoid unintentionally changing the whole program.

DefinitelyTyped supplies community-maintained declarations for libraries that do not ship their own. Match runtime and declaration versions, and remember the declarations can be wrong. Prefer owned declarations shipped with an owned library so release changes stay coordinated.

## Working example

{{example}}

{{output}}

Verification emits the parser's declarations. Inspect `.work/examples/27.d.ts` after running the example checks. The function body is absent, while the return union remains a public contract. Compare the .js file to see where parsing actually happens.

## Type-checker drill

{{invalid}}

{{diagnostic}}

A declaration describes a string result, and a numeric consumer cannot assume otherwise. But a lying declaration could still compile at the call site and fail at runtime. Tests of actual JavaScript exports remain necessary.

## Runtime drill

In an isolated file, declare a global function and call it without providing an implementation. The checker accepts the declaration; execution fails. Then provide the implementation through a real imported JavaScript module and a matching .d.ts file. Test both the existence and behavior of the exported function.

## Professional pattern

Generate declarations from TypeScript where possible. Hand-author declarations for JavaScript boundaries after inspecting actual runtime behavior, including callable objects, constructors, optional properties, overloads, and module format. Keep a small consumer fixture testing imports and negative calls. Avoid broad ambient wildcard modules that reduce all imports to any.

## Exercise

Write a tiny JavaScript module that parses a job label and returns either a label or null. Describe it with a module declaration file, then consume it from strict TypeScript. Change the runtime implementation to return a number and prove that a runtime test catches the declaration mismatch. Finally migrate it to TypeScript and compare emitted declarations with your original contract.

## Checkpoint

- You know .d.ts cannot create a function or global.
- You distinguish modules, globals, and augmentation.
- You can inspect emitted public declarations.
- You test both declared and runtime exports.

## Sources

[Declaration-file introduction](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html), [library structures](https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html), and [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped).

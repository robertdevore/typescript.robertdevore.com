{"number": 31, "slug": "javascript-migration", "title": "Migrating JavaScript safely", "stage": 4, "description": "Add checked boundaries and JSDoc incrementally without making a rewrite the prerequisite."}

## Where you are

You can maintain a strict TypeScript package. Existing JavaScript code may already deliver value and have useful tests. Migration should improve its contracts without simultaneously rewriting its behavior and architecture.

## Mental model

Adoption is a sequence of smaller boundaries: check selected JavaScript, describe public contracts, validate inputs, convert owned modules, and tighten policy. A file extension change is not evidence that the program became safer.

## JavaScript reality

The original runtime semantics remain. Closures, coercion, prototype mutation, and module loading do not disappear when a file becomes .ts. Preserve behavior with tests before changing annotations. Legacy patterns that rely on dynamic property creation may need explicit models, not merely renamed files.

## TypeScript model

allowJs admits JavaScript files into a project. checkJs enables diagnostics in those files; per-file ts-check can start more narrowly. JSDoc expresses parameter types, returns, typedefs, imports, and generic relationships without changing executable syntax. TypeScript can generate declarations from checked JavaScript with declaration and emitDeclarationOnly.

TypeScript 7's JavaScript analysis differs from older Closure-style patterns. The current changes document lists unsupported or changed JSDoc forms. Prefer standard TypeScript-like JSDoc signatures and class syntax instead of assuming every historical annotation is still interpreted. Validate a representative legacy module before committing to a bulk migration tool.

## Working example

{{example}}

{{output}}

This is the final TypeScript form of a small parsing boundary. The runnable JavaScript migration fixture in the labs uses JSDoc, checkJs, and declaration-only emit so you can compare before conversion.

## A gradual configuration

Start with a bounded source directory and no accidental overwrite:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "strict": true,
    "module": "NodeNext",
    "types": ["node"],
    "declaration": true,
    "emitDeclarationOnly": true,
    "rootDir": "src",
    "outDir": "types"
  },
  "include": ["src/**/*.js"]
}
```

Generated declarations belong in a separate output directory. Review them as public API, not as unquestionable truth about every dynamic runtime path.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The migrated helper promises numeric input. Fix its callers or parse their text at the boundary. Broadening the function to any would preserve the original ambiguity instead of resolving it.

## Runtime drill

Test the old and new functions with valid numbers, numeric strings, empty strings, and undefined. Identify any changed coercion behavior before calling it an improvement. Make the policy change explicit and version it when it affects external consumers.

## Professional pattern

Migrate stable leaves and high-risk boundaries first, then work inward through dependents. Track intentional temporary escape hatches locally with owners and removal criteria. A temporary strictness compromise can be appropriate for a large migration, but do not present it as the finished course standard. Keep conversion commits small enough that behavior changes are reviewable.

## Exercise

Take a small JavaScript module with tests. Add JSDoc and checkJs, emit declarations, and consume it from TypeScript. Fix one boundary bug separately from the mechanical conversion. Then rename the implementation to .ts and compare runtime tests and public declarations. Write a migration note explaining remaining dynamic assumptions and their owners.

## Checkpoint

- You can adopt checking before renaming every file.
- You know allowJs and checkJs solve different problems.
- You can emit declarations from JavaScript safely.
- You separate behavior changes from conversion work.

## Sources

[JavaScript projects](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html), [declarations from JavaScript](https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html), and [native compiler changes](https://github.com/microsoft/typescript-go/blob/main/CHANGES.md).

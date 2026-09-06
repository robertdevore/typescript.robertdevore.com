{"number": 19, "slug": "modules", "title": "ESM, CommonJS & module resolution", "stage": 3, "description": "Follow an import from TypeScript source to the code your runtime loads."}

## Where you are

You can explain tsconfig choices. Modules demand the same separation at package boundaries. A successful editor import is only one part of the story; emitted JavaScript must also load on the intended host.

## Mental model

Trace four layers: source syntax, TypeScript resolution, emitted JavaScript, and runtime resolution. An import can be valid at one layer and broken at another. Diagnose from the actual deployed file and its nearest package.json rather than repeatedly toggling compiler flags.

## JavaScript reality

ESM uses import/export and live bindings. CommonJS uses require and module.exports. In Node, the package type field and explicit extensions influence how files are interpreted. `.mjs` is ESM and `.cjs` is CommonJS; `.mts` and `.cts` express the corresponding TypeScript intent. Ordinary `.js` output belongs to its package scope, so moving it across a package boundary can change interpretation.

Node ESM generally requires explicit extensions on relative file imports. A source import ending `.js` can resolve to its TypeScript source during checking and remain `.js` for Node after emit. A bundler may support extensionless resolution and rewrite or combine modules; that convenience is not a Node runtime guarantee.

ESM can consume CommonJS with interoperability rules, but named exports may depend on Node's static analysis of the CommonJS file. Modern Node can require some synchronous ESM graphs, yet top-level await and export shapes complicate that direction. Test the exact supported Node versions instead of repeating the old absolute claim that require can never load ESM.

## TypeScript model

Use NodeNext for a Node application whose emitted files run directly in Node. Its behavior evolves with supported Node semantics; pin the compiler and test your runtime support floor. Bundler resolution belongs to a bundler pipeline, commonly with module preserve or esnext. Do not use it simply to make a Node import error disappear.

Type-only imports and exports are erased. With verbatimModuleSyntax, write those intentions explicitly and keep runtime imports as runtime imports. A type-only import cannot supply a constructor used by instanceof or a function called at execution.

`paths` helps the checker resolve names; it does not rewrite emitted imports. Node package `imports` provides private `#` mappings with runtime meaning. Package `exports` defines allowed public entry points and can distinguish types and runtime conditions. Export targets must correspond to real shipped files.

## Working example

The example imports a real Node runtime function. The package lab adds a separate library, declaration resolution, and consumer tests.

{{example}}

{{output}}

Inspect the emitted import: it still references `node:path`. Now add two source files in your own lab and import the helper with a `.js` extension. Build and execute the output after deleting all previous output.

## Type-checker drill

{{invalid}}

{{diagnostic}}

A type-only import has no runtime binding. Use a normal import for values you invoke. Conversely, use import type for declarations that have no runtime use. Do not mechanically convert every import to one form.

## Package map exercise

Start an ESM library with this public map after producing the named files:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "types": "./dist/index.d.ts",
  "files": ["dist"]
}
```

Place the types condition before runtime conditions. This contract advertises ESM consumption; it does not promise every CommonJS consumer a working require path. The old module field is a bundler convention, not Node's public exports mechanism.

## Runtime drill

Create a paths alias that checks, then run the emitted code in plain Node. Observe the unresolved specifier. Replace it with a relative `.js` import or a runtime-backed package imports mapping. Test from the installed tarball as well as from the repository, because workspace resolution can conceal missing output.

## Professional pattern

Choose one module delivery strategy and publish its compatibility envelope. ESM-only is often simpler than dual output; dual packages require deliberate identity, condition, declaration-format, and consumer tests. Do not ship two separately initialized registries or caches accidentally. Run `--traceResolution` for a focused import failure and inspect the selected package condition.

## Checkpoint

- You can trace all four import layers.
- You know why a source `.js` specifier can target `.ts` while checking.
- You separate NodeNext from bundler assumptions.
- You can explain exports, imports, and type-only bindings.

## Sources

[TypeScript module theory](https://www.typescriptlang.org/docs/handbook/modules/theory.html), [module reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html), and [Node 24 packages](https://nodejs.org/docs/latest-v24.x/api/packages.html).

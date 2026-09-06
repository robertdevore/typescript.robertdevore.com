{"number": 29, "slug": "workspaces", "title": "Workspaces & project boundaries", "stage": 4, "description": "Use package graphs and current compiler capabilities to scale without hiding dependencies."}

## Where you are

You have a library and an application consuming it. A workspace simplifies local coordination, but convenience can mask missing declarations or accidental source imports. Package boundaries must remain real release boundaries.

## Mental model

The package manager owns installation and links. TypeScript project references describe build dependencies. Runtime imports load installed exports. CI schedules checks and releases. These graphs overlap but are not the same graph.

## JavaScript and package reality

A workspace link can expose source files that will not exist in a published archive. Root dependencies can accidentally satisfy undeclared package dependencies. Test packed consumers outside the workspace to expose both mistakes. Imports should follow package ownership, not arbitrary relative paths into a sibling's src directory.

## TypeScript model

Project references let a composite project depend on another project's declaration output. Build mode with `tsc -b` understands ordering and incremental state. A clean build and an incremental build exercise different behavior; both matter in CI and local development.

TypeScript 7 can parallelize checking within a project and project-reference builds across the graph. Its checkers and builders controls trade CPU and memory; multiplying both can oversubscribe a small CI machine. Do not preserve old workarounds without measuring the native compiler. References remain useful for ownership and dependency boundaries even when raw checking becomes faster.

## Working example

{{example}}

{{output}}

The small repository interface is independent of filesystem details. The package lab shows the same principle across real package boundaries rather than only within one file.

## Reference layout

Use a solution config containing files and references, with each referenced package owning its source, output, and composite setting:

```json
{
  "files": [],
  "references": [{ "path": "./packages/domain" }, { "path": "./packages/application" }]
}
```

The application project's own references must also record its domain dependency. A solution's list alone is not the dependency edge. Build with `npx tsc -b`, inspect outputs, change the domain contract, and observe the required rebuild.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The adapter returns a number where the domain contract promises text. Fix the adapter boundary, not the whole domain to accommodate one storage representation. This is the value of a small explicit interface across packages.

## Runtime drill

Remove a dependency from one package's manifest while keeping it at the workspace root. See whether local imports still work. Pack and install the package in isolation to expose the missing declaration. Restore the dependency in its actual owner.

## Professional pattern

Share policy only where environments agree. Keep Node globals out of browser packages and avoid one giant ambient type environment for the entire repository. Enforce dependency direction through imports and manifests. Cache builds using inputs that include compiler, lockfile, and config; an incomplete cache key can reuse incompatible declarations.

## Exercise

Create domain, CLI, and browser-summary packages. Give each an independent config and explicit dependencies. Add references where declaration-based builds help. Verify a clean build, a no-change incremental build, and a domain-change rebuild. Measure before selecting parallelism settings. Test the domain tarball outside the workspace.

## Checkpoint

- You distinguish workspace links from published dependencies.
- You can describe a project-reference edge.
- You avoid globally shared environment types.
- You measure native compiler behavior before tuning.

## Sources

[Project references](https://www.typescriptlang.org/docs/handbook/project-references.html), [npm workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces), and [TypeScript 7 parallel builds](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).

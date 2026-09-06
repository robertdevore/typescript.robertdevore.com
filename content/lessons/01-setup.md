{"number": 1, "slug": "setup", "title": "Modern TypeScript setup", "stage": 1, "description": "Own the complete path from source file to checked code to running JavaScript."}

## Where you are

You can already write a small program in some language. You do not need to know npm, JavaScript modules, or compiler internals. This lesson gives every later experiment a reproducible home. Allow an hour for installation and deliberately breaking the first program.

## Why this matters

An editor showing no errors is not a release check. Editors can use a different compiler version, or put a file into an inferred project with different settings. A reliable workflow has a local compiler, committed configuration, a lockfile, and an explicit runtime command.

## Mental model

There are three artifacts: your `.ts` source, the checker's diagnostics, and emitted `.js` files. Checking and emitting are separate capabilities. Node executes JavaScript; TypeScript checks the relationships it can establish before execution. Types do not inspect tomorrow's network response.

## JavaScript reality

Node is a JavaScript runtime with filesystem, process, and networking APIs. npm is a package manager distributed with Node; it installs dependencies and runs scripts. Neither is the TypeScript language. Use the supported Node 24 LTS line for these labs; this edition was exercised on Node 24.20.0. A browser is another JavaScript host with different globals.

## Install a local toolchain

Install Node from its official distribution for your operating system, reopen your terminal, and check `node --version` and `npm --version`. Use your preferred editor; enable its TypeScript support and check which workspace compiler it selects. VS Code's TypeScript 7 extension uses the native LSP server. An older editor integration may still use the JavaScript implementation. An LSP transports diagnostics, navigation, and completion requests; it does not execute your application.

Create an empty project:

```sh
mkdir first-typescript
cd first-typescript
npm init -y
npm pkg set type=module
npm install --save-dev --save-exact typescript@7.0.2 @types/node@24
mkdir src
```

Save this configuration in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["node"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "noEmitOnError": true,
    "sourceMap": true,
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"]
}
```

`target` selects an output syntax baseline; it installs no polyfills. `lib` describes built-ins available to the checker. `types` explicitly includes Node's global declarations. `NodeNext` models Node's module rules; `type=module` makes these ordinary files ESM. `rootDir` and `outDir` control output placement. `strict` enables a family of checks; the indexing and optional-property flags above are additional policies. We unpack these choices in lesson 18.

## Working example

Save the following as `src/index.ts`. The extra empty export makes the example a module when copied elsewhere.

{{example}}

```sh
npx tsc --noEmit
npx tsc
node --enable-source-maps dist/index.js
```

{{output}}

`--noEmit` checks without producing JavaScript. The second command emits; the third runs it. Inspect `dist/index.js`: the parameter annotation has disappeared. Set a debugger breakpoint in the TypeScript source and enable source maps to relate generated execution back to the original file.

## Type-checker drill

Predict whether JavaScript would permit the call below, then check it in place of the working example. This is an intentionally failing source file.

{{invalid}}

{{diagnostic}}

The function requires a string, so a number is rejected. Converting deliberately with `String(42)` fixes the caller. Widening the parameter to a union is appropriate only if the API really accepts both. Disabling checks hides the disagreement.

## Runtime drill

Change the greeting to read an argument from `process.argv`. An absent argument is `undefined`; a type assertion cannot supply it. Check for absence and choose a default. Run with and without an argument. The checker cannot prove that the user supplied useful text.

## TypeScript 7 and development workflows

The stable baseline verified on September 6, 2026 is 7.0.2. TypeScript 7 uses a native compiler written in Go and an LSP language service. The CLI remains `tsc`. Its new programmatic API is still under development; tools embedding the old compiler may need TypeScript 6. Do not replace their dependency blindly. The 7.1 iteration plan is a plan, not a released feature list.

Node can also strip supported TypeScript syntax directly in development. That path does not type-check and does not read `tsconfig` to transform aliases or downlevel code. Start with explicit compile-and-run so you can see both boundaries. A bundler or development runner changes the pipeline; it does not remove the need for a separate check.

## Professional pattern

Add `check`, `build`, and `start` npm scripts for these commands. Commit `package-lock.json`; use `npm ci` in CI. Keep a local dependency instead of trusting a globally installed compiler. Clean the output before a release so deleted source files cannot survive as stale JavaScript.

## Exercise

Create a greeting CLI that trims its input, rejects an empty name, prints a useful message, and exits unsuccessfully for invalid input. Add a second source file and import it using its emitted `.js` extension. Run the generated output from a clean build. Explain which tool handled installation, checking, emission, and execution.

## Checkpoint

- You can reproduce the project outside your editor.
- You can explain why stripping syntax is not checking.
- You can locate the emitted file and its source map.
- You can deliberately produce and then fix a compiler error.

## Sources

[TypeScript 7 release](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), [Node TypeScript execution](https://nodejs.org/docs/latest-v24.x/api/typescript.html), and [TSConfig reference](https://www.typescriptlang.org/tsconfig/).

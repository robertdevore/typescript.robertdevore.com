{"number": 18, "slug": "tsconfig", "title": "Configuring TypeScript", "stage": 3, "description": "Choose compiler settings for your runtime, build, and packages."}

## Where you are

Your reusable library compiles under strict settings. Now own those settings rather than treating configuration as boilerplate. A config file describes a project and its assumptions; it cannot make those assumptions true on the deployment machine.

## Mental model

Separate four questions: what files belong to the project, what environment exists, what checks run, and what output is produced? Give each option a reason tied to one of those questions. Inspect the effective configuration with `npx tsc --showConfig` when inheritance makes the answer unclear.

## Runtime and tooling reality

`target` selects JavaScript syntax the emitter may use. `lib` supplies declarations for standard APIs. Neither installs a Promise implementation or makes document exist in Node. `module` and resolution settings model the host's module behavior; they are not just ways to stop import errors.

`include` selects initial files, while imports can bring additional files into the program. `exclude` is not a firewall preventing imports. `rootDir` controls source layout for emit, not membership. `outDir` needs cleaning when sources are removed. Source maps help debugging but may expose original source when published; decide that disclosure intentionally.

## TypeScript model

Strict includes checks such as strict null handling, implicit-any detection, function compatibility, property initialization, and unknown catch variables. `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are additional policies. `noImplicitOverride` can catch class override mistakes; unused declarations and fallthrough checks address other maintainability concerns.

TypeScript 7 defaults changed, including strict on and an empty types list. This course still spells out consequential choices. Set `types: ["node"]` for Node globals and use a browser config with DOM libs for browser code. Type roots is a specialized way to control declaration lookup, not a directory where every application type must live.

Declaration emit describes your public JavaScript output. `noEmitOnError` prevents fresh output on failing builds, but does not remove old output. `skipLibCheck` can reduce declaration checking at the cost of hiding dependency inconsistencies; it does not turn bad library contracts into good ones. Start without it and measure before accepting that compromise.

## Working example

The lesson uses the course's explicit project configuration. This lookup shows an additional strictness flag at work.

{{example}}

{{output}}

Compare `examples/tsconfig.json` with the Node application config in the labs. Only browser-targeted examples should rely on DOM globals. The general example harness includes DOM for its browser function fixture, not because Node executes browser APIs.

## Type-checker drill

{{invalid}}

{{diagnostic}}

With exact optional properties, absence is distinct from explicitly setting undefined. Omit the field or explicitly include undefined in its value contract when that is the intended API. Disabling the flag changes the policy across the whole project.

## Runtime drill

Temporarily include DOM declarations in a Node-only project and call document. The code can check and still fail because the runtime has no document. This is an environment mismatch, not proof that the DOM declaration is wrong. Keep that experiment outside the deployed application.

## Professional pattern

Use a small shared config for genuinely shared policy, then environment-specific configs for Node, browser, and library output. Run project checks with `-p`; passing filenames directly in a configured directory under TypeScript 7 requires explicit `--ignoreConfig` and can accidentally omit your intended options. The diagnostic harness deliberately supplies every relevant option in that isolated mode.

## Exercise

Create Node and browser configs sharing strictness but differing in libs, globals, module settings, and emit strategy. Inspect both effective configs. Intentionally import a browser-only dependency into Node and determine whether static and runtime checks catch it. Document why every nondefault option exists.

## Checkpoint

- You distinguish target, lib, types, and runtime support.
- You know strict does not include every safety-oriented option.
- You can explain project inclusion and clean output.
- You can diagnose inherited settings with showConfig.

## Sources

[TSConfig reference](https://www.typescriptlang.org/tsconfig/) and [TypeScript 7 changes](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).

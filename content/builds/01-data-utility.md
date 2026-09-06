{"slug": "data-utility", "title": "Build 1: command-line data utility", "stage": 1, "description": "Parse a local job file, reject malformed input, and print an honest summary."}

## The brief

Build a command-line program that reads a JSON file of job records and prints a summary. Its users need useful errors, predictable exit status, and correct totals. This is a small program with a complete input-to-output boundary, not an exercise in frameworks.

You have completed lessons 1–7. Budget two to four hours. Write your own solution first; the repository's `labs/stage1` is a runnable comparison implementation for after your first attempt. It introduces only a small filesystem boundary around the types and narrowing you already know.

## Inputs and outputs

Use this fixture:

```json
[
  { "id": "job_a", "attempts": 2 },
  { "id": "job_b", "attempts": 0 }
]
```

Expected stdout:

```text
Jobs: 2
Attempts: 2
```

The command accepts exactly one path argument. Success exits with zero. Failure prints one useful message to stderr and exits nonzero. An empty list is valid and prints zero totals. An empty file is invalid JSON. A missing path argument is a usage error, not an empty successful list.

## Milestone 1 — Own the toolchain

Create a standalone Node ESM project with a pinned local TypeScript 7.0.2 compiler and explicit strict settings. Include noUncheckedIndexedAccess and exactOptionalPropertyTypes so absence stays visible. Add check, build, and start scripts. Verify a fresh install and compile-and-run sequence.

Keep parsing in a pure function and filesystem access at the process boundary. Even before modules multiply, this separation makes tests easier. The type checker should not need broad any, non-null assertions, or ignored diagnostics to make the happy path work.

Acceptance: another developer can clone the project, install dependencies, build, and run the sample command without relying on your editor or a global compiler.

## Milestone 2 — Parse unknown input

Read UTF-8 text, parse JSON syntax, then assign the result to unknown. Check that it is an array and validate every record. Require a nonempty string ID and a nonnegative safe integer attempts count. Do not let a record annotation stand in for those checks.

Decide whether unknown keys are rejected or stripped. Stage 1's comparison implementation constructs just its owned fields and strips extras. Later the package build deliberately rejects extra keys. Both are explicit policies; neither comes from TypeScript automatically.

Acceptance: null, an object instead of an array, missing ID, numeric ID, negative attempts, fractional attempts, and an invalid JSON document all fail with useful feedback.

## Milestone 3 — Model outcomes

Use a discriminated result union for expected parser failures. Keep unexpected file and JSON exceptions at the outer error boundary. The formatter receives only parsed jobs. It never prints a success summary after a failed parse.

Preserve zero. Boolean OR is not the right fallback if zero attempts is meaningful. Check aggregate overflow too: adding individually safe integers can exceed the safe integer range. Document a reasonable input-size budget. A local stat check is a convenience limit, while an adversarial stream needs enforcement while reading.

Acceptance: zero jobs, zero attempts, multiple jobs, and a total near the safe integer limit behave according to documented policy.

## Milestone 4 — Verify the process boundary

Invoke the generated JavaScript as a child process and check stdout, stderr, and status. Use temporary fixture files and remove them afterward. A parser unit test alone cannot catch a CLI that logs errors but still exits successfully.

Suggested matrix:

| Case               | Expected result                 |
| ------------------ | ------------------------------- |
| Two valid jobs     | Exact two-line summary, exit 0  |
| Empty array        | Both totals zero, exit 0        |
| Malformed JSON     | Error on stderr, nonzero exit   |
| Missing path       | Usage message, nonzero exit     |
| Missing file       | Useful file error, nonzero exit |
| String attempts    | Domain error, nonzero exit      |
| Zero attempts      | Accepted and preserved          |
| Aggregate overflow | Explicit error                  |

## Type-checker drill

Temporarily remove the unknown guard and access the parsed value's properties. Predict and inspect the compiler error. Then try fixing it with an assertion and explain why that version is a weaker program even if it checks. Restore the runtime guard.

## Runtime-boundary drill

Replace one valid record's attempts with a string. A typed fixture constructed directly in TypeScript may reject that at compile time, but the JSON file can contain it. Run the CLI, verify rejection, and retain the fixture as a boundary test.

## Compare after implementation

From the course repository:

```sh
npm ci
npm run check:labs
node labs/stage1/dist/main.js labs/stage1/jobs.json
```

Read the comparison implementation only after your own path works. Compare policies, not just line count. A different decomposition is fine if its observable contract is equally clear and tested.

## Review questions

Which errors are expected values and which are exceptions? Where does unknown become trusted? Which operations belong to JavaScript, TypeScript, Node, or npm? Which fields remain on the original parsed object, and which does your output actually contain?

## Completion checkpoint

Mark this build complete when strict checking passes, the runtime matrix passes, no unsafe assertion stands in for parsing, and you can explain every boundary. Keep the repository: Stage 2 turns this implementation into a reusable package and CLI.

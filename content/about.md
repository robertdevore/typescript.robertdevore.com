Learn to build and maintain TypeScript software at your own pace. The course is free and assumes basic programming knowledge. Each lesson explains the JavaScript behavior you need to understand its TypeScript examples.

## How to study

Start with [setup](/lessons/setup/), follow the [learning path](/course/), and complete each stage build. Before running an example, predict its inferred types and runtime output. Run the compiler, read its diagnostics, then run the emitted JavaScript. Note where the runtime behavior differs from your prediction.

Plan for roughly 60–100 hours including exercises, builds, and the capstone; your experience and chosen project scope will change that. Each lesson includes an implementation or diagnosis exercise. Use the checkpoint to decide whether you are ready to move on.

## Get the runnable course

Clone the [standalone repository](https://github.com/robertdevore/typescript.robertdevore.com), install the locked dependencies, and run the verification workflow:

```sh
git clone https://github.com/robertdevore/typescript.robertdevore.com.git
cd typescript.robertdevore.com
npm ci
npm run verify
npm run check:package
```

Use Node 24.20.0 for the recorded LTS baseline. The examples use TypeScript 7.0.2. Every numbered lesson's valid source is in examples/valid and its intentionally rejected source is in examples/invalid. The verification command compiles valid sources, executes JavaScript, checks expected output, and verifies the exact diagnostic codes for rejected programs. It also captures actual diagnostic text for the lesson page.

The labs directory contains comparison implementations for the first four stage builds plus browser, class, and JavaScript migration experiments. Attempt each build before reading its comparison implementation. For the capstone, you design and build the system from milestones and acceptance criteria.

## Find an answer

The [reference index](/reference/) maps concepts and common errors to explanations. Search matches lesson content as well as titles and supports terms such as NodeNext, satisfies, moduleResolution, and unknown vs any. Every lesson keeps its place in the course and links to the previous and next checkpoint.

## Progress and privacy

Completion is saved in this browser's local storage. No account, analytics service, or cross-device sync is required. Clearing browser data clears progress. If storage is blocked, the page explains that progress cannot persist. Use the reset control on the course page to start over.

Lessons and navigation work without JavaScript. Enable JavaScript to search, copy code, save progress, and open the mobile menu. The type explorer shows declarations emitted by the compiler; expand it to inspect the inferred types.

## Versions and sources

The [sources and currency page](/research/) records the stable baseline, preview distinctions, and reference lenses. Course examples use stable production features. Proposed APIs and TC39 proposals are identified separately. Check the verification date before adopting version-sensitive recommendations in a future project.

## Author and references

Created for [Robert DeVore](https://robertdevore.com). The learning-path layout takes inspiration from his Python and Rust courses, while the curriculum, examples, and projects are designed around TypeScript's actual type model and JavaScript runtime boundaries.

Named language contributors are research lenses, not reviewers or endorsers of this course. No affiliation with Microsoft or the TypeScript team is claimed. Fonts are self-hosted Departure Mono for headings and decorative text, and Inter for body text; their licenses are included in the repository.

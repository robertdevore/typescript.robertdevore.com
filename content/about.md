This is a free, independent, self-guided course for developers who want to build and maintain real TypeScript software. Basic programming familiarity is enough. JavaScript mechanics are introduced where they affect the TypeScript you are learning.

## How to study

Start with [setup](/lessons/setup/), follow the [learning path](/course/), and complete each stage build. Before running an example, predict its inferred types and runtime output. Check it with the actual compiler, inspect the diagnostic, then run the emitted JavaScript. Keep a short note when the two models differ.

Plan for roughly 60–100 hours including exercises, builds, and the capstone; your experience and chosen project scope will change that. Each lesson includes an implementation or diagnosis exercise. Finishing the text is not the same as meeting its checkpoint.

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

The labs directory contains comparison implementations for the first four stage builds plus browser, class, and JavaScript migration experiments. Attempt each build before reading its comparison implementation. The capstone deliberately provides milestones and acceptance criteria rather than a solved platform.

## Using this as a reference

The [reference index](/reference/) maps concepts and common errors to explanations. Search matches lesson content as well as titles and supports terms such as NodeNext, satisfies, moduleResolution, and unknown vs any. Every lesson keeps its place in the course and links to the previous and next checkpoint.

## Progress and privacy

Completion is saved in this browser's local storage. No account, analytics service, or cross-device sync is required. Clearing browser data clears progress. If storage is blocked, the page explains that progress cannot persist. Use the reset control on the course page to start over.

Core lessons and navigation work without JavaScript. Search, copy buttons, and saved progress are progressive enhancements. The type explorer shows compiler-emitted declarations in an expandable view; it does not download a browser IDE or pretend to run a live checker.

## Technical currency

The [sources and currency page](/research/) records the stable baseline, preview distinctions, and reference lenses. Course examples use stable production features. Proposed APIs and TC39 proposals are identified separately. Check the verification date before adopting version-sensitive recommendations in a future project.

## About the author and references

Created for [Robert DeVore](https://robertdevore.com). The learning-path layout takes inspiration from his Python and Rust courses, while the curriculum, examples, and projects are designed around TypeScript's actual type model and JavaScript runtime boundaries.

Named language contributors are research lenses, not reviewers or endorsers of this course. No affiliation with Microsoft or the TypeScript team is claimed. Fonts are self-hosted Departure Mono for headings and decorative text, and Inter for body text; their licenses are included in the repository.

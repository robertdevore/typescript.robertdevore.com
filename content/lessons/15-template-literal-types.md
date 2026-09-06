{"number": 15, "slug": "template-literal-types", "title": "Template literal types", "stage": 2, "description": "Build understandable event and route names without turning strings into a type puzzle."}

## Where you are

You can manipulate types using keys and conditionals. Template literal types compose string literal unions. Their best use is a small, owned vocabulary shared by an API and its callers.

## Mental model

A runtime template literal constructs a string now. A template literal type describes a set of strings that could be accepted. Combining several unions can multiply that set. More combinations do not automatically mean a more useful API.

## JavaScript reality

External strings arrive unchecked. An event name from JSON must be parsed before it joins a trusted event union. A typed string pattern does not install a regular expression or ensure that a server recognizes the same route. Keep runtime routing and static names connected through owned data.

## TypeScript model

A pattern such as a domain name followed by a colon and a verb can describe event names. Mapped types can remap keys into names such as changed events. Indexed access then relates each event's payload to its name. This is often enough; implementing a full URL parser in the type system adds cost and confusing diagnostics.

Use string intersections deliberately when remapping keyof because an object can also have numeric or symbol keys. Intrinsic helpers such as Capitalize operate at the type level; they do not localize user-facing text. Keep generated identifiers distinct from display labels.

## Working example

{{example}}

{{output}}

The event name is drawn from a small closed set. The generic emit signature relates each name to its payload. This contract permits an editor to guide the caller without requiring the caller to specify a type argument.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The misspelled event is not in the generated union. Correct it or intentionally extend the event vocabulary and its runtime handlers together. Widening the type to string would sacrifice useful typo detection.

## Runtime drill

Take a string from process arguments and try to treat it as an event name. The caller needs a parser or a lookup check before dispatch. Test a valid event, a typo, and a valid prefix with an invalid suffix. String prefix checks alone do not validate a complete contract.

## Professional pattern

Generate small contracts from actual supported operations. If a cross-product would create thousands of names, consider a structured object with separate fields or generate a finite declaration at build time. Performance and diagnostic readability are part of API quality.

## Exercise

Create a job event API with queued and finished events carrying different payloads. Prove that a finished payload cannot be emitted with the queued name. Add a runtime event parser from unknown data. Compare a generated name union with an explicit event map; choose the form that makes adding a new event least error-prone.

## Checkpoint

- You distinguish constructing a string from describing one.
- You can relate an event name to its payload.
- You can identify union expansion costs.
- You validate incoming strings independently of template types.

## Sources

[Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html).

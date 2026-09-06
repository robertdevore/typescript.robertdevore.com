{"number": 8, "slug": "structural-typing", "title": "Structural typing & assignability", "stage": 2, "description": "Reason about compatible shapes, fresh literals, and the limits of nominal expectations."}

## Where you are

You have built a strict CLI with explicit parsing. Its functions now need to accept data from different callers. TypeScript usually compares the structure of those values rather than requiring a shared named ancestor.

## Mental model

If a function needs an object with a string ID, a value with a string ID and additional properties can satisfy it. Think of assignability as a directional question: can this source supply what that target requires? Compatibility is not equality, and it does not mean both types can substitute for each other in every direction.

## JavaScript reality

An object retains every property when passed into a function. A narrower parameter annotation does not project or sanitize it. JSON serialization sees enumerable runtime properties, including fields the receiving function's type does not advertise. Runtime identity is an independent matter: two structurally compatible objects can be distinct references.

## TypeScript model

Names such as UserId and JobId do not create nominal distinctions when both alias string. Likewise, two object aliases with the same required fields are usually compatible. Classes with private or protected members introduce compatibility restrictions tied to their declarations; this does not make every class-based API nominal.

Fresh object literals receive excess property checking. This catches likely typos at the moment an object is written for a particular contract. Storing that object in a variable first can change the check because ordinary structural assignability permits extra properties. Do not teach this difference as a trick for bypassing errors; first determine whether the extra field is intentional or misspelled.

## Working example

{{example}}

{{output}}

The function only reads the ID, so a richer object is useful. But the serialized original still has an internal field. A public serializer should explicitly construct a response containing only allowed data.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The fresh literal contains an unexpected field. If the API intentionally accepts labeled jobs, define that requirement or accept a richer generic only when the return relationship needs it. If it only needs an ID, a separately modeled richer object is fine. If `label` was a typo for a required property, fix the typo instead.

## Runtime drill

Return the parameter object directly from a function annotated with the smaller shape. Serialize it and inspect the extra field. Then implement a projection that constructs `{ id: value.id }` and compare. Only the second operation changes the runtime data boundary.

## Professional pattern

Use structural contracts to make adapters and tests easy to supply. Introduce branded identifiers later only when accidentally mixing domains is a demonstrated risk. Validate external input independently, and project public output explicitly. Avoid adding a class hierarchy solely to get type names that feel familiar from Java or C#.

## Exercise

Define a summary API that only needs ID and attempts. Call it with jobs from two different sources without changing their models. Add a misspelled field to a fresh literal and compare it with a variable containing extra legitimate fields. Write a serializer that never leaks owner information. Explain every acceptance and rejection in terms of the required shape.

## Checkpoint

- You can explain the direction of assignability.
- You distinguish excess property checks from exact types.
- You know type names do not usually create identity.
- You do not use a small return annotation as a data filter.

## Sources

[Type compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) and [TypeScript design goals](https://github.com/microsoft/TypeScript/wiki/TypeScript-Design-Goals).

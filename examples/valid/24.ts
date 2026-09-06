async function save() {
  return "saved";
}
await save()
  .then((message) => console.log(message))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "save failed");
    process.exitCode = 1;
  });
export {};

import { readdir, readFile } from "node:fs/promises";
export const origin = "https://typescript.robertdevore.com";
export const stages = [
  {
    title: "Foundations",
    description: "Learn the JavaScript you need and write your first strict TypeScript program.",
    range: "01–07",
    build: "data-utility",
  },
  {
    title: "The type system",
    description: "Use inference, narrowing, and generics to describe your data.",
    range: "08–17",
    build: "library-cli",
  },
  {
    title: "Real applications",
    description: "Work with APIs, async resources, runtime validation, and tests.",
    range: "18–25",
    build: "application",
  },
  {
    title: "Libraries & scale",
    description: "Design public APIs, publish packages, and manage a growing codebase.",
    range: "26–31",
    build: "package-consumer",
  },
  {
    title: "Advanced & production",
    description: "Choose types and tools that keep your software easy to change.",
    range: "32–36",
    build: "capstone",
  },
];
export async function readCollection(name) {
  return Promise.all(
    (await readdir(`content/${name}`))
      .filter((f) => f.endsWith(".md"))
      .sort()
      .map(async (file) => {
        const source = await readFile(`content/${name}/${file}`, "utf8");
        const split = source.indexOf("\n");
        const meta = JSON.parse(source.slice(0, split));
        return {
          ...meta,
          body: source.slice(split + 1).trim(),
          file,
          url: `/${name}/${meta.slug}/`,
        };
      }),
  );
}
export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

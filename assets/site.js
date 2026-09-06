const allIds = JSON.parse(document.body.dataset.courseIds || "[]");
const key = "typescript-course-progress-v1";
let completed = new Set();
let persistent = true;
try {
  const stored = JSON.parse(localStorage.getItem(key) || "[]");
  if (Array.isArray(stored)) completed = new Set(stored.filter((id) => allIds.includes(id)));
  localStorage.setItem(key, JSON.stringify([...completed]));
} catch {
  persistent = false;
}
function updateProgress() {
  document.querySelectorAll("[data-progress-id]").forEach((link) => {
    const done = completed.has(link.dataset.progressId);
    link.classList.toggle("done", done);
    const indicator = link.querySelector(".check");
    if (indicator) indicator.textContent = done ? "✓" : "□";
    link.setAttribute("aria-label", `${link.textContent.trim()}${done ? ", completed" : ""}`);
  });
  document.querySelectorAll("[data-complete]").forEach((button) => {
    button.hidden = false;
    const done = completed.has(button.dataset.complete);
    button.textContent = done ? "✓ Completed — mark incomplete" : "Mark complete";
    button.setAttribute("aria-pressed", String(done));
  });
  document.querySelectorAll(".progress-box").forEach((box) => (box.hidden = false));
  document
    .querySelectorAll("[data-progress-text]")
    .forEach((el) => (el.textContent = `${completed.size} / ${allIds.length} checkpoints`));
  document.querySelectorAll("progress").forEach((el) => {
    el.max = allIds.length;
    el.value = completed.size;
  });
  document
    .querySelectorAll(".storage-note")
    .forEach(
      (el) =>
        (el.textContent = persistent
          ? ""
          : "Browser storage is unavailable. Progress lasts only on this page."),
    );
  const next = allIds.find((id) => !completed.has(id));
  const resume = document.querySelector("[data-resume]");
  if (resume && completed.size && next) {
    resume.href = `/${["data-utility", "library-cli", "application", "package-consumer", "capstone"].includes(next) ? "builds" : "lessons"}/${next}/`;
    resume.textContent = "Continue learning ↗";
  }
}
function saveProgress() {
  try {
    localStorage.setItem(key, JSON.stringify([...completed]));
  } catch {
    persistent = false;
  }
  updateProgress();
}
updateProgress();
document.querySelectorAll("[data-complete]").forEach((button) =>
  button.addEventListener("click", () => {
    const id = button.dataset.complete;
    if (completed.has(id)) completed.delete(id);
    else completed.add(id);
    saveProgress();
  }),
);
document.querySelector("[data-reset]")?.addEventListener("click", () => {
  if (window.confirm("Reset all saved course progress in this browser?")) {
    completed.clear();
    saveProgress();
  }
});
window.addEventListener("storage", (event) => {
  if (event.key !== key) return;
  try {
    const values = JSON.parse(event.newValue || "[]");
    completed = new Set(Array.isArray(values) ? values.filter((id) => allIds.includes(id)) : []);
    updateProgress();
  } catch {
    /* Ignore malformed external storage. */
  }
});
document.querySelectorAll(".copy").forEach((button) =>
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(
        button.closest("figure").querySelector("code").textContent,
      );
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select code to copy";
    }
    setTimeout(() => (button.textContent = "Copy"), 2500);
  }),
);
document.addEventListener("keydown", (event) => {
  if (
    event.key === "/" &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.target.closest("input,textarea,[contenteditable]")
  ) {
    event.preventDefault();
    const input = document.querySelector("#search");
    if (input) input.focus();
    else window.location.href = "/search/";
  }
});
const input = document.querySelector("#search");
if (input) {
  let indexPromise;
  let revision = 0;
  const output = document.querySelector("#search-results");
  const status = document.querySelector("#search-status");
  const aliases = {
    ts2345: "argument",
    ts2322: "assignable",
    ts18046: "unknown",
    ts2532: "undefined",
    ts2375: "optional",
    ts2540: "readonly",
    nodenext: "nodenext",
    moduleresolution: "resolution",
  };
  async function search() {
    const mine = ++revision;
    const query = input.value.trim();
    const url = new URL(location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);
    if (!query) {
      output.replaceChildren();
      status.textContent = "Search all lessons and builds. Try “satisfies” or “package exports”.";
      return;
    }
    status.textContent = "Searching…";
    try {
      indexPromise ||= fetch("/search-index.json").then((response) => {
        if (!response.ok) throw new Error("Search unavailable");
        return response.json();
      });
      const index = await indexPromise;
      if (mine !== revision) return;
      const terms = query
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => !["vs", "versus", "and", "the"].includes(term))
        .map((term) => aliases[term] || term);
      const results = index
        .map((item) => {
          const text = `${item.title} ${item.description} ${item.text}`.toLowerCase();
          const score = terms.every((term) => text.includes(term))
            ? terms.reduce(
                (n, term) =>
                  n +
                  (item.title.toLowerCase().includes(term) ? 10 : 1) +
                  (item.description.toLowerCase().includes(term) ? 4 : 0),
                0,
              )
            : 0;
          return { item, score };
        })
        .filter((result) => result.score > 0)
        .sort((a, b) => b.score - a.score);
      output.replaceChildren();
      for (const { item } of results) {
        const article = document.createElement("article");
        article.className = "search-result";
        const heading = document.createElement("h2");
        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = item.title;
        heading.append(link);
        const paragraph = document.createElement("p");
        paragraph.textContent = item.description;
        article.append(heading, paragraph);
        output.append(article);
      }
      status.textContent = results.length
        ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”.`
        : "No results. Try a shorter term, or browse the reference index.";
    } catch {
      indexPromise = undefined;
      status.textContent = "Search could not load. Try again or use the reference index.";
    }
  }
  input.value = new URLSearchParams(location.search).get("q") || "";
  let timeout;
  input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(search, 120);
  });
  input.form.addEventListener("submit", (event) => {
    event.preventDefault();
    search();
  });
  search();
}

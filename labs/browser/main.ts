const button = document.querySelector("#run");
const output = document.querySelector("#output");
if (!(button instanceof HTMLButtonElement) || !(output instanceof HTMLElement)) {
  document.body.dataset.error = "invalid-elements";
} else {
  let runs = 0;
  button.addEventListener("click", () => {
    runs += 1;
    output.textContent = `Executed ${runs} job${runs === 1 ? "" : "s"}.`;
  });
}
export {};

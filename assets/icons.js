// SVG symbols are built from the licensed Tabler sources in assets/tabler.
export function icon(name) {
  return `<svg class="icon" aria-hidden="true" focusable="false"><use href="/assets/icons.svg#${name}"></use></svg>`;
}

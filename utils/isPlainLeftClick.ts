import type { MouseEvent } from "react";

/**
 * True for an unmodified primary click — the case a fixture link should
 * intercept to open the split-view overlay instead of navigating. A
 * modified click (ctrl/cmd/shift/alt, or a non-primary button) is left
 * alone so opening in a new tab, a new window, etc. still works.
 */
export function isPlainLeftClick(event: MouseEvent): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

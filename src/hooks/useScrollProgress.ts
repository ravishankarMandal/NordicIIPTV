import { useEffect, type RefObject } from "react";

/**
 * Maps the scroll position through a tall "track" element to a 0..1 value.
 * 0 = track top reaches viewport top, 1 = track bottom reaches viewport bottom.
 * Calls `onChange` (no React state, so no re-renders while scrolling).
 */
export function useScrollProgress(
  trackRef: RefObject<HTMLElement | null>,
  onChange: (progress: number) => void
) {
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;

      const p =
        scrollable > 0
          ? -rect.top / scrollable
          : 0;

      onChange(Math.min(1, Math.max(0, p)));
    };

    update();

    window.addEventListener("scroll", update, {
      passive: true,
    });

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [trackRef, onChange]);
}
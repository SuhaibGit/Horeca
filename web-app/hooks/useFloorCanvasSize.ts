import { RefObject, useEffect, useState } from "react";

type CanvasSize = { width: number; height: number };

const ZERO_SIZE: CanvasSize = { width: 0, height: 0 };

/**
 * Tracks the rendered width/height of a floor-plan canvas element.
 * Re-attaches when the ref is populated (e.g. after child layout mounts).
 */
export function useFloorCanvasSize(
  ref: RefObject<HTMLElement | null>
): CanvasSize {
  const [size, setSize] = useState<CanvasSize>(ZERO_SIZE);

  useEffect(() => {
    let observer: ResizeObserver | undefined;
    let frame = 0;

    const measure = (el: HTMLElement) => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    };

    const attach = (el: HTMLElement) => {
      measure(el);
      observer = new ResizeObserver(() => measure(el));
      observer.observe(el);
    };

    const tryAttach = () => {
      const el = ref.current;
      if (el) {
        attach(el);
        return;
      }
      frame = requestAnimationFrame(tryAttach);
    };

    tryAttach();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [ref]);

  return size;
}

import { useEffect, useRef, useState } from "react";

/**
 * Preloads a numbered image sequence.
 * - Frame 1 loads first so something shows immediately.
 * - The rest load in a spread-out order (every 8th frame first, then the gaps),
 *   so early scrolling already has a coarse version of the whole animation.
 */
export function useFrameSequence(
  count: number,
  urlFor: (index: number) => string
) {
  const images = useRef<(HTMLImageElement | null)[]>(
    Array(count).fill(null)
  );

  const [loaded, setLoaded] = useState(0);
  const [firstReady, setFirstReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let done = 0;

    const order: number[] = [0];

    for (let step = 8; step >= 1; step /= 2) {
      for (let i = 0; i < count; i += step) {
        if (!order.includes(i)) {
          order.push(i);
        }
      }
    }

    for (let i = 0; i < count; i++) {
      if (!order.includes(i)) {
        order.push(i);
      }
    }

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();

        img.decoding = "async";

        img.onload = () => {
          if (cancelled) {
            resolve();
            return;
          }

          images.current[i] = img;
          done++;

          if (i === 0) {
            setFirstReady(true);
          }

          if (done % 8 === 0 || done === count) {
            setLoaded(done);
          }

          resolve();
        };

        img.onerror = () => {
          // A missing frame never blocks the rest.
          resolve();
        };

        img.src = urlFor(i);
      });

    (async () => {
      await loadOne(order[0]);

      const queue = order.slice(1);

      const workers = Array.from(
        { length: 6 },
        async () => {
          while (!cancelled && queue.length) {
            await loadOne(queue.shift()!);
          }
        }
      );

      await Promise.all(workers);
    })();

    return () => {
      cancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return {
    images,
    loaded,
    firstReady,
  };
}
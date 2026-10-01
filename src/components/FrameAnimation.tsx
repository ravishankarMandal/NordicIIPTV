import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useFrameSequence } from "../hooks/useFrameSequence";
import { useScrollProgress } from "../hooks/useScrollProgress";

const FRAME_COUNT = 192; // frame-0001.webp … frame-0192.webp in /public/frames
const frameUrl = (i: number) => `/frames/frame-${String(i + 1).padStart(4, "0")}.webp`;

/** 0..1: how fast the shown frame catches up with scroll. Lower = floatier, higher = snappier. */
const SMOOTHING = 0.15;
/** Fraction of scroll held on the first and last frame, so frame 1 is shown at the start and the final frame at the end. */
const HOLD = 0.03;
/** Decode this many frames ahead/behind the current one. */
const DECODE_WINDOW = 12;

interface Props {
  trackRef: RefObject<HTMLElement | null>;
  /** 1 = cover fit. Above 1 enlarges the phone (the frame is cropped a little more). */
  zoom?: number;
  /** Shows a "frame X / 192" readout (bottom-left of the screen) so you can verify the mapping. */
  debug?: boolean;
  /** Receives the raw 0..1 scroll progress (same value that drives the frames). */
  onRawProgress?: (progress: number) => void;
}

export default function FrameAnimation({ trackRef, zoom = 1, debug = false, onRawProgress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const { images, firstReady } = useFrameSequence(FRAME_COUNT, frameUrl);

  const zoomRef = useRef(zoom);
  const target = useRef(0); // scroll progress, 0..1 (after HOLD)
  const current = useRef(0); // smoothed progress
  const lastDrawn = useRef(-1);
  const raf = useRef(0);

  // Latest onRawProgress callback, kept in a ref so the scroll listener never re-subscribes.
  const rawProgressCb = useRef(onRawProgress);
  useEffect(() => {
    rawProgressCb.current = onRawProgress;
  }, [onRawProgress]);

  /** Draw with "cover" fit × zoom (no stretching), in device pixels. */
  const draw = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      let img: HTMLImageElement | null = null; // nearest loaded frame while others still download
      for (let d = 0; d < FRAME_COUNT && !img; d++) {
        img = images.current[index - d] ?? images.current[index + d] ?? null;
      }
      if (!img) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * zoomRef.current;
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    },
    [images]
  );

  const tick = useCallback(() => {
    current.current += (target.current - current.current) * SMOOTHING;
    if (Math.abs(target.current - current.current) < 0.0002) current.current = target.current;

    // progress 0 → frame index 0 (frame-0001), progress 1 → frame index 191 (frame-0192)
    const index = Math.round(current.current * (FRAME_COUNT - 1));
    if (index !== lastDrawn.current) {
      lastDrawn.current = index;
      draw(index);
      for (let d = -DECODE_WINDOW; d <= DECODE_WINDOW; d++) {
        images.current[index + d]?.decode().catch(() => {});
      }
      if (hudRef.current) {
        hudRef.current.textContent = `frame ${index + 1} / ${FRAME_COUNT}  ·  progress ${current.current.toFixed(3)}`;
      }
    }
    raf.current = current.current !== target.current ? requestAnimationFrame(tick) : 0;
  }, [draw, images]);

  const kick = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  }, [tick]);

  const onProgress = useCallback(
    (p: number) => {
      rawProgressCb.current?.(p);
      // Hold the first/last frame for a few % of the scroll, spread the rest across 0..1.
      target.current = Math.min(1, Math.max(0, (p - HOLD) / (1 - 2 * HOLD)));
      kick();
    },
    [kick]
  );
  useScrollProgress(trackRef, onProgress);

  // Zoom changed (e.g. breakpoint switch): redraw.
  useEffect(() => {
    zoomRef.current = zoom;
    lastDrawn.current = -1;
    kick();
  }, [zoom, kick]);

  // Size the canvas to its box × devicePixelRatio (capped at 2) and redraw.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      lastDrawn.current = -1;
      kick();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [kick]);

  // First frame arrived → paint it.
  useEffect(() => {
    if (firstReady) {
      lastDrawn.current = -1;
      kick();
    }
  }, [firstReady, kick]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      {debug && (
        <div
          ref={hudRef}
          className="fixed bottom-3 left-3 z-[60] rounded bg-black/80 px-2.5 py-1 font-mono text-xs text-white"
        />
      )}
    </>
  );
}
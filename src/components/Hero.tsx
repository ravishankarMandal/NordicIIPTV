import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import FrameAnimation from "./FrameAnimation";
import { useMediaQuery } from "../hooks/useMediaQuery";

/** Extra screens of scrolling while the phone is pinned. */
const SCROLL_SCREENS = 5;

const SHOW_FRAME_DEBUG = false;

const PHONE_ZOOM_DESKTOP = 1.2;
const PHONE_ZOOM_MOBILE = 1.1;

const TEXT_MAX_RISE_PX = 80;
const TEXT_END_OPACITY = 0.25;

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const DEVICES: { label: string; icon: ReactNode }[] = [
  {
    label: "Smart TV",
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    label: "Mobile",
    icon: (
      <svg {...iconProps}>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    label: "Tablet",
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    label: "PC",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M2 20h20M9 16v4M15 16v4" />
      </svg>
    ),
  },
];

/* KEEP THIS */
const reveal = (delayMs: number, scale = 1) =>
  ({ "--d": `${delayMs}ms`, "--s": scale }) as CSSProperties;

/* English Hero Content */
function HeroContent() {
  return (
    <>
      <p
        className="hero-reveal mb-5 flex origin-left items-center gap-3 text-[12px] font-semibold uppercase leading-4 tracking-[0.18em] text-accent"
        style={reveal(0, 0.98)}
      >
        <span className="h-[2px] w-5 bg-accent sm:w-[22px]" />
        N1 TV STREAMING
        <span className="h-[2px] w-5 bg-accent sm:w-[22px]" />
      </p>

      <h1
        className="hero-reveal text-[clamp(2rem,3.4vw,3.6rem)] font-semibold leading-[1.1] tracking-[-0.02em]"
        style={reveal(120)}
      >
        <span className="block">Modern entertainment</span>
        <span className="block">for a simpler TV experience</span>
      </h1>

      <p
        className="hero-reveal mt-5 max-w-[540px] text-[15px] font-normal leading-[1.6] text-white/85 sm:text-base lg:text-[17px]"
        style={reveal(260)}
      >
        Get access to a modern and easy-to-use streaming environment focused
        on simple navigation, convenient use, and a clear TV experience across
        compatible devices. Created for those who want to bring digital
        entertainment together in a smooth and convenient way and watch
        whenever it suits them, without unnecessary complicated steps.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 sm:gap-[13px]">
        <button
          type="button"
          className="hero-reveal h-[49px] min-w-[150px] flex-1 rounded-lg bg-accent px-6 text-[15px] font-semibold uppercase text-white transition hover:bg-accent-dark sm:min-w-[175px] sm:flex-none"
          style={reveal(400)}
        >
          GET STARTED
        </button>

        <button
          type="button"
          className="hero-reveal h-[49px] min-w-[150px] flex-1 rounded-lg border-2 border-white/70 bg-white/5 px-6 text-[15px] font-semibold uppercase text-white transition hover:bg-white/15 sm:min-w-[175px] sm:flex-none"
          style={reveal(480)}
        >
          VIEW PLANS
        </button>
      </div>

      <ul
        className="hero-reveal mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 text-[15px] font-semibold text-white"
        style={reveal(620)}
      >
        {DEVICES.map((d) => (
          <li key={d.label} className="flex border px-5 py-2 rounded-xl bg-zinc-100/5 hover:scale-105 transition-all hover:bg-zinc-100/15 duration-300 ease-in-out items-center gap-2">
            {d.icon}
            <span>{d.label}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Hero() {
  const trackRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null); // desktop text wrapper (scroll-driven drift/fade)
  const lastProgress = useRef(0);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  /** progress 0 → opacity 1, y 0 · 1 → opacity TEXT_END_OPACITY, y -TEXT_MAX_RISE_PX */
  const applyTextProgress = useCallback(
    (p: number) => {
      lastProgress.current = p;
      const el = textRef.current;
      if (!el) return; // mobile: text isn't pinned, nothing to drive
      if (reduceMotion) {
        el.style.transform = "";
        el.style.opacity = "";
        return;
      }
      const y = -TEXT_MAX_RISE_PX * p;
      const o = 1 - (1 - TEXT_END_OPACITY) * Math.pow(p, 2.2);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = o.toFixed(3);
    },
    [reduceMotion]
  );

  // Re-apply the last known progress when the layout/motion setting changes.
  useEffect(() => {
    applyTextProgress(lastProgress.current);
  }, [applyTextProgress, isDesktop]);

  return (
    <>
      {/* MOBILE / TABLET: text first, in normal flow (not pinned) */}
      {!isDesktop && (
        <div className="bg-[#0b0b0b] px-5 pb-10 pt-[calc(6.375rem+2rem)] text-white sm:px-8">
          <HeroContent />
        </div>
      )}

      {/* Scroll track: its height is the scroll distance that drives the 192 frames. */}
      <section
        ref={trackRef}
        style={{ height: `${(SCROLL_SCREENS + 1) * 100}svh` }}
        className="relative"
      >
        {/* Pinned stage */}
        <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#0b0b0b]">
          {/* PHONE PANEL */}
          <div className="absolute bottom-0 right-0 top-header w-full lg:left-[38%] lg:w-auto lg:[-webkit-mask-image:linear-gradient(to_right,transparent,black_28%)] lg:[mask-image:linear-gradient(to_right,transparent,black_28%)]">
            <FrameAnimation
              trackRef={trackRef}
              zoom={isDesktop ? PHONE_ZOOM_DESKTOP : PHONE_ZOOM_MOBILE}
              debug={SHOW_FRAME_DEBUG}
              onRawProgress={applyTextProgress}
            />
          </div>

          {/* DESKTOP: text column on the left (aligned with the navbar logo) */}
          {isDesktop && (
            <div className="absolute inset-y-0 left-0 z-10 flex w-[54%] flex-col justify-center pb-10 pl-[max(1.5rem,calc((100vw-1240px)/2))] pr-6 pt-header text-white">
              {/* Scroll-driven drift/fade is applied to this wrapper via ref */}
              <div
                ref={textRef}
                className="max-w-[600px]"
                style={{ willChange: "transform, opacity" }}
              >
                <HeroContent />
              </div>
            </div>
          )}

        
        </div>
      </section>
    </>
  );
}
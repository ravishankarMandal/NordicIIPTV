import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StreamingCard = {
  id: string;
  image: string;
  title: string;
  category: string;
};

const cards: StreamingCard[] = [
  { id: "live", image: "/frames/frame-0048.webp", title: "Live TV", category: "Channels" },
  { id: "sport", image: "/frames/frame-0096.webp", title: "Sport", category: "Live events" },
  { id: "racing", image: "/frames/frame-0144.webp", title: "Racing", category: "Motorsport" },
  { id: "movies", image: "/frames/frame-0192.webp", title: "Movies", category: "On demand" },
  { id: "series", image: "/frames/frame-0096.webp", title: "Series", category: "Box sets" },
  { id: "family", image: "/frames/frame-0048.webp", title: "Family", category: "For everyone" },
];

function Card({ card }: { card: StreamingCard }) {
  return (
    <article className="group relative h-[188px] w-[130px] shrink-0 overflow-hidden rounded-lg bg-slate-900 shadow-sm transition-all duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:shadow-[0_14px_25px_rgba(15,23,42,0.22)] sm:h-[230px] sm:w-[158px] lg:h-[260px] lg:w-[178px]">
      <img
        src={card.image}
        alt=""
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent px-3 pb-3 pt-10 text-white">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/70">{card.category}</p>
        <h3 className="mt-0.5 text-sm font-semibold">{card.title}</h3>
      </div>
    </article>
  );
}

export default function SmartTVStreaming() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<gsap.core.Tween | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(reduceQuery.matches);
    updateMotionPreference();
    reduceQuery.addEventListener("change", updateMotionPreference);

    return () => reduceQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    const row = rowRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!section || !content || !row || !track || !group) return;

    const context = gsap.context(() => {
      const getLoopDistance = () => {
        const gap = Number.parseFloat(window.getComputedStyle(track).gap) || 0;
        return group.offsetWidth + gap;
      };

      gsap.set([content, row], { autoAlpha: 0 });
      gsap.fromTo(
        content,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        }
      );
      gsap.fromTo(
        row,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 72%", once: true },
        }
      );
      gsap.to(row, {
        y: -10,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      loopRef.current = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => -getLoopDistance(),
          duration: () => Math.max(getLoopDistance() / 32, 18),
          ease: "none",
          repeat: -1,
          invalidateOnRefresh: true,
        }
      );

      const resizeObserver = new ResizeObserver(() => {
        loopRef.current?.invalidate().restart();
      });
      resizeObserver.observe(group);
      return () => resizeObserver.disconnect();
    }, section);

    return () => {
      loopRef.current?.kill();
      loopRef.current = null;
      context.revert();
    };
  }, [reducedMotion]);

  const pauseLoop = () => loopRef.current?.timeScale(0.25);
  const resumeLoop = () => loopRef.current?.timeScale(1);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="smart-tv-streaming-heading"
      className="overflow-hidden bg-[#f8f8f7] py-20 text-[#172238] sm:py-24 lg:py-28"
    >
      <div ref={contentRef} className="mx-auto max-w-2xl px-5 text-center sm:px-8">
        <p className="flex items-center justify-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
          <span className="h-px w-5 bg-accent" aria-hidden="true" />
          Smart entertainment
          <span className="h-px w-5 bg-accent" aria-hidden="true" />
        </p>
        <h2 id="smart-tv-streaming-heading" className="mx-auto mt-4 max-w-xl text-3xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-4xl">
          Smart TV Streaming for a Flexible and Enjoyable Viewing Experience
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
          Enjoy a flexible streaming experience that brings your favourite entertainment together in one simple place. Discover sports, movies, series and more across compatible devices.
        </p>
      </div>

      <div
        ref={rowRef}
        className="mt-12 overflow-hidden"
        onMouseEnter={pauseLoop}
        onMouseLeave={resumeLoop}
      >
        {reducedMotion ? (
          <div className="mx-auto grid max-w-5xl grid-cols-2 justify-items-center gap-3 px-5 sm:grid-cols-3 sm:gap-4 sm:px-8 lg:grid-cols-6">
            {cards.map((card) => <Card key={card.id} card={card} />)}
          </div>
        ) : (
          <div ref={trackRef} className="flex w-max gap-3 pl-3 sm:gap-4 sm:pl-4">
            <div ref={groupRef} className="flex gap-3 sm:gap-4">
              {cards.map((card) => <Card key={card.id} card={card} />)}
            </div>
            <div className="flex gap-3 sm:gap-4" aria-hidden="true">
              {cards.map((card) => <Card key={`duplicate-${card.id}`} card={card} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

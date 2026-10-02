import { useEffect, useRef, useState } from "react";

export default function EntertainmentExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="entertainment-experience-heading"
      className="overflow-hidden bg-[#f8f8f7] px-5 py-20 text-[#172238] sm:px-8 sm:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
        <div
          className={`max-w-xl transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:duration-0 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
            <span className="h-px w-5 bg-accent" aria-hidden="true" />
            A simpler everyday experience
          </p>
          <h2
            id="entertainment-experience-heading"
            className="mt-4 max-w-md text-3xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-4xl"
          >
            An Easier Way to Enjoy Digital Entertainment
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-6 text-slate-500 sm:text-[15px]">
            <p>
              Enjoy a modern and convenient entertainment experience designed
              to make everyday viewing simple. Everything is created with easy
              navigation, clear access and a smooth viewing experience in
              mind.
            </p>
            <p>
              Whether you are watching your favourite channels, discovering
              new content or simply relaxing after a long day, the experience
              is designed to fit naturally into your routine.
            </p>
            <p>
              Enjoy your entertainment across compatible devices with a simple
              and flexible setup.
            </p>
          </div>
          <button
            type="button"
            className="mt-7 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.04em] text-[#172238] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white"
          >
            Learn more
          </button>
        </div>

        <div
          className={`transition-all delay-150 duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:duration-0 ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-xl shadow-[0_16px_32px_rgba(15,23,42,0.14)]">
            <img
              src="/images/girlimage.webp"
              alt="Woman enjoying entertainment on a tablet in a cosy living room"
              className="aspect-4/3 w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

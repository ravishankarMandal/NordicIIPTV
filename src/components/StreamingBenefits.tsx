import { useEffect, useRef, useState } from "react";
import {
  Clapperboard,
  Globe2,
  Sparkles,
  Trophy,
  Tv,
  type LucideIcon,
} from "lucide-react";

type Benefit = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
};

const benefits: Benefit[] = [
  { title: "Swedish TV", subtitle: "120+ channels", icon: Tv },
  { title: "Nordic Mix", subtitle: "Norway · DK · FI", icon: Globe2 },
  { title: "Live Sports", subtitle: "Football · F1 · NHL", icon: Trophy },
  { title: "Movies", subtitle: "10,000+ titles", icon: Clapperboard },
  { title: "Series", subtitle: "Box-set marathons", icon: Sparkles },
  { title: "Kids", subtitle: "Safe & fun", icon: Sparkles },
];

export default function StreamingBenefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
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
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="streaming-benefits-heading"
      className="overflow-hidden bg-white px-5 py-20 text-[#172238] sm:px-8 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <header
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:duration-0 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <p className="flex items-center justify-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="h-px w-6 bg-accent" aria-hidden="true" />
            What you get
            <span className="h-px w-6 bg-accent" aria-hidden="true" />
          </p>
          <h2
            id="streaming-benefits-heading"
            className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
          >
            A Simpler Streaming Experience
          </h2>
          <p
            className={`mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 transition-all duration-700 ease-out delay-150 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:duration-0 sm:text-[15px] ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            Enjoy a practical and easy-to-use digital entertainment experience
            designed for compatible devices. Get a clear and flexible viewing
            experience that fits naturally into your everyday life.
          </p>
        </header>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {benefits.map(({ title, subtitle, icon: Icon }, index) => (
            <li
              key={title}
              className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:duration-0 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: `${220 + index * 100}ms` }}
            >
              <article className="group flex min-h-23 items-center gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-[0_5px_14px_rgba(15,23,42,0.045)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_13px_25px_rgba(15,23,42,0.1)] sm:px-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-accent transition-transform duration-300 ease-out group-hover:scale-105 group-hover:bg-orange-100">
                  <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span>
                  <h3 className="text-sm font-semibold text-[#172238]">{title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
                </span>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

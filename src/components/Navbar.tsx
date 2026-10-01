import { useState } from "react";

const NAV_ITEMS = [
  "Home",
  "About us",
  "Buy Now",
  "Our Offer",
  "Installation",
  "FAQs",
  "Blogs",
  "Contact Us",
];
const HAS_DROPDOWN = "Installation"; // chevron only, no dropdown behaviour

function LogoMark() {
  // Placeholder for the orange "N" mark — swap for your real logo SVG/PNG.
  return (
    <svg width="44" height="42" viewBox="0 0 44 42" aria-hidden="true">
      <rect x="2" y="2" width="40" height="38" rx="10" fill="#f04e23" />
      <path d="M13 30V12l18 18V12" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile panel visibility only (no navigation)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Announcement bar */}
      <div className="flex h-bar items-center justify-center bg-[#111] px-3 text-[12.5px] leading-none text-white">
        <span className="truncate">
          Contact us from the chat or click <span className="font-semibold text-accent">“Contact us”</span>
        </span>
      </div>

      {/* Navbar */}
      <div className="bg-white shadow-[0_1px_10px_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex h-nav max-w-310 items-center justify-between gap-6 px-4 sm:px-6 xl:px-0">
          {/* Logo */}
          <div className="flex shrink-0 select-none items-center gap-1.5">
            <LogoMark />
            <span className="text-[26px] font-bold tracking-[-0.01em] text-[#333] sm:text-[28px]">NordicIptv</span>
          </div>

          {/* Navigation (desktop) */}
          <nav className="hidden items-center gap-5 xl:gap-8 lg:flex">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item}
                type="button"
                className={`flex items-center gap-1 whitespace-nowrap text-[14.5px] font-medium transition-colors hover:text-accent xl:text-[15px] ${
                  i === 0 ? "text-accent" : "text-[#1a1a1a]"
                }`}
              >
                {item}
                {item === HAS_DROPDOWN && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                )}
              </button>
            ))}
          </nav>

          {/* CTA buttons (desktop) */}
          <div className="hidden shrink-0 items-center gap-3.25 lg:flex">
            <button
              type="button"
              className="h-12 rounded-[10px] border-2 border-[#e4e4e4] bg-white px-6 text-[15px] font-semibold text-[#1a1a1a] transition hover:border-neutral-300"
            >
              Try
            </button>
            <button
              type="button"
              className="h-12 rounded-[10px] bg-accent px-7 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(240,78,35,0.28)] transition hover:bg-accent-dark"
            >
              Buy Now
            </button>
          </div>

          {/* Hamburger (tablet / mobile) */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] border-2 border-[#e4e4e4] text-[#1a1a1a] lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile / tablet panel */}
        {open && (
          <div className="max-h-[calc(100svh-6.375rem)] overflow-y-auto border-t border-neutral-100 bg-white px-4 pb-5 pt-2 lg:hidden">
            <nav className="flex flex-col">
              {NAV_ITEMS.map((item, i) => (
                <button
                  key={item}
                  type="button"
                  className={`border-b border-neutral-100 py-3 text-left text-base font-medium ${
                    i === 0 ? "text-accent" : "text-[#1a1a1a]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="mt-4 flex gap-3">
              <button type="button" className="h-12 flex-1 rounded-[10px] border-2 border-[#e4e4e4] text-[15px] font-semibold text-[#1a1a1a]">
                Try
              </button>
              <button type="button" className="h-12 flex-1 rounded-[10px] bg-accent text-[15px] font-semibold text-white">
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
const PHRASES = ["BUILD IT!", "BREAK IT!", "FIX IT!", "SHIP IT!"];

function MarqueeGroup() {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: 4 }, (_, groupIndex) =>
        PHRASES.map((phrase, index) => (
          <div
            key={`${groupIndex}-${phrase}`}
            className="flex items-center gap-3 px-3 sm:gap-4 sm:px-4"
          >
            <span className="font-display text-sm uppercase leading-none tracking-tight sm:text-base">
              {phrase}
            </span>
            <span
              aria-hidden="true"
              className="text-xl leading-none sm:text-2xl"
              style={{ color: index % 2 === 0 ? "#171717" : "#FF8FC7" }}
            >
              ★
            </span>
          </div>
        )),
      )}
    </div>
  );
}

export function Marquee() {
  return (
    <div
      className="marquee relative overflow-hidden border-y-[3px] border-ink bg-brand-lime py-3 sm:py-3.5"
      role="marquee"
      aria-label="Build it! Break it! Fix it! Ship it!"
    >
      <span className="sr-only">Build it! Break it! Fix it! Ship it!</span>
      <div aria-hidden="true" className="marquee-track">
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-brand-lime to-transparent sm:w-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-brand-lime to-transparent sm:w-10" />
    </div>
  );
}

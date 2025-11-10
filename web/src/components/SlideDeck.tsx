"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { slides } from "@/data/slides";

const arrowKeys = new Set(["ArrowRight", "ArrowLeft", "PageUp", "PageDown"]);

const SlideDeck = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = slides.length;
  const activeSlide = slides[activeIndex];
  const progress = useMemo(
    () => Math.round(((activeIndex + 1) / totalSlides) * 100),
    [activeIndex, totalSlides],
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0) {
        setActiveIndex(0);
        return;
      }
      if (index >= totalSlides) {
        setActiveIndex(totalSlides - 1);
        return;
      }
      setActiveIndex(index);
    },
    [totalSlides],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!arrowKeys.has(event.key)) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        goToSlide(activeIndex + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        goToSlide(activeIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, goToSlide]);

  const backgroundClasses = activeSlide.backgroundAccent
    ? `bg-gradient-to-br ${activeSlide.backgroundAccent}`
    : "bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900";

  const isCover = activeSlide.id === "cover";
  const isDarkTheme = activeSlide.backgroundAccent
    ? /text-(slate|white)/.test(activeSlide.backgroundAccent)
    : false;
  const spotlightClass = isDarkTheme ? "text-white/70" : "text-slate-500";
  const subtitleClass = isDarkTheme ? "text-white/80" : "text-slate-700";
  const bulletTextClass = isDarkTheme ? "text-white/90" : "text-slate-700";
  const columnWrapperClass = isDarkTheme
    ? "border-white/10 bg-white/10 text-white/90"
    : "border-slate-200 bg-white/80 text-slate-800 shadow-[0_10px_40px_-25px_rgba(15,23,42,0.45)]";
  const timelineCardClass = isDarkTheme
    ? "border-white/15 bg-white/5 text-white/90"
    : "border-slate-200 bg-white/80 text-slate-800 shadow-[0_10px_40px_-25px_rgba(15,23,42,0.35)]";
  const highlightChipClass = isDarkTheme
    ? "border-white/20 bg-white/10 text-white/80"
    : "border-slate-200 bg-white/70 text-slate-700";
  const footerClass = isDarkTheme ? "text-white/60" : "text-slate-500";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),transparent_55%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-12 md:px-10 lg:px-16">
        <header className="flex flex-col gap-3 text-sm uppercase tracking-[0.3em] text-slate-400 md:flex-row md:items-center md:justify-between">
          <span>AI Transformation Office</span>
          <span>
            Slide {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(totalSlides).padStart(2, "0")}
          </span>
        </header>

        <main className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-2xl shadow-slate-950/70 backdrop-blur-xl">
          <div
            className={`${backgroundClasses} relative flex h-full flex-col gap-6 overflow-hidden px-8 py-10 md:px-12 md:py-14`}
          >
            <div className="absolute inset-0 -z-10 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.5),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.45),transparent_55%)]" />
            </div>
            <div className="flex flex-col gap-2">
              <span
                className={`text-xs font-semibold uppercase tracking-[0.35em] ${spotlightClass}`}
              >
                {activeSlide.spotlight ?? "AI Program"}
              </span>
              <h1
                className={`text-balance text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl ${isCover ? "md:text-5xl lg:text-6xl" : ""}`}
              >
                {activeSlide.title}
              </h1>
              {activeSlide.subtitle ? (
                <p
                  className={`max-w-3xl text-lg leading-relaxed md:text-xl ${subtitleClass}`}
                >
                  {activeSlide.subtitle}
                </p>
              ) : null}
            </div>

            {activeSlide.bullets ? (
              <ul className={`mt-2 space-y-4 text-lg leading-relaxed md:text-xl ${bulletTextClass}`}>
                {activeSlide.bullets.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-current" />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {activeSlide.columns ? (
              <div className="grid gap-6 md:grid-cols-2 md:gap-10">
                {activeSlide.columns.map((column) => (
                  <section
                    key={column.title}
                    className={`rounded-2xl p-6 backdrop-blur ${columnWrapperClass}`}
                  >
                    <h2
                      className={`text-lg font-semibold uppercase ${isDarkTheme ? "text-white/80" : "text-slate-600"}`}
                    >
                      {column.title}
                    </h2>
                    <ul
                      className={`mt-4 space-y-3 text-base leading-relaxed md:text-lg ${isDarkTheme ? "text-white/90" : "text-slate-800"}`}
                    >
                      {column.items.map((item) => (
                        <li key={item} className="text-pretty">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : null}

            {activeSlide.timeline ? (
              <div className="grid gap-4 md:grid-cols-3 md:gap-6">
                {activeSlide.timeline.map((event) => (
                  <div
                    key={event.phase}
                    className={`rounded-2xl p-5 backdrop-blur ${timelineCardClass}`}
                  >
                    <div
                      className={`text-xs font-medium uppercase tracking-[0.25em] ${isDarkTheme ? "text-white/70" : "text-slate-500"}`}
                    >
                      {event.phase}
                    </div>
                    <div
                      className={`mt-2 text-lg font-semibold md:text-xl ${isDarkTheme ? "" : "text-slate-800"}`}
                    >
                      {event.period}
                    </div>
                    <p
                      className={`mt-3 text-sm leading-relaxed md:text-base ${isDarkTheme ? "text-white/80" : "text-slate-700"}`}
                    >
                      {event.details}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {activeSlide.highlights ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {activeSlide.highlights.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${highlightChipClass}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}

            {activeSlide.footerNote ? (
              <footer
                className={`mt-auto pt-6 text-xs uppercase tracking-[0.3em] ${footerClass}`}
              >
                {activeSlide.footerNote}
              </footer>
            ) : null}
          </div>
        </main>

        <div className="flex flex-col gap-5 pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="w-16 text-xs uppercase tracking-[0.2em] text-slate-400">
                Progress
              </span>
              <div className="relative h-2 w-56 overflow-hidden rounded-full bg-slate-700/60">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-xs text-slate-400">
                {progress}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goToSlide(activeIndex - 1)}
                className="rounded-full border border-slate-600/80 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-slate-300 hover:text-white disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
                disabled={activeIndex === 0}
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => goToSlide(activeIndex + 1)}
                className="rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 px-6 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={activeIndex === totalSlides - 1}
              >
                Next
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${
                  index === activeIndex
                    ? "border-sky-400/80 bg-sky-400/15 text-sky-100"
                    : "border-slate-700/70 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="hidden sm:inline">{slide.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideDeck;

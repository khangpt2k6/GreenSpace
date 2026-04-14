"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   Easing helpers
───────────────────────────────────────────────────────── */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* ─────────────────────────────────────────────────────────
   useInView — fires once when element enters viewport
───────────────────────────────────────────────────────── */
function useInView(ref, { threshold = 0.2, rootMargin = "0px 0px -60px 0px" } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return inView;
}

/* ─────────────────────────────────────────────────────────
   CountUpStat — animates a metric value
   Parses "1,248"  → 0…1248 → "1,248"
         "92%"    → 0…92   → "92%"
───────────────────────────────────────────────────────── */
function parseMetric(raw) {
  const str = String(raw);
  const suffix = str.replace(/[\d,\.]/g, "");
  const num = parseFloat(str.replace(/[^\d.]/g, ""));
  return { num, suffix };
}

function formatNum(n, originalSuffix, hasSeparator) {
  const rounded = Math.round(n);
  const formatted = hasSeparator ? rounded.toLocaleString("en-US") : String(rounded);
  return formatted + originalSuffix;
}

export function CountUpStat({ value, label, index = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const [display, setDisplay] = useState("0");
  const raf = useRef(null);

  const { num, suffix } = parseMetric(value);
  const hasSeparator = String(value).includes(",");

  useEffect(() => {
    if (!inView) return;

    const DURATION = 1600;
    const DELAY = index * 120;
    let start = null;

    function tick(ts) {
      if (!start) start = ts;
      const elapsed = ts - start - DELAY;
      if (elapsed < 0) { raf.current = requestAnimationFrame(tick); return; }

      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeOutExpo(progress);
      setDisplay(formatNum(eased * num, suffix, hasSeparator));

      if (progress < 1) raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, num, suffix, hasSeparator, index]);

  return (
    <div ref={ref} className="lpStat lpStatAnim" style={{ "--i": index }}>
      <span className="lpStatVal lpStatValAnim">{display}</span>
      <span className="lpStatLabel">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TypeWriter — types out lines sequentially
───────────────────────────────────────────────────────── */
export function TypeWriter({ lines, className }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (done) return;
    const currentLine = lines[lineIdx] ?? "";

    if (charIdx < currentLine.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 42);
      return () => clearTimeout(t);
    }

    if (lineIdx < lines.length - 1) {
      const t = setTimeout(() => {
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }, 380);
      return () => clearTimeout(t);
    }

    setDone(true);
  }, [charIdx, lineIdx, done, lines]);

  // Blinking cursor
  useEffect(() => {
    if (done) { setShowCursor(false); return; }
    const t = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(t);
  }, [done]);

  const rendered = lines.map((line, i) => {
    if (i < lineIdx) return line;
    if (i === lineIdx) return line.slice(0, charIdx);
    return "";
  });

  return (
    <h1 className={className}>
      {rendered.map((text, i) => (
        <span key={i} className="twLine">
          {text || <span style={{ opacity: 0 }}>{lines[i]}</span>}
          {i === lineIdx && !done && (
            <span className="twCursor" style={{ opacity: showCursor ? 1 : 0 }}>|</span>
          )}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </h1>
  );
}

/* ─────────────────────────────────────────────────────────
   FloatingCard — hero image card with float + tilt
───────────────────────────────────────────────────────── */
export function FloatingCard({ children }) {
  const ref = useRef(null);

  function handleMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `
      translateY(var(--float-offset, 0px))
      rotateY(${x * 12}deg)
      rotateX(${-y * 10}deg)
      scale(1.02)
    `;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <div
      ref={ref}
      className="lpHeroCard lpHeroCardFloat"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ScrollReveal — fade-up on intersection
───────────────────────────────────────────────────────── */
export function ScrollReveal({ children, className = "", delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`srWrap ${inView ? "srWrap--visible" : ""} ${className}`}
      style={{ "--sr-delay": `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FeatureColAnimated — staggered reveal for feature cols
───────────────────────────────────────────────────────── */
export function FeatureColAnimated({ children, index = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`lpFeatureCol lpFeatureColAnim ${inView ? "lpFeatureColAnim--visible" : ""}`}
      style={{ "--col-delay": `${index * 110}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   QuoteAnimated — staggered quote reveal
───────────────────────────────────────────────────────── */
export function QuoteAnimated({ children, index = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.15 });

  return (
    <blockquote
      ref={ref}
      className={`lpQuote lpQuoteAnim ${inView ? "lpQuoteAnim--visible" : ""}`}
      style={{ "--q-delay": `${index * 130}ms` }}
    >
      {children}
    </blockquote>
  );
}

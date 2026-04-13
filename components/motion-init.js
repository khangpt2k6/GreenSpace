"use client";

import { useEffect } from "react";

export default function MotionInit() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");

    const nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    nodes.forEach((node) => observer.observe(node));

    const fallbackTimer = window.setTimeout(() => {
      nodes.forEach((node) => node.classList.add("is-visible"));
    }, 1200);

    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  return null;
}

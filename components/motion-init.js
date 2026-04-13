"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MotionInit() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");

    // Short delay lets Next.js finish painting the new page's DOM
    const setupTimer = window.setTimeout(() => {
      const nodes = document.querySelectorAll("[data-reveal]:not(.is-visible)");
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
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );

      nodes.forEach((node) => observer.observe(node));

      // Hard fallback — if anything is still hidden after 1.4s, reveal it
      const fallbackTimer = window.setTimeout(() => {
        document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((node) =>
          node.classList.add("is-visible")
        );
        observer.disconnect();
      }, 1400);

      return () => {
        window.clearTimeout(fallbackTimer);
        observer.disconnect();
      };
    }, 60);

    return () => {
      window.clearTimeout(setupTimer);
    };
  }, [pathname]); // re-runs on every client-side route change

  return null;
}

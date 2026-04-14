import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import Navbar from "@/components/navbar";
import {
  MdStorefront, MdBiotech, MdBarChart, MdGroups,
  MdAssignment, MdSmartToy, MdCheckCircle
} from "react-icons/md";

const steps = [
  {
    number: "01", color: "#16a34a",
    icon: MdStorefront,
    title: "Browse the Marketplace",
    href: "/marketplace",
    bullets: ["Filter by EcoLiving, EcoTech, EcoFashion", "Sort by rating & price range", "Look for ♻ Resale badges", "Search by name or keyword"],
    imageSrc: "/reflection/market_place.png"
  },
  {
    number: "02", color: "#0ea5e9",
    icon: MdBiotech,
    title: "AI Product Analysis",
    href: "/marketplace#analyzer",
    bullets: ['Click "Analyze This" on any card', "Or paste any product URL manually", "AI scrapes & scores in ~15 seconds", "Get alternatives + carbon estimate"],
    imageSrc: "/reflection/analyzing%20page.png"
  },
  {
    number: "03", color: "#ca8a04",
    icon: MdBarChart,
    title: "Understanding the Score",
    href: "/marketplace",
    bullets: ["Materials: sourcing & recyclability", "Manufacturing: energy & emissions", "Packaging: minimal or compostable", "Ethics & Labor: supply chain fairness", "Durability: longevity & repairability"],
    imageSrc: "/reflection/landing_page.png"
  },
  {
    number: "04", color: "#16a34a",
    icon: MdGroups,
    title: "Join Tampa Eco Community",
    href: "/community",
    bullets: ["Select your cause interests", "Set your availability", "Get ranked volunteer matches", "Share your sustainability updates"],
    imageSrc: "/reflection/community.png"
  },
  {
    number: "05", color: "#8b5cf6",
    icon: MdAssignment,
    title: "IDH 3350 Semester Project",
    href: "/community",
    bullets: ["Read project expectations", "Pick from suggested directions", "Review reflection requirements", "Document progress in the community feed"],
    imageSrc: "/reflection/research_blog.png"
  },
  {
    number: "06", color: "#0ea5e9",
    icon: MdSmartToy,
    title: "GreenCart AI Chat",
    href: "#",
    bullets: ["Click the leaf icon (bottom-right)", "Use quick prompt buttons", "Ask about products, scores, Tampa events", "Conversation remembers context"],
    imageSrc: "/reflection/AI-chatbot.png"
  }
];

const faqs = [
  { q: "Does it work on every site?", a: "Most public HTML product pages work. Sites with heavy JavaScript rendering or bot protection may fail — the AI will still analyze using URL + search data." },
  { q: "How accurate is the score?", a: "It's an AI estimate, not a certified lifecycle assessment. It flags real certifications and uses conservative scoring when data is sparse. A practical guide, not a label." },
  { q: "What does ♻ Resale mean?", a: "Secondhand, pre-owned, or refurbished. Buying resale cuts manufacturing demand and extends product life — often higher impact than buying new eco-labeled goods." },
  { q: "How are volunteer opportunities ranked?", a: "Matched by how many of your cause interests overlap with the activity, plus a bonus for matching availability type." },
  { q: "Is my chat saved?", a: "No. Chat is session-only in browser memory. It resets on refresh — zero server-side storage." },
  { q: "Who built GreenCart?", a: "Tuan Khang Phan, IDH 3350 — Natural Science, University of South Florida, Tampa." }
];

export default function GuidePage() {
  return (
    <main className="page">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <Navbar />

      <section className="glass marketHeader" data-reveal style={{ "--reveal-delay": "60ms" }}>
        <h1>How to Use GreenCart</h1>
        <p>6 steps to shop smarter, analyze products, and complete your semester project.</p>
      </section>

      {/* Visual step cards */}
      <section className="guideStepsV2" data-reveal style={{ "--reveal-delay": "100ms" }}>
        {steps.map((step, i) => (
          <article
            key={step.number}
            className="glass guideStepV2"
            data-reveal
            style={{ "--reveal-delay": `${160 + i * 70}ms` }}
          >
            {/* Step link panel */}
            {step.href !== "#" ? (
              <Link
                href={step.href}
                className="guideStepLink"
              >
                <img src={step.imageSrc} alt={step.title} className="guideStepImage" />
                <div className="guideStepOverlay" />
                <step.icon size={32} style={{ color: step.color }} />
                <span className="guideStepLinkLabel">{step.title}</span>
                <span className="guideStepLinkCta">
                  Go to page <FiArrowRight size={14} />
                </span>
              </Link>
            ) : (
              <div
                className="guideStepLink guideStepLink--static"
              >
                <img src={step.imageSrc} alt={step.title} className="guideStepImage" />
                <div className="guideStepOverlay" />
                <step.icon size={32} style={{ color: step.color }} />
                <span className="guideStepLinkLabel">{step.title}</span>
                <span className="guideStepLinkCta" style={{ opacity: 0.5 }}>
                  Available on-page
                </span>
              </div>
            )}

            {/* Step content */}
            <div className="guideStepV2Body">
              <div className="guideStepV2Header">
                <span className="guideStepV2Num" style={{ background: step.color }}>{step.number}</span>
                <step.icon size={18} style={{ color: step.color }} />
                <h3>{step.title}</h3>
              </div>
              <ul className="guideStepV2Bullets">
                {step.bullets.map((b, j) => (
                  <li key={j}>
                    <MdCheckCircle size={14} style={{ color: step.color, flexShrink: 0 }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {step.href !== "#" && (
                <Link href={step.href} className="btnGhost guideStepV2Btn">Try it →</Link>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* FAQ — compact chips */}
      <section className="glass faqSection" data-reveal style={{ "--reveal-delay": "200ms" }}>
        <h2>Frequently Asked Questions</h2>
        <div className="faqGrid">
          {faqs.map((faq) => (
            <article key={faq.q} className="faqCard">
              <h4>{faq.q}</h4>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass ctaSection" data-reveal style={{ "--reveal-delay": "260ms" }}>
        <h2>Ready to explore?</h2>
        <p>Browse products, analyze any item, or ask GreenCart AI anything.</p>
        <div className="heroActions" style={{ justifyContent: "center" }}>
          <Link href="/marketplace" className="btnPrimary">Open Marketplace</Link>
          <Link href="/community" className="btnGhost">Join Community</Link>
        </div>
      </section>
    </main>
  );
}

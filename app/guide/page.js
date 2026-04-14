import Link from "next/link";
import { FiCamera, FiSearch } from "react-icons/fi";
import {
  MdStorefront, MdBiotech, MdBarChart, MdGroups,
  MdAssignment, MdSmartToy, MdCheckCircle
} from "react-icons/md";

function ImgSlot({ label, hint, gradient, icon: Icon = FiCamera, src, alt }) {
  if (src) {
    return (
      <div className="imgSlot imgSlot--filled">
        <img src={src} alt={alt || label} />
      </div>
    );
  }
  return (
    <div className="imgSlot imgSlot--sm" style={{ "--slot-gradient": gradient }}>
      <div className="imgSlotInner">
        <Icon size={22} className="imgSlotIcon" />
        <p className="imgSlotLabel">{label}</p>
        <p className="imgSlotHint"><FiSearch size={10} /> {hint}</p>
      </div>
    </div>
  );
}

const steps = [
  {
    number: "01", color: "#16a34a",
    icon: MdStorefront,
    title: "Browse the Marketplace",
    href: "/marketplace",
    bullets: ["Filter by EcoLiving, EcoTech, EcoFashion", "Sort by rating & price range", "Look for ♻ Resale badges", "Search by name or keyword"],
    imgLabel: "Marketplace page screenshot",
    imgHint: "Screenshot of localhost:3000/marketplace",
    imgGradient: "linear-gradient(135deg,#d1fae5,#6ee7b7)"
  },
  {
    number: "02", color: "#0ea5e9",
    icon: MdBiotech,
    title: "AI Product Analysis",
    href: "/marketplace#analyzer",
    bullets: ['Click "Analyze This" on any card', "Or paste any product URL manually", "AI scrapes & scores in ~15 seconds", "Get alternatives + carbon estimate"],
    imgLabel: "Analyze results page screenshot",
    imgHint: "Screenshot of localhost:3000/analyze",
    imgGradient: "linear-gradient(135deg,#e0f2fe,#7dd3fc)"
  },
  {
    number: "03", color: "#ca8a04",
    icon: MdBarChart,
    title: "Understanding the Score",
    href: "/marketplace",
    bullets: ["Materials: sourcing & recyclability", "Manufacturing: energy & emissions", "Packaging: minimal or compostable", "Ethics & Labor: supply chain fairness", "Durability: longevity & repairability"],
    imgLabel: "Score breakdown infographic",
    imgHint: "Unsplash: 'sustainability score infographic'",
    imgGradient: "linear-gradient(135deg,#fef9c3,#fde68a)"
  },
  {
    number: "04", color: "#16a34a",
    icon: MdGroups,
    title: "Join Tampa Eco Community",
    href: "/community",
    bullets: ["Select your cause interests", "Set your availability", "Get ranked volunteer matches", "Share your sustainability updates"],
    imgLabel: "Community page screenshot",
    imgHint: "Screenshot of localhost:3000/community",
    imgGradient: "linear-gradient(135deg,#dcfce7,#bbf7d0)"
  },
  {
    number: "05", color: "#8b5cf6",
    icon: MdAssignment,
    title: "IDH 3350 Semester Project",
    href: "/community",
    bullets: ["Read project expectations", "Pick from suggested directions", "Review reflection requirements", "Document progress in the community feed"],
    imgLabel: "Student working on eco project",
    imgHint: "Unsplash: 'student project environment campus'",
    imgGradient: "linear-gradient(135deg,#ede9fe,#c4b5fd)"
  },
  {
    number: "06", color: "#0ea5e9",
    icon: MdSmartToy,
    title: "GreenCart AI Chat",
    href: "#",
    bullets: ["Click the leaf icon (bottom-right)", "Use quick prompt buttons", "Ask about products, scores, Tampa events", "Conversation remembers context"],
    imgLabel: "Chat bubble open screenshot",
    imgHint: "Screenshot of GreenCart AI chatbot open",
    imgGradient: "linear-gradient(135deg,#e0f2fe,#93c5fd)"
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

      <header className="siteNav glass" data-reveal style={{ "--reveal-delay": "0ms" }}>
        <p className="brand">GreenCart</p>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/community">Community</Link>
          <Link href="/guide">Guide</Link>
          <Link href="/survey">Survey</Link>
        </nav>
      </header>

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
            {/* Image slot */}
            <ImgSlot
              src=""
              label={step.imgLabel}
              hint={step.imgHint}
              gradient={step.imgGradient}
              icon={step.icon}
            />

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

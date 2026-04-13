import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Browse the Marketplace",
    href: "/marketplace",
    color: "step--green",
    description:
      "Head to the Marketplace to explore 40+ eco-friendly products. Use the sidebar to filter by category (EcoLiving, EcoTech, EcoFashion), minimum rating, and price range. Look for the ♻ Resale badge to find secondhand and pre-owned circular economy items.",
    actions: [
      "Select one or more categories in the sidebar",
      "Drag the Rating slider to set a minimum star rating",
      "Drag the Price Range slider to match your budget",
      "Use the search bar to find specific products or categories"
    ]
  },
  {
    number: "02",
    title: "Analyze Any Product for Sustainability",
    href: "/marketplace#analyzer",
    color: "step--sky",
    description:
      "GreenCart's AI analyzer scrapes any public product page and runs it through Claude AI to produce a full environmental impact report. You'll get a 0–100 score, five category breakdowns, strengths, concerns, practical recommendations, and greener alternatives from other platforms.",
    actions: [
      'Click "Analyze This" on any marketplace card to prefill its URL',
      "Or paste any product link from Amazon, IKEA, or any other store",
      'Click "Analyze Product" and wait ~10 seconds',
      "Review your score, category breakdown, and alternative suggestions"
    ]
  },
  {
    number: "03",
    title: "Understanding Your Sustainability Score",
    href: "/marketplace",
    color: "step--sun",
    description:
      "The AI breaks down sustainability into five measurable categories. Each category is scored 0–100 and is weighted transparently. The overall score reflects genuine environmental impact — not just marketing claims.",
    actions: [
      "Materials (0–100): Raw material sourcing, recyclability, and toxicity",
      "Manufacturing (0–100): Energy usage, emissions, and production ethics",
      "Packaging (0–100): Minimal, recyclable, or compostable packaging",
      "Ethics & Labor (0–100): Fair trade, supply chain transparency",
      "Durability & Repairability (0–100): Longevity and right-to-repair"
    ]
  },
  {
    number: "04",
    title: "Join the Tampa Eco Community",
    href: "/community",
    color: "step--green",
    description:
      "The Community page is a social sustainability hub for Tampa. Share your eco activities, find volunteer events matched to your causes and schedule, and connect with local environmental organizations.",
    actions: [
      "Select your cause interests (cleanup, climate, marine, etc.)",
      "Set your availability (one-time, weekly, monthly)",
      "Scroll Recommended Opportunities — ranked by your preferences",
      'Click "Join Opportunity" to sign up on the organization\'s site',
      "Use the post composer to share your sustainability updates"
    ]
  },
  {
    number: "05",
    title: "Complete Your Semester Project",
    href: "/community",
    color: "step--sky",
    description:
      "For IDH 3350 students — the Community page includes a full Semester Environmental Action Project studio. It outlines expectations, suggests project directions, and lists the four reflection requirements needed for your final submission.",
    actions: [
      "Read Project Expectations to understand the assignment scope",
      "Browse Possible Project Directions for inspiration",
      "Review Reflection Requirements before documenting your work",
      "Use the community feed to document your progress publicly",
      "Link your completed project to the USF research page for context"
    ]
  },
  {
    number: "06",
    title: "Use GreenCart AI (Chat Bubble)",
    href: "#",
    color: "step--sun",
    description:
      "The 🌿 chat bubble in the bottom-right corner is your always-on GreenCart AI assistant. Ask anything about the platform, sustainability topics, product scoring, Tampa volunteering, or your semester project.",
    actions: [
      "Click the 🌿 bubble to open the chat",
      "Use quick prompts for instant answers",
      "Ask multi-turn questions — the AI remembers your conversation",
      "Ask for product advice, eco tips, or how to use specific features",
      "Type and press Enter or click ↑ to send"
    ]
  }
];

const faqs = [
  {
    q: "Does the AI analyzer work on every website?",
    a: "It works on most publicly accessible product pages that serve standard HTML. Some sites (like Amazon) may rate-limit or block scrapers, or use heavy JavaScript rendering that the server-side fetch cannot process. If a URL fails, try another product page from the same store."
  },
  {
    q: "How accurate is the sustainability score?",
    a: "The score is an AI estimate based on available page data — it is not a certified lifecycle assessment. It flags real patterns (certifications, materials, manufacturing claims) and uses conservative scoring when data is missing. It's a practical decision-support tool, not a regulatory label."
  },
  {
    q: "What does ♻ Resale mean?",
    a: "Resale products are secondhand, pre-owned, or refurbished items. Buying resale directly extends product life, reduces manufacturing demand, and supports the circular economy — often achieving higher sustainability impact than buying new eco-labeled goods."
  },
  {
    q: "How are volunteer opportunities ranked?",
    a: "Opportunities are scored by how many of your selected cause interests overlap with the activity's focus areas, plus a bonus point if the commitment type matches your availability setting. The best matches appear at the top."
  },
  {
    q: "Is my chat history saved?",
    a: "No. Chat history is session-only and stored in your browser's memory. It resets when you refresh or close the page. This keeps your data private with zero server-side storage."
  },
  {
    q: "Who built GreenCart?",
    a: "GreenCart was built by Tuan Khang Phan as part of IDH 3350: Natural Science at the University of South Florida, Tampa. The research behind it is published at env-blog.vercel.app."
  }
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
        <p>
          Everything you need to shop smarter, analyze products, volunteer in Tampa, and
          complete your semester environmental project — step by step.
        </p>
      </section>

      <section className="guideSteps" data-reveal style={{ "--reveal-delay": "100ms" }}>
        {steps.map((step, index) => (
          <article
            key={step.number}
            className={`glass guideStep ${step.color}`}
            data-reveal
            style={{ "--reveal-delay": `${160 + index * 80}ms` }}
          >
            <div className="guideStepNumber">{step.number}</div>
            <div className="guideStepBody">
              <h2>{step.title}</h2>
              <p>{step.description}</p>
              <ul>
                {step.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
              {step.href !== "#" && (
                <Link href={step.href} className="btnGhost">
                  Try it now
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>

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
        <p>Browse products, analyze any item for free, or ask GreenCart AI anything.</p>
        <div className="heroActions" style={{ justifyContent: "center" }}>
          <Link href="/marketplace" className="btnPrimary">
            Open Marketplace
          </Link>
          <Link href="/community" className="btnGhost">
            Join Community
          </Link>
        </div>
      </section>
    </main>
  );
}

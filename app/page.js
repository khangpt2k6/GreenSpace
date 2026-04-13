import Link from "next/link";
import { products } from "@/data/products";
import {
  platformImpactMetrics,
  productStudentFeedback,
  studentHighlights
} from "@/data/impact-metrics";

const features = [
  {
    title: "AI Sustainability Scoring",
    description:
      "Get a transparent score for every product across materials, labor ethics, and lifecycle impact."
  },
  {
    title: "Eco Marketplace Discovery",
    description:
      "Browse curated products by sustainability score, price, and category in one clean marketplace."
  },
  {
    title: "Greener Alternatives",
    description:
      "Instantly compare cleaner alternatives from other platforms before making a purchase."
  }
];

const posters = [
  {
    title: "Eco Action Campaign",
    description:
      "A student awareness poster focused on reducing single-use plastic and promoting reusable choices."
  },
  {
    title: "Green Living Guide",
    description:
      "A visual poster that highlights simple daily habits for lower carbon impact in homes and dorms."
  },
  {
    title: "Future of Sustainable Shopping",
    description:
      "A concept poster presenting how AI can help consumers make cleaner, smarter purchases."
  }
];

export default function HomePage() {
  const topStudentProductFeedback = productStudentFeedback
    .slice()
    .sort((a, b) => b.studentsUsed - a.studentsUsed)
    .slice(0, 3)
    .map((entry) => ({
      ...entry,
      productName:
        products.find((product) => product.id === entry.productId)?.name || "Product"
    }));

  return (
    <main className="page landingPage">
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

      <section className="hero glass" data-reveal style={{ "--reveal-delay": "80ms" }}>
        <p className="eyebrow">Smart Shopping Meets Sustainability</p>
        <h1>GreenCart app for real user shopping decisions.</h1>
        <p className="subtext">
          Use the marketplace filters, open product pages, and run AI analysis to
          compare sustainability before buying.
        </p>
        <div className="heroActions">
          <Link href="/marketplace" className="btnPrimary">
            Open Marketplace
          </Link>
          <Link href="/marketplace#analyzer" className="btnGhost">
            Use AI Analyzer
          </Link>
        </div>
      </section>

      <section className="glass researchSection" data-reveal style={{ "--reveal-delay": "110ms" }}>
        <h2>Featured Research: Consumer Behavior & Sustainability</h2>
        <p>
          Explore this USF student research article on how consumer choices shape
          environmental outcomes and what actions can shift communities toward
          sustainable futures.
        </p>
        <a
          href="https://env-blog.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="btnPrimary"
        >
          Open Research Page
        </a>
      </section>

      <section id="features" className="featureGrid" data-reveal style={{ "--reveal-delay": "140ms" }}>
        {features.map((feature, index) => (
          <article
            key={feature.title}
            className="glass featureCard"
            data-reveal
            style={{ "--reveal-delay": `${220 + index * 90}ms` }}
          >
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="glass metricSection" data-reveal style={{ "--reveal-delay": "200ms" }}>
        <h2>Student Impact Metrics</h2>
        <div className="metricGrid">
          {platformImpactMetrics.map((metric) => (
            <article key={metric.id} className="metricCard">
              <p className="metricValue">{metric.value}</p>
              <p className="metricLabel">{metric.label}</p>
              <p className="mutedLine">{metric.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass feedbackSection" data-reveal style={{ "--reveal-delay": "260ms" }}>
        <h2>What Students Say</h2>
        <div className="feedbackGrid">
          {studentHighlights.map((item) => (
            <article key={item.id} className="feedbackCard">
              <p>"{item.text}"</p>
              <strong>{item.student}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="glass productFeedbackLanding" data-reveal style={{ "--reveal-delay": "320ms" }}>
        <h2>Most Used Products by Students</h2>
        <div className="feedbackGrid">
          {topStudentProductFeedback.map((item) => (
            <article key={item.productId} className="feedbackCard">
              <p className="metricValue">{item.studentsUsed}</p>
              <p className="metricLabel">Students used {item.productName}</p>
              <p className="mutedLine">{item.reviews} feedback entries</p>
              <p>"{item.feedback}"</p>
            </article>
          ))}
        </div>
      </section>

      <section id="posters" className="glass posterSection" data-reveal style={{ "--reveal-delay": "350ms" }}>
        <h2>Portfolio Add-on: Some of my posters that I created</h2>
        <p>
          This section is optional for presentation; the main experience remains
          focused on Marketplace and AI tools for users.
        </p>
        <div className="posterGrid">
          {posters.map((poster) => (
            <article key={poster.title} className="posterCard">
              <h3>{poster.title}</h3>
              <p>{poster.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass ctaSection" data-reveal style={{ "--reveal-delay": "380ms" }}>
        <h2>Ready to build a cleaner cart?</h2>
        <p>
          Start browsing sustainable products and run AI analysis on any product
          page now.
        </p>
        <div className="heroActions">
          <Link href="/marketplace" className="btnPrimary">
            Go to Marketplace
          </Link>
          <Link href="/marketplace#analyzer" className="btnGhost">
            Analyze Product URL
          </Link>
        </div>
      </section>
    </main>
  );
}

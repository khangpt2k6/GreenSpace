import Link from "next/link";
import { platformImpactMetrics, studentHighlights } from "@/data/impact-metrics";

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

export default function HomePage() {
  return (
    <main className="page landingPage">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <header className="siteNav glass">
        <p className="brand">GreenCart</p>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/community">Community</Link>
        </nav>
      </header>

      <section className="hero glass">
        <p className="eyebrow">Smart Shopping Meets Sustainability</p>
        <h1>Shop cleaner products with confidence.</h1>
        <p className="subtext">
          GreenCart helps people discover eco-friendly products, understand real
          sustainability claims, and switch to better alternatives with clear AI
          insights.
        </p>
        <div className="heroActions">
          <Link href="/marketplace" className="btnPrimary">
            Open Marketplace
          </Link>
          <a href="#features" className="btnGhost">
            Explore Features
          </a>
        </div>
      </section>

      <section id="features" className="featureGrid">
        {features.map((feature) => (
          <article key={feature.title} className="glass featureCard">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="glass metricSection">
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

      <section className="glass feedbackSection">
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

      <section className="glass ctaSection">
        <h2>Ready to build a cleaner cart?</h2>
        <p>
          Start browsing sustainable products and run AI analysis on any product
          page now.
        </p>
        <Link href="/marketplace" className="btnPrimary">
          Go to Marketplace
        </Link>
      </section>
    </main>
  );
}

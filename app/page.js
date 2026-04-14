import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { MdBarChart, MdSwapHoriz } from "react-icons/md";
import { products } from "@/data/products";
import {
  platformImpactMetrics,
  studentHighlights
} from "@/data/impact-metrics";

export default function HomePage() {
  return (
    <main className="lp">

      {/* ── Nav ── */}
      <header className="lpNav">
        <span className="lpNavBrand">GreenCart</span>
        <nav className="lpNavLinks">
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/community">Community</Link>
          <Link href="/guide">Guide</Link>
          <Link href="/survey">Survey</Link>
          <Link href="/analyze" className="lpNavCta">Analyze →</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="lpHero">
        <div className="lpHeroContent">
          <p className="lpEyebrow">Smart Shopping · Tampa Bay</p>
          <h1 className="lpHeroH1">
            Shop greener.<br />Score smarter.
          </h1>
          <p className="lpHeroSub">
            AI sustainability scoring for 40+ eco products. Analyze any URL,
            find better alternatives, and track your impact.
          </p>
          <div className="lpHeroActions">
            <Link href="/marketplace" className="lpBtnDark">
              Open Marketplace <FiArrowRight size={16} />
            </Link>
            <Link href="/analyze" className="lpBtnDarkOutline">
              Analyze a Product
            </Link>
          </div>
        </div>
        <div className="lpHeroCard">
          <Image
            src="/hero_sustainable shopping.webp"
            alt="Sustainable shopping"
            fill
            priority
            className="lpHeroCardImg"
            sizes="(max-width: 768px) 90vw, 420px"
          />
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="lpStats">
        {platformImpactMetrics.map((m, i) => (
          <div key={m.id} className="lpStat">
            <span className="lpStatVal">{m.value}</span>
            <span className="lpStatLabel">{m.label}</span>
            {i < platformImpactMetrics.length - 1 && <div className="lpStatDivider" />}
          </div>
        ))}
      </section>

      {/* ── Features row ── */}
      <section className="lpFeatureRow">
        <div className="lpFeatureCol">
          <div className="lpFeatureColImg">
            <Image
              src="/ai_sustainable_score.png"
              alt="AI sustainability score dashboard"
              fill
              className="lpFeatureImgEl"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <span className="lpFeatureTag">
            <MdBarChart size={13} /> AI Analysis
          </span>
          <h3>Transparent sustainability scoring</h3>
          <p>
            Paste any product URL and get a 0–100 score across materials,
            labor ethics, packaging, and lifecycle.
          </p>
          <Link href="/analyze" className="lpLink">
            Try the analyzer <FiArrowUpRight size={13} />
          </Link>
        </div>

        <div className="lpFeatureCol">
          <div className="lpFeatureColImg">
            <Image
              src="/products_flat_lay.jpg"
              alt="Eco products flat lay"
              fill
              className="lpFeatureImgEl"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <span className="lpFeatureTag">
            <MdSwapHoriz size={13} /> Marketplace
          </span>
          <h3>40+ curated eco products</h3>
          <p>
            Browse by sustainability score, price, and category — with
            student feedback from USF, HCC, and UTampa.
          </p>
          <Link href="/marketplace" className="lpLink">
            Browse marketplace <FiArrowUpRight size={13} />
          </Link>
        </div>

        <div className="lpFeatureCol">
          <div className="lpFeatureColImg">
            <Image
              src="/greener_alternatives.jpg"
              alt="Greener product alternatives"
              fill
              className="lpFeatureImgEl"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <span className="lpFeatureTag">
            <MdSwapHoriz size={13} /> Alternatives
          </span>
          <h3>Find cleaner alternatives before you buy</h3>
          <p>
            The AI surfaces better-rated swaps from across platforms
            without sacrificing quality or budget.
          </p>
          <Link href="/analyze" className="lpLink">
            See how it works <FiArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── Quotes ── */}
      <section className="lpQuotes">
        <p className="lpQuotesEyebrow">Student Voices</p>
        <div className="lpQuoteGrid">
          {studentHighlights.map((item) => (
            <blockquote key={item.id} className="lpQuote">
              <p>"{item.text}"</p>
              <footer>{item.student}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ── Posters ── */}
      <section className="lpPosters">
        <div className="lpPostersHeader">
          <span className="lpPostersEyebrow">Portfolio</span>
          <h2>Research Posters</h2>
        </div>
        <div className="lpPosterGrid">
          <div className="lpPosterItem">
            <div className="lpPosterImgWrap">
              <Image
                src="/poster1.png"
                alt="Eco Action Campaign poster"
                fill
                className="lpPosterImgEl"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="lpPosterMeta">
              <strong>Eco Action Campaign</strong>
              <span>Single-use plastic awareness &amp; reusable swaps</span>
            </div>
          </div>
          <div className="lpPosterItem">
            <div className="lpPosterImgWrap">
              <Image
                src="/poster2_green_living_guide.png"
                alt="Green Living Guide poster"
                fill
                className="lpPosterImgEl"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="lpPosterMeta">
              <strong>Green Living Guide</strong>
              <span>Daily habits for lower carbon impact in dorms</span>
            </div>
          </div>
          <div className="lpPosterItem">
            <div className="lpPosterImgWrap">
              <Image
                src="/thumbnail.png"
                alt="GreenCart thumbnail"
                fill
                className="lpPosterImgEl"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="lpPosterMeta">
              <strong>Future of Sustainable Shopping</strong>
              <span>How AI helps consumers make cleaner purchases</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Research ── */}
      <section className="lpResearch">
        <div className="lpResearchText">
          <p className="lpPostersEyebrow">Featured Research</p>
          <h2>Consumer Behavior &amp; Sustainability</h2>
          <p>
            USF student research on how daily choices shape environmental
            outcomes — published as a live case study.
          </p>
          <a
            href="https://env-blog.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="lpLink"
          >
            Read the research <FiArrowUpRight size={15} />
          </a>
        </div>
        <div className="lpResearchImg">
          <Image
            src="/background_landing.jpg"
            alt="Research background"
            fill
            className="lpFeatureImgEl"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lpCta">
        <h2>Ready to build a cleaner cart?</h2>
        <div className="lpCtaActions">
          <Link href="/marketplace" className="lpBtnDark">
            Go to Marketplace <FiArrowRight size={16} />
          </Link>
          <Link href="/analyze" className="lpBtnDarkOutline">
            Analyze a URL
          </Link>
        </div>
      </section>

    </main>
  );
}

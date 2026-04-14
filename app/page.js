import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { MdBarChart, MdSwapHoriz } from "react-icons/md";
import Navbar from "@/components/navbar";
import {
  CountUpStat,
  TypeWriter,
  FloatingCard,
  FeatureColAnimated,
  QuoteAnimated,
  ScrollReveal,
} from "@/components/landing-animations";
import {
  platformImpactMetrics,
  studentHighlights,
} from "@/data/impact-metrics";

const features = [
  {
    src: "/ai_sustainable_score.png",
    alt: "AI sustainability score dashboard",
    tag: { icon: MdBarChart, label: "AI Analysis" },
    heading: "Transparent sustainability scoring",
    body: "Paste any product URL and get a 0–100 score across materials, labor ethics, packaging, and lifecycle.",
    link: { href: "/analyze", label: "Try the analyzer" },
  },
  {
    src: "/products_flat_lay.jpg",
    alt: "Eco products flat lay",
    tag: { icon: MdSwapHoriz, label: "Marketplace" },
    heading: "40+ curated eco products",
    body: "Browse by sustainability score, price, and category — with student feedback from USF, HCC, and UTampa.",
    link: { href: "/marketplace", label: "Browse marketplace" },
  },
  {
    src: "/greener_alternatives.jpg",
    alt: "Greener product alternatives",
    tag: { icon: MdSwapHoriz, label: "Alternatives" },
    heading: "Find cleaner alternatives before you buy",
    body: "The AI surfaces better-rated swaps from across platforms without sacrificing quality or budget.",
    link: { href: "/analyze", label: "See how it works" },
  },
];

export default function HomePage() {
  return (
    <main className="lp">
      <Navbar />

      {/* ── Hero ── */}
      <section className="lpHero">
        <div className="lpHeroContent">
          <p className="lpEyebrow lpEyebrowAnim">Smart Shopping · Tampa Bay</p>
          <TypeWriter
            lines={["Shop greener.", "Score smarter."]}
            className="lpHeroH1"
          />
          <p className="lpHeroSub lpHeroSubAnim">
            AI sustainability scoring for 40+ eco products. Analyze any URL,
            find better alternatives, and track your impact.
          </p>
          <div className="lpHeroActions lpHeroActionsAnim">
            <Link href="/marketplace" className="lpBtnDark">
              Open Marketplace <FiArrowRight size={16} />
            </Link>
            <Link href="/analyze" className="lpBtnDarkOutline">
              Analyze a Product
            </Link>
          </div>
        </div>

        <FloatingCard>
          <Image
            src="/hero_sustainable shopping.webp"
            alt="Sustainable shopping"
            fill
            priority
            className="lpHeroCardImg"
            sizes="(max-width: 768px) 90vw, 420px"
          />
        </FloatingCard>
      </section>

      {/* ── Stats strip ── */}
      <section className="lpStats">
        {platformImpactMetrics.map((m, i) => (
          <CountUpStat key={m.id} value={m.value} label={m.label} index={i} />
        ))}
      </section>

      {/* ── Features row ── */}
      <section className="lpFeatureRow">
        {features.map((f, i) => (
          <FeatureColAnimated key={f.alt} index={i}>
            <div className="lpFeatureColImg">
              <Image
                src={f.src}
                alt={f.alt}
                fill
                className="lpFeatureImgEl"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <span className="lpFeatureTag">
              <f.tag.icon size={13} /> {f.tag.label}
            </span>
            <h3>{f.heading}</h3>
            <p>{f.body}</p>
            <Link href={f.link.href} className="lpLink">
              {f.link.label} <FiArrowUpRight size={13} />
            </Link>
          </FeatureColAnimated>
        ))}
      </section>

      {/* ── Quotes ── */}
      <ScrollReveal className="lpQuotes">
        <p className="lpQuotesEyebrow">Student Voices</p>
        <div className="lpQuoteGrid">
          {studentHighlights.map((item, i) => (
            <QuoteAnimated key={item.id} index={i}>
              <p>"{item.text}"</p>
              <footer>{item.student}</footer>
            </QuoteAnimated>
          ))}
        </div>
      </ScrollReveal>

      {/* ── Posters ── */}
      <ScrollReveal className="lpPosters">
        <div className="lpPostersHeader">
          <span className="lpPostersEyebrow">Portfolio</span>
          <h2>Research Posters</h2>
        </div>
        <div className="lpPosterGrid">
          {[
            { src: "/poster1.png", alt: "Eco Action Campaign poster", title: "Eco Action Campaign", desc: "Single-use plastic awareness & reusable swaps" },
            { src: "/poster2_green_living_guide.png", alt: "Green Living Guide poster", title: "Green Living Guide", desc: "Daily habits for lower carbon impact in dorms" },
            { src: "/thumbnail.png", alt: "GreenCart thumbnail", title: "Future of Sustainable Shopping", desc: "How AI helps consumers make cleaner purchases" },
          ].map((poster, i) => (
            <div key={poster.src} className="lpPosterItem lpPosterItemAnim" style={{ "--p-delay": `${i * 100}ms` }}>
              <div className="lpPosterImgWrap">
                <Image src={poster.src} alt={poster.alt} fill className="lpPosterImgEl" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="lpPosterMeta">
                <strong>{poster.title}</strong>
                <span>{poster.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* ── Research ── */}
      <section className="lpResearch">
        <ScrollReveal className="lpResearchText" delay={0}>
          <p className="lpPostersEyebrow">Featured Research</p>
          <h2>Consumer Behavior &amp; Sustainability</h2>
          <p>
            USF student research on how daily choices shape environmental
            outcomes — published as a live case study.
          </p>
          <a href="https://env-blog.vercel.app/" target="_blank" rel="noreferrer" className="lpLink">
            Read the research <FiArrowUpRight size={15} />
          </a>
        </ScrollReveal>
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
      <ScrollReveal className="lpCta">
        <h2>Ready to build a cleaner cart?</h2>
        <div className="lpCtaActions">
          <Link href="/marketplace" className="lpBtnDark">
            Go to Marketplace <FiArrowRight size={16} />
          </Link>
          <Link href="/analyze" className="lpBtnDarkOutline">
            Analyze a URL
          </Link>
        </div>
      </ScrollReveal>
    </main>
  );
}

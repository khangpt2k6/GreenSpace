"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  FiArrowLeft, FiExternalLink, FiAlertCircle,
  FiCheckCircle, FiShield, FiTrendingUp, FiList, FiZap,
  FiWind, FiInfo
} from "react-icons/fi";
import { MdEco, MdRecycling, MdOutlineEnergySavingsLeaf, MdCo2 } from "react-icons/md";

function scoreColor(v) {
  if (v >= 80) return "#16a34a";
  if (v >= 60) return "#ca8a04";
  return "#dc2626";
}

function scoreBg(v) {
  if (v >= 80) return "#dcfce7";
  if (v >= 60) return "#fef9c3";
  return "#fee2e2";
}

function carbonColor(cat) {
  const map = { "Very Low": "#16a34a", "Low": "#65a30d", "Moderate": "#ca8a04", "High": "#ea580c", "Very High": "#dc2626" };
  return map[cat] || "#6b7280";
}

function carbonBg(cat) {
  const map = { "Very Low": "#dcfce7", "Low": "#ecfccb", "Moderate": "#fef9c3", "High": "#ffedd5", "Very High": "#fee2e2" };
  return map[cat] || "#f3f4f6";
}

function carbonBarWidth(cat) {
  const map = { "Very Low": 15, "Low": 32, "Moderate": 55, "High": 76, "Very High": 95 };
  return map[cat] || 50;
}

function CarbonCard({ carbon }) {
  if (!carbon) return null;
  const { kgCO2e, category, comparison, lifecycle, mainDrivers } = carbon;
  const color = carbonColor(category);
  const bg = carbonBg(category);
  const barW = carbonBarWidth(category);

  return (
    <article className="glass analyzeCard analyzeCarbonCard analyzeEnter" style={{ "--enter-delay": "260ms" }}>
      <div className="analyzeCardHeader">
        <MdCo2 size={22} style={{ color }} />
        <h3>Carbon Footprint Estimate</h3>
        <span className="carbonBadge" style={{ background: bg, color }}>{category}</span>
      </div>

      <div className="carbonKgRow">
        <span className="carbonKgNum" style={{ color }}>{kgCO2e}</span>
        <span className="carbonKgUnit">kg CO₂e</span>
      </div>

      <div className="carbonBar">
        <div className="carbonBarFill" style={{ width: `${barW}%`, background: color }} />
        <div className="carbonBarLabels">
          <span>Very Low</span><span>Low</span><span>Moderate</span><span>High</span><span>Very High</span>
        </div>
      </div>

      <div className="carbonComparison">
        <FiWind size={14} style={{ color: "#6b7280", flexShrink: 0 }} />
        <span>{comparison}</span>
      </div>

      {lifecycle && (
        <div className="carbonLifecycle">
          <FiInfo size={13} style={{ color: "#6b7280", flexShrink: 0, marginTop: 2 }} />
          <span>{lifecycle}</span>
        </div>
      )}

      {mainDrivers?.length > 0 && (
        <div className="carbonDrivers">
          <p className="carbonDriversLabel">Main emission drivers</p>
          <div className="carbonDriversList">
            {mainDrivers.map((d, i) => (
              <span key={i} className="carbonDriver">{d}</span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function ScoreRing({ value }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const filled = (value / 100) * circ;
  return (
    <svg viewBox="0 0 100 100" className="scoreRingSvg" aria-label={`Score: ${value}/100`}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={scoreColor(value)}
        strokeWidth="10"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
      <text x="50" y="54" textAnchor="middle" fontSize="20" fontWeight="800" fill={scoreColor(value)}>
        {value}
      </text>
    </svg>
  );
}

function LoadingState({ url }) {
  const steps = [
    { icon: <FiExternalLink />, label: "Fetching product page..." },
    { icon: <MdEco />, label: "Extracting product data..." },
    { icon: <MdOutlineEnergySavingsLeaf />, label: "Running AI sustainability analysis..." },
    { icon: <MdRecycling />, label: "Finding greener alternatives..." }
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1800),
      setTimeout(() => setStep(2), 4500),
      setTimeout(() => setStep(3), 8000)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="analyzeLoading">
      <div className="analyzeLoadingCard glass">
        <div className="analyzeLoadingIcon">
          <MdEco size={40} style={{ color: "var(--accent)" }} />
        </div>
        <h2>Analyzing Product</h2>
        <p className="analyzeLoadingUrl">{url}</p>
        <div className="analyzeSteps">
          {steps.map((s, i) => (
            <div key={i} className={`analyzeStep ${i <= step ? "analyzeStep--done" : ""} ${i === step ? "analyzeStep--active" : ""}`}>
              <span className="analyzeStepIcon">{s.icon}</span>
              <span>{s.label}</span>
              {i < step && <FiCheckCircle size={14} style={{ color: "#16a34a", marginLeft: "auto" }} />}
              {i === step && <span className="analyzeStepSpinner" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, url }) {
  return (
    <div className="analyzeError">
      <div className="analyzeErrorCard glass">
        <FiAlertCircle size={44} style={{ color: "#dc2626" }} />
        <h2>Analysis Failed</h2>
        <p>{message}</p>
        <p className="analyzeLoadingUrl">{url}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
          <Link href="/marketplace" className="btnGhost">
            <FiArrowLeft size={14} /> Back to Marketplace
          </Link>
          <button className="btnPrimary" onClick={() => window.location.reload()}>
            <FiZap size={14} /> Retry
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultsView({ result, url }) {
  const router = useRouter();
  const analysis = result.analysis || {};
  const product = result.product || {};
  const score = analysis.overallScore || 0;
  const categoryScores = Object.entries(analysis.categoryScores || {});
  const alternatives = analysis.greenerAlternatives || [];
  const carbon = analysis.carbonEstimate || null;

  return (
    <main className="page">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <header className="siteNav glass analyzeEnter" style={{ "--enter-delay": "0ms" }}>
        <p className="brand">GreenCart</p>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/community">Community</Link>
          <Link href="/guide">Guide</Link>
          <Link href="/survey">Survey</Link>
        </nav>
      </header>

      {/* Back bar */}
      <div className="analyzeBackBar analyzeEnter" style={{ "--enter-delay": "60ms" }}>
        <button className="btnGhost analyzeBackBtn" onClick={() => router.back()}>
          <FiArrowLeft size={15} /> Back to Marketplace
        </button>
        <span className="analyzeBackUrl">{url}</span>
      </div>

      {/* Hero score */}
      <section className="glass analyzeHero analyzeEnter" style={{ "--enter-delay": "120ms" }}>
        <div className="analyzeHeroLeft">
          <h1 className="analyzeProductTitle">{product.title || "Product Analysis"}</h1>
          {product.description && (
          <p className="analyzeProductDesc">{product.description}</p>
        )}
        {product.fetchWarning && (
          <div className="analyzeFetchWarning">
            <FiAlertCircle size={13} />
            <span>{product.fetchWarning}</span>
          </div>
        )}
          <div className="analyzeHeroMeta">
            {product.price && (
              <span className="metaTag">{product.price}</span>
            )}
            <span className="metaTag" style={{ background: scoreBg(score), color: scoreColor(score), fontWeight: 700 }}>
              {analysis.verdict || "Assessed"}
            </span>
            <span className="metaTag">Confidence: {analysis.confidence || "N/A"}</span>
          </div>
          <p className="analyzeHeroSummary">{analysis.summary}</p>
          <a href={product.sourceUrl} target="_blank" rel="noreferrer" className="btnGhost" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "0.5rem" }}>
            <FiExternalLink size={13} /> View Original Product
          </a>
        </div>
        <div className="analyzeHeroRight">
          <ScoreRing value={score} />
          <p className="analyzeScoreLabel">Sustainability<br />Score</p>
        </div>
      </section>

      {/* Category breakdown */}
      <section className="analyzeGrid analyzeEnter" style={{ "--enter-delay": "200ms" }}>
        <article className="glass analyzeCard">
          <div className="analyzeCardHeader">
            <FiTrendingUp size={18} style={{ color: "var(--accent)" }} />
            <h3>Category Breakdown</h3>
          </div>
          <div className="analyzeCatGrid">
            {categoryScores.map(([name, val]) => (
              <div key={name} className="analyzeCatRow">
                <div className="analyzeCatLabel">
                  <span>{name}</span>
                  <strong style={{ color: scoreColor(val) }}>{val}/100</strong>
                </div>
                <div className="analyzeCatBar">
                  <div
                    className="analyzeCatFill"
                    style={{ width: `${val}%`, background: scoreColor(val) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <CarbonCard carbon={carbon} />

        <article className="glass analyzeCard">
          <div className="analyzeCardHeader">
            <FiCheckCircle size={18} style={{ color: "#16a34a" }} />
            <h3>Strengths</h3>
          </div>
          <ul className="analyzeList analyzeList--green">
            {(analysis.strengths || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="glass analyzeCard">
          <div className="analyzeCardHeader">
            <FiAlertCircle size={18} style={{ color: "#dc2626" }} />
            <h3>Environmental Concerns</h3>
          </div>
          <ul className="analyzeList analyzeList--red">
            {(analysis.concerns || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="glass analyzeCard">
          <div className="analyzeCardHeader">
            <FiShield size={18} style={{ color: "#2563eb" }} />
            <h3>Recommendations</h3>
          </div>
          <ul className="analyzeList analyzeList--blue">
            {(analysis.recommendations || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      {/* Greener alternatives */}
      {alternatives.length > 0 && (
        <section className="glass analyzeAltSection analyzeEnter" style={{ "--enter-delay": "300ms" }}>
          <div className="analyzeCardHeader">
            <MdRecycling size={22} style={{ color: "var(--accent)" }} />
            <h2>Greener Alternatives Found</h2>
          </div>
          <p className="mutedLine" style={{ marginBottom: "1.25rem" }}>
            Real-time suggestions with better sustainability profiles
          </p>
          <div className="analyzeAltGrid">
            {alternatives.map((alt, i) => (
              <a
                key={i}
                href={alt.url}
                target="_blank"
                rel="noreferrer"
                className="analyzeAltCard"
              >
                <div className="analyzeAltTop">
                  <MdOutlineEnergySavingsLeaf size={20} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <h4>{alt.name}</h4>
                </div>
                <p className="analyzeAltReason">{alt.reason}</p>
                {alt.estimatedScore && (
                  <span className="analyzeAltScore" style={{ background: scoreBg(alt.estimatedScore), color: scoreColor(alt.estimatedScore) }}>
                    Est. {alt.estimatedScore}/100
                  </span>
                )}
                <span className="analyzeAltLink">
                  <FiExternalLink size={12} /> Open product
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Analyze another */}
      <section className="glass analyzeAnotherSection analyzeEnter" style={{ "--enter-delay": "380ms" }}>
        <FiList size={20} style={{ color: "var(--accent)" }} />
        <div>
          <h3>Analyze Another Product</h3>
          <p className="mutedLine">Paste any product URL to run a new sustainability check</p>
        </div>
        <AnalyzeAnotherForm />
      </section>
    </main>
  );
}

function AnalyzeAnotherForm() {
  const router = useRouter();
  const [val, setVal] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = val.trim();
    if (!trimmed) return;
    router.push(`/analyze?url=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form className="analyzeAnotherForm" onSubmit={handleSubmit}>
      <input
        type="url"
        placeholder="https://store.com/product-page"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="analyzeAnotherInput"
      />
      <button type="submit" className="btnPrimary" disabled={!val.trim()}>
        <FiZap size={14} /> Analyze
      </button>
    </form>
  );
}

function AnalyzePageInner() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) {
      setError("No product URL provided.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setResult(null);
    setError("");

    async function run() {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        });
        const data = await res.json();
        if (!cancelled) {
          if (!res.ok) throw new Error(data.error || "Analysis failed.");
          setResult(data);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [url]);

  if (loading) return <LoadingState url={url} />;
  if (error)   return <ErrorState message={error} url={url} />;
  return <ResultsView result={result} url={url} />;
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<LoadingState url="Loading..." />}>
      <AnalyzePageInner />
    </Suspense>
  );
}

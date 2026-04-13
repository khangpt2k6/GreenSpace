"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { productStudentFeedback } from "@/data/impact-metrics";

function scoreClass(value) {
  if (value >= 85) return "badge badge--great";
  if (value >= 70) return "badge badge--ok";
  return "badge badge--warn";
}

function badgeClass(value) {
  if (!value) return "badge badge--muted";
  if (value >= 75) return "badge badge--great";
  if (value >= 50) return "badge badge--ok";
  return "badge badge--warn";
}

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["EcoLiving", "EcoTech"]);
  const [minRating, setMinRating] = useState(3);
  const [maxPrice, setMaxPrice] = useState(150);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedCount, setSelectedCount] = useState(0);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchCategory = selectedCategories.includes(product.category);
      const matchRating = product.rating >= minRating;
      const matchPrice = product.price <= maxPrice;
      const matchQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchRating && matchPrice && matchQuery;
    });
  }, [query, selectedCategories, minRating, maxPrice]);

  const score = result?.analysis?.overallScore || 0;
  const confidence = result?.analysis?.confidence || "N/A";
  const verdict = result?.analysis?.verdict || "Unknown";
  const categoryEntries = useMemo(
    () => Object.entries(result?.analysis?.categoryScores || {}),
    [result]
  );
  const feedbackByProductId = useMemo(
    () =>
      Object.fromEntries(productStudentFeedback.map((entry) => [entry.productId, entry])),
    []
  );

  function toggleCategory(category) {
    setSelectedCategories((current) => {
      if (current.includes(category)) {
        return current.filter((item) => item !== category);
      }
      return [...current, category];
    });
  }

  function quickAnalyzeProduct(product) {
    setUrl(product.url);
    setSelectedCount((count) => count + 1);
    const analyzerSection = document.getElementById("analyzer");
    if (analyzerSection) {
      analyzerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function handleAnalyze(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to analyze URL.");
      setResult(data);
    } catch (requestError) {
      setError(requestError.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
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

      <section className="glass marketHeader">
        <h1>Green Marketplace</h1>
        <p>
          Discover products with better environmental profiles and analyze any
          product link before buying.
        </p>
        <p className="mutedLine">
          {products.length} products available · {filteredProducts.length} matching filters
        </p>
        <input
          className="marketSearch"
          type="search"
          placeholder="Search products, categories..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </section>

      <section className="marketLayout">
        <aside className="glass filterPanel">
          <h3>Category</h3>
          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("EcoLiving")}
              onChange={() => toggleCategory("EcoLiving")}
            />
            EcoLiving
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("EcoTech")}
              onChange={() => toggleCategory("EcoTech")}
            />
            EcoTech
          </label>

          <h3>Rating</h3>
          <div className="rangeRow">
            <span>{minRating.toFixed(1)}+</span>
            <input
              type="range"
              min={1}
              max={5}
              step={0.1}
              value={minRating}
              onChange={(event) => setMinRating(Number(event.target.value))}
            />
          </div>

          <h3>Price Range</h3>
          <div className="rangeRow">
            <span>$0 - ${maxPrice}</span>
            <input
              type="range"
              min={20}
              max={200}
              step={1}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
          </div>
        </aside>

        <section className="productGrid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="glass productCard">
              <img src={product.image} alt={product.name} />
              <div className="productBody">
                <h4>{product.name}</h4>
                <p className="mutedLine">
                  ${product.price.toFixed(2)} · {product.rating.toFixed(1)} stars
                </p>
                <p className={scoreClass(product.sustainability)}>
                  Sustainability {product.sustainability}/100
                </p>
                {feedbackByProductId[product.id] ? (
                  <div className="productFeedbackMeta">
                    <p className="mutedLine">
                      Used by {feedbackByProductId[product.id].studentsUsed} students ·{" "}
                      {feedbackByProductId[product.id].reviews} feedback entries
                    </p>
                    <p className="feedbackSnippet">
                      "{feedbackByProductId[product.id].feedback}"
                    </p>
                  </div>
                ) : (
                  <p className="mutedLine">
                    Student feedback data is being collected for this product.
                  </p>
                )}
                <div className="productActions">
                  <a href={product.url} target="_blank" rel="noreferrer" className="btnPrimary">
                    View Details
                  </a>
                  <button type="button" className="btnGhost" onClick={() => quickAnalyzeProduct(product)}>
                    Analyze This
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>

      <section className="glass analyzerBlock" id="analyzer">
        <h2>Analyze Any Product URL</h2>
        <p className="mutedLine">
          {selectedCount > 0
            ? `Product URL prefilled ${selectedCount} time(s). You can still paste any URL manually.`
            : "Choose a marketplace item and click Analyze This to prefill its URL."}
        </p>
        <form onSubmit={handleAnalyze} className="analyzerForm">
          <input
            type="url"
            placeholder="https://store.com/product-page"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Product"}
          </button>
        </form>
        {error ? <p className="errorText">{error}</p> : null}
      </section>

      {result ? (
        <section className="resultsGrid">
          <article className="glass panel">
            <h2>Product Snapshot</h2>
            <p>
              <strong>Name:</strong> {result.product?.title || "Unknown"}
            </p>
            <p>
              <strong>Price:</strong> {result.product?.price || "Unknown"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {result.product?.description || "No description available."}
            </p>
            <p>
              <strong>Source:</strong>{" "}
              <a href={result.product?.sourceUrl} target="_blank" rel="noreferrer">
                {result.product?.sourceUrl}
              </a>
            </p>
          </article>

          <article className="glass panel">
            <h2>Sustainability Score</h2>
            <div className="scoreRow">
              <span className={badgeClass(score)}>{score}/100</span>
              <span className="metaTag">{verdict}</span>
              <span className="metaTag">Confidence: {confidence}</span>
            </div>
            <p>{result.analysis?.summary}</p>
            <div className="categoryGrid">
              {categoryEntries.map(([name, value]) => (
                <div key={name} className="categoryCard">
                  <p>{name}</p>
                  <strong>{value}/100</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="glass panel">
            <h2>Environmental Aspects</h2>
            <h3>Strengths</h3>
            <ul>
              {(result.analysis?.strengths || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>Concerns</h3>
            <ul>
              {(result.analysis?.concerns || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>Recommendations</h3>
            <ul>
              {(result.analysis?.recommendations || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="glass panel panel--wide">
            <h2>Greener Alternatives Across Platforms</h2>
            <div className="alternatives">
              {(result.analysis?.greenerAlternatives || []).map((item) => (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="alternative"
                  key={`${item.name}-${item.url}`}
                >
                  <h4>{item.name}</h4>
                  <p>{item.reason}</p>
                  <span>Open product</span>
                </a>
              ))}
            </div>
          </article>
        </section>
      ) : null}
    </main>
  );
}

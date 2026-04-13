"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { productStudentFeedback } from "@/data/impact-metrics";

function scoreClass(value) {
  if (value >= 85) return "badge badge--great";
  if (value >= 70) return "badge badge--ok";
  return "badge badge--warn";
}


export default function MarketplacePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["EcoLiving", "EcoTech", "EcoFashion"]);
  const [minRating, setMinRating] = useState(3);
  const [maxPrice, setMaxPrice] = useState(450);
  const [url, setUrl] = useState("");

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
    router.push(`/analyze?url=${encodeURIComponent(product.url)}`);
  }

  function handleAnalyze(event) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    router.push(`/analyze?url=${encodeURIComponent(trimmed)}`);
  }

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

      <section className="glass marketHeader" data-reveal style={{ "--reveal-delay": "70ms" }}>
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

      <section className="marketLayout" data-reveal style={{ "--reveal-delay": "120ms" }}>
        <aside className="glass filterPanel" data-reveal style={{ "--reveal-delay": "180ms" }}>
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
          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes("EcoFashion")}
              onChange={() => toggleCategory("EcoFashion")}
            />
            EcoFashion
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
              max={450}
              step={1}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
          </div>
        </aside>

        <section className="productGrid">
          {filteredProducts.map((product, index) => (
            <article
              key={product.id}
              className="glass productCard"
              data-reveal
              style={{ "--reveal-delay": `${240 + (index % 6) * 45}ms` }}
            >
              <img src={product.image} alt={product.name} />
              <div className="productBody">
                <h4>{product.name}</h4>
                <p className="mutedLine">
                  ${product.price.toFixed(2)} · {product.rating.toFixed(1)} stars
                </p>
                <div className="productTagRow">
                  <span className={scoreClass(product.sustainability)}>
                    {product.sustainability}/100
                  </span>
                  {product.resale && (
                    <span className="badge badge--resale">♻ Resale</span>
                  )}
                  <span className="badge badge--muted">{product.category}</span>
                </div>
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

      <section
        className="glass analyzerBlock"
        id="analyzer"
        data-reveal
        style={{ "--reveal-delay": "220ms" }}
      >
        <h2>Analyze Any Product URL</h2>
        <p className="mutedLine">
          Paste any product link — GreenCart AI will instantly score its sustainability and find greener alternatives.
        </p>
        <form onSubmit={handleAnalyze} className="analyzerForm">
          <input
            type="url"
            placeholder="https://store.com/product-page"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
          <button type="submit" disabled={!url.trim()}>
            Analyze Product
          </button>
        </form>
      </section>
    </main>
  );
}

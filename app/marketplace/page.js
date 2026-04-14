"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import {
  FiSearch, FiSliders, FiZap, FiExternalLink,
  FiStar, FiRefreshCw, FiGrid, FiList, FiUpload,
  FiX, FiImage, FiCheck, FiPlus
} from "react-icons/fi";
import {
  MdEco, MdDevices, MdCheckroom, MdHome,
  MdVerified, MdTrendingUp, MdLocalOffer
} from "react-icons/md";
import { products as staticProducts } from "@/data/products";
import { productStudentFeedback } from "@/data/impact-metrics";
import { createBrowserSupabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "all",        label: "All",        icon: FiGrid },
  { id: "EcoLiving",  label: "EcoLiving",  icon: MdHome },
  { id: "EcoTech",    label: "EcoTech",    icon: MdDevices },
  { id: "EcoFashion", label: "EcoFashion", icon: MdCheckroom },
];

const EMPTY_FORM = {
  name: "", category: "EcoLiving", description: "",
  price: "", productUrl: "", sustainability: 70, resale: false,
};

function Stars({ rating }) {
  return (
    <span className="mktStars">
      {[1,2,3,4,5].map((s) => (
        <FiStar
          key={s}
          size={11}
          className={s <= Math.round(rating) ? "mktStarFilled" : "mktStarEmpty"}
        />
      ))}
      <span className="mktStarNum">{Number(rating).toFixed(1)}</span>
    </span>
  );
}

function ScorePill({ value }) {
  const color = value >= 85 ? "#16a34a" : value >= 70 ? "#ca8a04" : "#dc2626";
  const bg    = value >= 85 ? "#dcfce7" : value >= 70 ? "#fef9c3" : "#fee2e2";
  return (
    <span className="mktScorePill" style={{ color, background: bg }}>
      <MdEco size={11} /> {value}/100
    </span>
  );
}

function UploadModal({ onClose, onSuccess, user }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  function handleInput(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        const supabase = createBrowserSupabase();
        const ext = imageFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("product-images")
          .upload(path, imageFile, { upsert: false });

        if (uploadErr) throw new Error("Image upload failed: " + uploadErr.message);

        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          imageUrl,
          authorName: user?.fullName || user?.username || "GreenCart Member",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to upload product.");

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mktModalOverlay" onClick={onClose}>
      <div className="mktModal glass" onClick={(e) => e.stopPropagation()}>
        <div className="mktModalHeader">
          <h3><FiUpload size={18} /> List a Product</h3>
          <button type="button" className="mktModalClose" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mktModalForm">
          {/* Image */}
          <div
            className="mktImageUpload"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="mktImagePreview" />
            ) : (
              <div className="mktImagePlaceholder">
                <FiImage size={28} />
                <span>Click to upload image</span>
                <span className="mktImageHint">JPG, PNG, WEBP · max 5 MB</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </div>

          <div className="mktModalGrid">
            <div className="mktFormGroup mktFormGroupFull">
              <label>Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleInput}
                placeholder="e.g. Bamboo Water Bottle"
                required
              />
            </div>

            <div className="mktFormGroup">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleInput}>
                <option value="EcoLiving">EcoLiving</option>
                <option value="EcoTech">EcoTech</option>
                <option value="EcoFashion">EcoFashion</option>
              </select>
            </div>

            <div className="mktFormGroup">
              <label>Price (USD) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInput}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="mktFormGroup mktFormGroupFull">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInput}
                placeholder="What makes this product eco-friendly?"
                rows={3}
              />
            </div>

            <div className="mktFormGroup mktFormGroupFull">
              <label>Product URL</label>
              <input
                type="url"
                name="productUrl"
                value={form.productUrl}
                onChange={handleInput}
                placeholder="https://store.com/product"
              />
            </div>

            <div className="mktFormGroup mktFormGroupFull">
              <label>
                Sustainability Score: <strong>{form.sustainability}/100</strong>
              </label>
              <input
                type="range"
                name="sustainability"
                min={0}
                max={100}
                value={form.sustainability}
                onChange={handleInput}
                className="mktRange"
              />
              <div className="mktSustainRow">
                <span style={{ color: "#dc2626" }}>Low</span>
                <span style={{ color: "#ca8a04" }}>Medium</span>
                <span style={{ color: "#16a34a" }}>High</span>
              </div>
            </div>

            <div className="mktFormGroup">
              <label className="mktCheckRow">
                <input
                  type="checkbox"
                  name="resale"
                  checked={form.resale}
                  onChange={handleInput}
                />
                <span><FiRefreshCw size={13} /> This is a resale item</span>
              </label>
            </div>
          </div>

          {error && <p className="mktModalError">{error}</p>}

          <div className="mktModalFooter">
            <button type="button" className="btnGhost" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="mktAnalyzerBtn"
              disabled={submitting || !form.name || !form.price}
            >
              {submitting ? "Uploading…" : <><FiCheck size={14} /> List Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [allProducts, setAllProducts]   = useState(staticProducts);
  const [loadingDB, setLoadingDB]       = useState(true);
  const [query, setQuery]               = useState("");
  const [activeTab, setActiveTab]       = useState("all");
  const [minRating, setMinRating]       = useState(3);
  const [maxPrice, setMaxPrice]         = useState(450);
  const [resaleOnly, setResaleOnly]     = useState(false);
  const [url, setUrl]                   = useState("");
  const [gridView, setGridView]         = useState(true);
  const [showUpload, setShowUpload]     = useState(false);

  const feedbackMap = useMemo(
    () => Object.fromEntries(productStudentFeedback.map((e) => [e.productId, e])),
    []
  );

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.products) setAllProducts(json.products);
    } catch {
      // keep static fallback
    } finally {
      setLoadingDB(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProducts.filter((p) => {
      if (activeTab !== "all" && p.category !== activeTab) return false;
      if (p.rating < minRating) return false;
      if (p.price > maxPrice) return false;
      if (resaleOnly && !p.resale) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, activeTab, minRating, maxPrice, resaleOnly, allProducts]);

  const featured = allProducts.filter((p) => p.sustainability >= 88).slice(0, 3);

  function analyze(product) {
    router.push(`/analyze?url=${encodeURIComponent(product.url)}`);
  }

  function handleAnalyze(e) {
    e.preventDefault();
    const t = url.trim();
    if (t) router.push(`/analyze?url=${encodeURIComponent(t)}`);
  }

  function handleUploadSuccess() {
    fetchProducts();
  }

  return (
    <main className="mktPage">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
          user={user}
        />
      )}

      {/* ── Navbar ── */}
      <header className="siteNav glass" data-reveal style={{ "--reveal-delay": "0ms" }}>
        <p className="brand">GreenCart</p>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/community">Community</Link>
          <Link href="/guide">Guide</Link>
          <Link href="/survey">Survey</Link>
        </nav>
        <div className="navAuthRow">
          {isLoaded && (
            user ? (
              <>
                <button
                  className="mktUploadNavBtn"
                  onClick={() => setShowUpload(true)}
                >
                  <FiPlus size={14} /> List Product
                </button>
                <UserButton afterSignOutUrl="/marketplace" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="navSignInBtn">Sign in</button>
              </SignInButton>
            )
          )}
        </div>
      </header>

      {/* ── Search bar ── */}
      <div className="mktSearchBar glass" data-reveal style={{ "--reveal-delay": "50ms" }}>
        <div className="mktSearchWrap">
          <FiSearch size={17} className="mktSearchIcon" />
          <input
            type="search"
            placeholder="Search eco products, categories, brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mktSearchInput"
          />
        </div>
        <div className="mktSearchMeta">
          <span>{filtered.length} of {allProducts.length} products</span>
          <button
            className={`mktViewToggle ${gridView ? "active" : ""}`}
            onClick={() => setGridView(true)}
            title="Grid view"
          ><FiGrid size={15} /></button>
          <button
            className={`mktViewToggle ${!gridView ? "active" : ""}`}
            onClick={() => setGridView(false)}
            title="List view"
          ><FiList size={15} /></button>
        </div>
      </div>

      {/* ── Hero banner ── */}
      <section className="mktHeroBanner" data-reveal style={{ "--reveal-delay": "80ms" }}>
        <div className="mktHeroBannerLeft">
          <p className="eyebrow" style={{ color: "#fff" }}>
            <MdTrendingUp size={14} /> Top Eco Picks
          </p>
          <h2>Products that score<br /><span>85+</span> in sustainability</h2>
          <p>Verified by GreenCart AI across 5 environmental dimensions</p>
          {user ? (
            <button className="mktHeroCta" onClick={() => setShowUpload(true)}>
              <FiUpload size={14} /> List Your Product
            </button>
          ) : (
            <Link href="#products" className="mktHeroCta">Browse all →</Link>
          )}
        </div>
        <div className="mktHeroCards">
          {featured.map((p) => (
            <button
              key={p.id}
              className="mktHeroCard"
              onClick={() => analyze(p)}
              title={`Analyze ${p.name}`}
            >
              <img src={p.image} alt={p.name} />
              <div className="mktHeroCardBody">
                <p>{p.name}</p>
                <ScorePill value={p.sustainability} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Body: sidebar + grid ── */}
      <div className="mktBody" id="products" data-reveal style={{ "--reveal-delay": "110ms" }}>

        {/* Sidebar */}
        <aside className="glass mktSidebar">

          {/* Upload CTA for signed-in users */}
          {isLoaded && (
            user ? (
              <div className="mktSidebarSection">
                <button
                  className="mktUploadSideBtn"
                  onClick={() => setShowUpload(true)}
                >
                  <FiPlus size={15} /> List a Product
                </button>
              </div>
            ) : (
              <div className="mktSidebarSection mktSignInPrompt">
                <p>Sign in to list your eco products</p>
                <SignInButton mode="modal">
                  <button className="mktUploadSideBtn">Sign in to sell</button>
                </SignInButton>
              </div>
            )
          )}

          <div className="mktSidebarSection">
            <p className="mktSidebarLabel"><FiSliders size={13} /> Filters</p>

            <p className="mktFilterHead">Category</p>
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`mktCatBtn ${activeTab === id ? "mktCatBtn--active" : ""}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={15} /> {label}
                <span className="mktCatCount">
                  {id === "all" ? allProducts.length : allProducts.filter(p => p.category === id).length}
                </span>
              </button>
            ))}
          </div>

          <div className="mktSidebarSection">
            <p className="mktFilterHead">Min Rating</p>
            <div className="mktRangeRow">
              <Stars rating={minRating} />
              <input
                type="range" min={1} max={5} step={0.5}
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="mktRange"
              />
            </div>
          </div>

          <div className="mktSidebarSection">
            <p className="mktFilterHead">Max Price</p>
            <div className="mktRangeRow">
              <span className="mktRangeVal">${maxPrice}</span>
              <input
                type="range" min={10} max={450} step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mktRange"
              />
            </div>
          </div>

          <div className="mktSidebarSection">
            <p className="mktFilterHead">Condition</p>
            <label className="mktToggleRow">
              <span><FiRefreshCw size={13} /> Resale only</span>
              <input
                type="checkbox"
                checked={resaleOnly}
                onChange={(e) => setResaleOnly(e.target.checked)}
                className="mktToggle"
              />
            </label>
          </div>

          {/* AI Analyzer */}
          <div className="mktSidebarSection mktAnalyzerMini" id="analyzer">
            <p className="mktSidebarLabel"><FiZap size={13} /> AI Analyzer</p>
            <p className="mktAnalyzerDesc">Paste any product URL for an instant eco report</p>
            <form onSubmit={handleAnalyze} className="mktAnalyzerForm">
              <input
                type="url"
                placeholder="https://store.com/product"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mktAnalyzerInput"
              />
              <button
                type="submit"
                disabled={!url.trim()}
                className="mktAnalyzerBtn"
              >
                <FiZap size={13} /> Analyze
              </button>
            </form>
          </div>
        </aside>

        {/* Product grid */}
        <section className={`mktGrid ${gridView ? "mktGrid--grid" : "mktGrid--list"}`}>
          {loadingDB && (
            <div className="mktLoadingBar">
              <span className="mktLoadingDot" />
              <span>Loading marketplace…</span>
            </div>
          )}
          {filtered.length === 0 && !loadingDB ? (
            <div className="mktEmpty">
              <MdEco size={44} style={{ color: "var(--accent)", opacity: 0.4 }} />
              <p>No products match your filters.</p>
              <button className="btnGhost" onClick={() => { setActiveTab("all"); setResaleOnly(false); setMinRating(3); setMaxPrice(450); setQuery(""); }}>
                Reset filters
              </button>
            </div>
          ) : filtered.map((product, i) => (
            <article
              key={product.id}
              className={`mktCard ${product.isUserUploaded ? "mktCard--uploaded" : ""}`}
              data-reveal
              style={{ "--reveal-delay": `${(i % 8) * 40}ms` }}
            >
              {/* Image */}
              <div className="mktCardImg">
                <img src={product.image} alt={product.name} loading="lazy" />
                {product.resale && (
                  <span className="mktCardResaleBadge">
                    <FiRefreshCw size={10} /> Resale
                  </span>
                )}
                {product.isUserUploaded && (
                  <span className="mktCardCommunityBadge">
                    <MdVerified size={10} /> Community
                  </span>
                )}
                <div className="mktCardOverlay">
                  <button className="mktCardAnalyzeBtn" onClick={() => analyze(product)}>
                    <FiZap size={13} /> Analyze
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="mktCardBody">
                <p className="mktCardCat">{product.category}</p>
                <h4 className="mktCardName">{product.name}</h4>
                {product.authorName && (
                  <p className="mktCardAuthor">by {product.authorName}</p>
                )}
                <div className="mktCardRow">
                  <Stars rating={product.rating} />
                  {feedbackMap[product.id] && (
                    <span className="mktCardFeedbackCount">
                      ({feedbackMap[product.id].studentsUsed} students)
                    </span>
                  )}
                </div>
                <div className="mktCardBottom">
                  <span className="mktCardPrice">${Number(product.price).toFixed(2)}</span>
                  <ScorePill value={product.sustainability} />
                </div>
                {feedbackMap[product.id] && (
                  <p className="mktCardQuote">"{feedbackMap[product.id].feedback}"</p>
                )}
                <div className="mktCardActions">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mktBtnView"
                  >
                    <FiExternalLink size={12} /> View
                  </a>
                  <button
                    className="mktBtnAnalyze"
                    onClick={() => analyze(product)}
                  >
                    <FiZap size={12} /> AI Score
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

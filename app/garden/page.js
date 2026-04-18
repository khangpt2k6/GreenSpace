"use client";

import { useState, useMemo, useEffect } from "react";
import {
  FiMapPin,
  FiExternalLink,
  FiUsers,
  FiSearch,
  FiCheck,
  FiArrowRight,
  FiSun,
  FiDroplet,
  FiBookOpen,
  FiGlobe,
  FiInfo,
} from "react-icons/fi";
import { MdEco, MdNaturePeople, MdVolunteerActivism, MdLocalFlorist, MdFoodBank } from "react-icons/md";
import Navbar from "@/components/navbar";
import {
  naturePlaces,
  communityGardens,
  foodSecurityOrgs,
  gardenPageMeta,
} from "@/data/community-garden";

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: "nature",   label: "🌿 Enjoy Nature",         icon: MdNaturePeople },
  { id: "gardens",  label: "🌱 Community Gardens",     icon: MdLocalFlorist },
  { id: "food",     label: "🤝 Food & Giving Back",    icon: MdFoodBank },
];

// ── Type badge colors ─────────────────────────────────────────────────────────
const TYPE_STYLES = {
  "trail":            { color: "#065f46", bg: "#d1fae5", label: "Trail" },
  "botanical":        { color: "#5b21b6", bg: "#ede9fe", label: "Botanical Garden" },
  "state-park":       { color: "#1e40af", bg: "#dbeafe", label: "State Park" },
  "aquatic":          { color: "#0369a1", bg: "#e0f2fe", label: "Aquatic Preserve" },
  "park":             { color: "#166534", bg: "#dcfce7", label: "Park" },
  "farm":             { color: "#92400e", bg: "#fef3c7", label: "Farm" },
  "community-garden": { color: "#065f46", bg: "#d1fae5", label: "Community Garden" },
  "network":          { color: "#6b21a8", bg: "#f3e8ff", label: "Network" },
  "educational":      { color: "#1d4ed8", bg: "#eff6ff", label: "Educational" },
  "market":           { color: "#b45309", bg: "#fffbeb", label: "Farmers Market" },
  "food-bank":        { color: "#be123c", bg: "#ffe4e6", label: "Food Bank" },
  "advocacy":         { color: "#7c3aed", bg: "#f5f3ff", label: "Advocacy" },
  "nonprofit":        { color: "#0f766e", bg: "#ccfbf1", label: "Nonprofit" },
};

function TypeBadge({ type }) {
  const s = TYPE_STYLES[type] || { color: "#374151", bg: "#f3f4f6", label: type };
  return (
    <span className="gdTypeBadge" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

// ── Single place/garden card ──────────────────────────────────────────────────
function PlaceCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/og-image?url=${encodeURIComponent(item.website)}`)
      .then((r) => r.json())
      .then(({ image }) => {
        if (!cancelled && image) setImgSrc(image);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [item.website]);

  return (
    <article className="gdCard glass">
      {/* Image */}
      <div className="gdCardImg" style={{ position: "relative" }}>
        <img
          src={imgSrc}
          alt={item.name}
          style={{ opacity: loading ? 0.7 : 1, transition: "opacity 0.3s" }}
          onLoad={() => setLoading(false)}
          onError={(e) => { e.target.src = "/products_flat_lay.jpg"; setLoading(false); }}
        />
        <TypeBadge type={item.type} />
      </div>

      {/* Body */}
      <div className="gdCardBody">
        {/* Name + location */}
        <h3 className="gdCardName">{item.name}</h3>
        <p className="gdCardArea">
          <FiMapPin size={12} /> {item.area}
        </p>

        {/* Highlight banner */}
        {item.highlight && (
          <div className="gdHighlight">
            <FiInfo size={12} />
            {item.highlight}
          </div>
        )}

        {/* Description */}
        <p className={`gdCardDesc ${expanded ? "gdCardDesc--full" : ""}`}>
          {item.description}
        </p>
        <button
          type="button"
          className="gdReadMore"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>

        {/* Tags */}
        <div className="gdTagRow">
          {(item.tags || []).map((t) => (
            <span key={t} className="gdTag">{t}</span>
          ))}
        </div>

        {/* CTAs */}
        <div className="gdCardCtas">
          <a
            href={item.website}
            target="_blank"
            rel="noreferrer noopener"
            className="gdCtaBtn gdCtaBtn--primary"
          >
            <FiExternalLink size={13} /> Visit Site
          </a>
          {item.volunteerLink && (
            <a
              href={item.volunteerLink}
              target="_blank"
              rel="noreferrer noopener"
              className="gdCtaBtn gdCtaBtn--volunteer"
            >
              <MdVolunteerActivism size={14} /> Volunteer
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function GardenPage() {
  const [activeTab, setActiveTab]   = useState("nature");
  const [searchQuery, setSearchQuery] = useState("");

  const currentItems = useMemo(() => {
    const pool =
      activeTab === "nature"  ? naturePlaces :
      activeTab === "gardens" ? communityGardens :
      foodSecurityOrgs;

    const q = searchQuery.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter((item) => {
      const hay = [item.name, item.description, item.area, ...(item.tags || [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [activeTab, searchQuery]);

  const volunteerCount = [...naturePlaces, ...communityGardens, ...foodSecurityOrgs]
    .filter((i) => i.volunteerLink).length;

  return (
    <main className="gdPage">
      <Navbar />

      {/* ── Hero ── */}
      <section className="gdHero">
        {/* Decorative blobs */}
        <div className="gdHeroBlob gdHeroBlob--tl" aria-hidden />
        <div className="gdHeroBlob gdHeroBlob--br" aria-hidden />

        <div className="gdHeroInner">
          {/* Left: text */}
          <div className="gdHeroText">
            <span className="gdEyebrow">
              <MdEco size={14} /> Community · Nature · Tampa Bay
            </span>
            <h1 className="gdHeroH1">
              Community Gardens &amp;<br />Nature in Tampa Bay
            </h1>
            <p className="gdHeroSub">
              {gardenPageMeta.tagline} — Discover parks, trails, botanical gardens,
              community farms, and volunteer opportunities across Tampa Bay and Florida.
            </p>

            {/* Stats */}
            <div className="gdHeroStats">
              <div className="gdHeroStat">
                <strong>{gardenPageMeta.totalNaturePlaces}</strong>
                <span>Nature Spots</span>
              </div>
              <div className="gdHeroStatDiv" />
              <div className="gdHeroStat">
                <strong>{gardenPageMeta.totalCommunityGardens}</strong>
                <span>Gardens &amp; Farms</span>
              </div>
              <div className="gdHeroStatDiv" />
              <div className="gdHeroStat">
                <strong>{volunteerCount}</strong>
                <span>Volunteer Links</span>
              </div>
              <div className="gdHeroStatDiv" />
              <div className="gdHeroStat">
                <strong>{gardenPageMeta.totalFoodSecurityOrgs}</strong>
                <span>Food Orgs</span>
              </div>
            </div>
          </div>

          {/* Right: icon mosaic */}
          <div className="gdHeroMosaic" aria-hidden>
            {[
              { icon: FiSun,          label: "Sunshine",    color: "#f7b731" },
              { icon: MdLocalFlorist, label: "Gardens",     color: "#22b86a" },
              { icon: FiDroplet,      label: "Water",       color: "#3ba7ff" },
              { icon: MdNaturePeople, label: "Community",   color: "#22b86a" },
              { icon: FiBookOpen,     label: "Education",   color: "#a78bfa" },
              { icon: MdVolunteerActivism, label: "Volunteer", color: "#f7b731" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="gdMosaicTile" style={{ "--tile-color": color }}>
                <Icon size={26} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Info strip ── */}
      <div className="gdInfoStrip">
        <div className="gdInfoStrip__inner">
          <FiGlobe size={15} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <p>
            Using <strong>green products at home</strong> pairs beautifully with enjoying nature
            outdoors. These spaces are where the sustainable lifestyle becomes tangible —
            grow your own food, restore habitats, and enjoy Tampa Bay's incredible ecosystems.
          </p>
        </div>
      </div>

      {/* ── Tabs + search ── */}
      <div className="gdControls">
        {/* Tabs */}
        <div className="gdTabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`gdTab ${activeTab === tab.id ? "gdTab--active" : ""}`}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="gdSearchWrap glass">
          <FiSearch size={15} className="gdSearchIcon" />
          <input
            type="search"
            className="gdSearchInput"
            placeholder={`Search ${activeTab === "nature" ? "parks & trails" : activeTab === "gardens" ? "gardens & farms" : "organizations"}…`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <span className="gdSearchCount">{currentItems.length} found</span>
          )}
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="gdSectionLabel">
        {activeTab === "nature" && (
          <>
            <MdNaturePeople size={20} />
            <div>
              <h2>Enjoy Nature</h2>
              <p>Parks, trails, botanical gardens, and aquatic preserves across Tampa Bay &amp; Florida</p>
            </div>
          </>
        )}
        {activeTab === "gardens" && (
          <>
            <MdLocalFlorist size={20} />
            <div>
              <h2>Food &amp; Community Gardens</h2>
              <p>Grow food, volunteer, and connect with neighbors at community gardens and farms</p>
            </div>
          </>
        )}
        {activeTab === "food" && (
          <>
            <MdFoodBank size={20} />
            <div>
              <h2>Food Security &amp; Giving Back</h2>
              <p>Food banks, advocacy orgs, and nonprofits fighting hunger across Tampa Bay</p>
            </div>
          </>
        )}
      </div>

      {/* ── Card Grid ── */}
      {currentItems.length > 0 ? (
        <div className="gdGrid">
          {currentItems.map((item) => (
            <PlaceCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="gdEmpty">
          <MdNaturePeople size={52} style={{ color: "var(--accent)", opacity: 0.35 }} />
          <p>No results for "{searchQuery}"</p>
          <button
            type="button"
            className="gdCtaBtn gdCtaBtn--primary"
            onClick={() => setSearchQuery("")}
          >
            Clear search
          </button>
        </div>
      )}

      {/* ── Call-to-action footer banner ── */}
      <div className="gdCTABanner glass">
        <div className="gdCTABannerLeft">
          <MdVolunteerActivism size={28} className="gdCTAIcon" />
          <div>
            <h3 className="gdCTATitle">Ready to get your hands in the dirt?</h3>
            <p className="gdCTASub">
              {volunteerCount} of our listed spaces have direct volunteer sign-up links.
              Show up, grow food, restore habitats, and become part of the Tampa Bay
              sustainability community.
            </p>
          </div>
        </div>
        <a
          href="https://coalitionofcommunitygardens.weebly.com/about-us.html"
          target="_blank"
          rel="noreferrer noopener"
          className="gdCtaBtn gdCtaBtn--primary gdCtaBtn--lg"
        >
          Find a Garden Near You <FiArrowRight size={16} />
        </a>
      </div>

      <p className="siteCredit">
        GreenCart · Tampa Bay Community Gardens &amp; Nature · {gardenPageMeta.lastUpdated}
      </p>
    </main>
  );
}

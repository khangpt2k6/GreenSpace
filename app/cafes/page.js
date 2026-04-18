"use client";

import { useState, useMemo } from "react";
import {
  FiMapPin,
  FiClock,
  FiExternalLink,
  FiInstagram,
  FiSearch,
  FiStar,
  FiCheck,
  FiCalendar,
  FiCoffee,
} from "react-icons/fi";
import { MdEco, MdNaturePeople } from "react-icons/md";
import Navbar from "@/components/navbar";
import { solarpunkCafes, solarpunkCafesMeta } from "@/data/solarpunk-cafe";

// ── City filter options ───────────────────────────────────────────────────────
const CITIES = ["All", "Tampa", "St. Petersburg"];

// ── Vibe filter chips ─────────────────────────────────────────────────────────
const VIBES = [
  "zero-waste",
  "plant wall",
  "courtyard greenery",
  "community-first",
  "botanical",
  "vegan-friendly",
  "floral paradise",
  "outdoor garden",
];

// ── Solarpunk score color helper ─────────────────────────────────────────────
function scoreStyle(score) {
  if (score >= 95) return { color: "#059669", bg: "#d1fae5" };
  if (score >= 90) return { color: "#16a34a", bg: "#dcfce7" };
  if (score >= 85) return { color: "#65a30d", bg: "#ecfccb" };
  return { color: "#ca8a04", bg: "#fef9c3" };
}

// ── Single cafe card ─────────────────────────────────────────────────────────
function CafeCard({ cafe }) {
  const [expanded, setExpanded] = useState(false);
  const { color, bg } = scoreStyle(cafe.solarpunkScore);

  const primaryAddress = cafe.address;
  const hasMultipleLocations = !!(cafe.secondLocation || cafe.thirdLocation);

  return (
    <article className="spcCard glass">

      {/* ── Image ── */}
      <div className="spcCardImg">
        <img
          src={cafe.image}
          alt={`${cafe.name} — ${cafe.neighborhood}, ${cafe.city}`}
          onError={(e) => { e.target.src = "/products_flat_lay.jpg"; }}
        />

        {/* Solarpunk score badge */}
        <div
          className="spcScoreBadge"
          style={{ color, background: bg }}
          title="Solarpunk Score — how well this space embodies greenery, community, and eco values"
        >
          <MdEco size={12} />
          {cafe.solarpunkScore}/100
        </div>

        {/* Multi-location badge */}
        {hasMultipleLocations && (
          <div className="spcMultiBadge">
            <FiMapPin size={10} /> Multi-location
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="spcCardBody">

        {/* Header */}
        <div className="spcCardHeader">
          <div>
            <h3 className="spcCardName">{cafe.name}</h3>
            <p className="spcCardLocation">
              <FiMapPin size={12} />
              {cafe.neighborhood} · {cafe.city}, {cafe.state}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className={`spcCardDesc ${expanded ? "spcCardDesc--full" : ""}`}>
          {cafe.description}
        </p>
        <button
          type="button"
          className="spcReadMore"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>

        {/* Vibe tags */}
        <div className="spcVibeRow">
          {(cafe.vibe || []).map((v) => (
            <span key={v} className="spcVibe">🌿 {v}</span>
          ))}
        </div>

        {/* Feature list */}
        <ul className="spcFeatureList">
          {(cafe.features || []).slice(0, 4).map((f) => (
            <li key={f} className="spcFeatureItem">
              <FiCheck size={12} className="spcFeatureCheck" />
              {f}
            </li>
          ))}
        </ul>

        {/* Hours */}
        {cafe.hours && (
          <div className="spcInfoRow">
            <FiClock size={13} className="spcInfoIcon" />
            <div className="spcInfoText">
              {Object.values(cafe.hours).map((h, i) => (
                <span key={i} className="spcHoursLine">{h}</span>
              ))}
            </div>
          </div>
        )}

        {/* Menu highlights */}
        {(cafe.menuHighlights || []).length > 0 && (
          <div className="spcMenuRow">
            <FiCoffee size={13} className="spcInfoIcon" />
            <p className="spcMenuText">
              {cafe.menuHighlights.join(" · ")}
            </p>
          </div>
        )}

        {/* Community events */}
        {(cafe.communityEvents || []).length > 0 && (
          <div className="spcEventsList">
            {(cafe.communityEvents || []).map((ev) => (
              <div key={ev} className="spcEventChip">
                <FiCalendar size={11} />
                {ev}
              </div>
            ))}
          </div>
        )}

        {/* CTA row */}
        <div className="spcCardCtas">
          <a
            href={cafe.website}
            target="_blank"
            rel="noreferrer noopener"
            className="spcCtaBtn spcCtaBtn--primary"
          >
            <FiExternalLink size={14} /> Visit Website
          </a>
          {cafe.instagram && (
            <a
              href={`https://instagram.com/${cafe.instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer noopener"
              className="spcCtaBtn spcCtaBtn--ghost"
            >
              <FiInstagram size={14} /> Instagram
            </a>
          )}
        </div>

        {/* Address */}
        <p className="spcAddress">
          <FiMapPin size={11} /> {primaryAddress}
          {hasMultipleLocations && (
            <span className="spcAddressNote"> + more locations</span>
          )}
        </p>
      </div>
    </article>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CafesPage() {
  const [cityFilter, setCityFilter] = useState("All");
  const [vibeFilters, setVibeFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  function toggleVibe(vibe) {
    setVibeFilters((cur) =>
      cur.includes(vibe) ? cur.filter((v) => v !== vibe) : [...cur, vibe]
    );
  }

  const filtered = useMemo(() => {
    return solarpunkCafes.filter((cafe) => {
      // City filter
      if (cityFilter !== "All") {
        const cityMatch =
          cafe.city === cityFilter ||
          cafe.city.includes(cityFilter);
        if (!cityMatch) return false;
      }

      // Vibe filter (all selected vibes must match)
      if (vibeFilters.length > 0) {
        const cafeVibes = (cafe.vibe || []).join(" ").toLowerCase();
        const cafeFeats = (cafe.features || []).join(" ").toLowerCase();
        const allText = cafeVibes + " " + cafeFeats;
        const match = vibeFilters.every((v) =>
          allText.includes(v.toLowerCase())
        );
        if (!match) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const hay = [
          cafe.name, cafe.description, cafe.neighborhood,
          cafe.city, ...(cafe.features || []), ...(cafe.vibe || []),
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [cityFilter, vibeFilters, searchQuery]);

  const avgScore = Math.round(
    solarpunkCafes.reduce((acc, c) => acc + c.solarpunkScore, 0) / solarpunkCafes.length
  );

  return (
    <main className="spcPage">
      <Navbar />

      {/* ── Hero Banner ── */}
      <div className="spcHero">
        <div className="spcHeroLeaf spcHeroLeaf--tl" aria-hidden />
        <div className="spcHeroLeaf spcHeroLeaf--br" aria-hidden />

        <div className="spcHeroInner">
          <div className="spcHeroText">
            <span className="spcEyebrow">
              <MdEco size={15} /> Sustainable Dining · Tampa Bay
            </span>
            <h1 className="spcHeroH1">
              Solarpunk Cafés &amp; Coffee Shops
            </h1>
            <p className="spcHeroSub">
              {solarpunkCafesMeta.solarpunkDefinition}
            </p>

            {/* Stats row */}
            <div className="spcHeroStats">
              <div className="spcHeroStat">
                <strong>{solarpunkCafes.length}</strong>
                <span>Verified Cafés</span>
              </div>
              <div className="spcHeroStatDivider" />
              <div className="spcHeroStat">
                <strong>{avgScore}/100</strong>
                <span>Avg Eco Score</span>
              </div>
              <div className="spcHeroStatDivider" />
              <div className="spcHeroStat">
                <strong>2</strong>
                <span>Cities</span>
              </div>
              <div className="spcHeroStatDivider" />
              <div className="spcHeroStat">
                <strong>1</strong>
                <span>Zero-Waste Certified</span>
              </div>
            </div>
          </div>

          {/* Hero visual: stacked mini cards */}
          <div className="spcHeroVisual" aria-hidden>
            {solarpunkCafes.slice(0, 3).map((cafe, i) => (
              <div
                key={cafe.id}
                className="spcHeroMiniCard"
                style={{ "--i": i }}
              >
                <img src={cafe.image} alt="" />
                <span>{cafe.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="spcFilters glass">
        {/* Search */}
        <div className="spcSearchWrap">
          <FiSearch size={16} className="spcSearchIcon" />
          <input
            type="search"
            className="spcSearchInput"
            placeholder="Search cafés, vibes, features…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* City pills */}
        <div className="spcFilterSection">
          <span className="spcFilterLabel">
            <FiMapPin size={13} /> City
          </span>
          <div className="spcPillRow">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`spcPill ${cityFilter === c ? "spcPill--on" : ""}`}
                onClick={() => setCityFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Vibe pills */}
        <div className="spcFilterSection">
          <span className="spcFilterLabel">
            <MdEco size={13} /> Vibe
          </span>
          <div className="spcPillRow">
            {VIBES.map((v) => (
              <button
                key={v}
                type="button"
                className={`spcPill ${vibeFilters.includes(v) ? "spcPill--on" : ""}`}
                onClick={() => toggleVibe(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="spcResultCount">
          {filtered.length === 0
            ? "No cafés match your filters."
            : `${filtered.length} café${filtered.length !== 1 ? "s" : ""} found`}
          {(vibeFilters.length > 0 || cityFilter !== "All" || searchQuery) && (
            <button
              type="button"
              className="spcClearBtn"
              onClick={() => { setVibeFilters([]); setCityFilter("All"); setSearchQuery(""); }}
            >
              Clear filters
            </button>
          )}
        </p>
      </div>

      {/* ── Card Grid ── */}
      <div className="spcGrid">
        {filtered.map((cafe) => (
          <CafeCard key={cafe.id} cafe={cafe} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="spcEmpty">
          <MdNaturePeople size={48} style={{ color: "var(--accent)", opacity: 0.4 }} />
          <p>No cafés match your current filters.</p>
          <button
            type="button"
            className="spcCtaBtn spcCtaBtn--primary"
            onClick={() => { setVibeFilters([]); setCityFilter("All"); setSearchQuery(""); }}
          >
            Reset filters
          </button>
        </div>
      )}

      {/* ── Definition footer card ── */}
      <div className="spcDefCard glass">
        <MdEco size={22} className="spcDefIcon" />
        <div>
          <h4 className="spcDefTitle">What makes a café solarpunk?</h4>
          <p className="spcDefText">{solarpunkCafesMeta.solarpunkDefinition}</p>
        </div>
      </div>

      <p className="siteCredit">GreenCart · Tampa Bay Sustainable Dining · {solarpunkCafesMeta.lastUpdated}</p>
    </main>
  );
}

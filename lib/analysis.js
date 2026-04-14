import Anthropic from "@anthropic-ai/sdk";
import { load } from "cheerio";

// ─── Helpers ─────────────────────────────────────────────

function normalizeText(value) {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
}

function extractPrice(text) {
  if (!text) return null;
  const m = text.match(/([$€£]\s?\d[\d,]*(?:\.\d{2})?)/);
  return m ? m[1] : null;
}

function parseAiJson(rawText) {
  try {
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ─── HTML scraper ─────────────────────────────────────────

function extractProductData(html, sourceUrl) {
  const $ = load(html);

  let title =
    normalizeText($("meta[property='og:title']").attr("content")) ||
    normalizeText($("title").first().text()) ||
    normalizeText($("h1").first().text());

  const description =
    normalizeText($("meta[name='description']").attr("content")) ||
    normalizeText($("meta[property='og:description']").attr("content"));

  const image =
    $("meta[property='og:image']").attr("content") ||
    $("img").first().attr("src") ||
    null;

  let price = extractPrice(
    normalizeText($("meta[property='product:price:amount']").attr("content"))
  );

  let materialHints = [];
  let certifications = [];
  let jsonLdProduct = null;

  $("script[type='application/ld+json']").each((_, el) => {
    const scriptText = $(el).html();
    if (!scriptText) return;
    try {
      const parsed = JSON.parse(scriptText);
      const asList = Array.isArray(parsed) ? parsed : [parsed];
      asList.forEach((node) => {
        if (!node) return;
        const nodeType = Array.isArray(node["@type"])
          ? node["@type"].join(" ")
          : node["@type"];
        if (typeof nodeType === "string" && nodeType.includes("Product")) {
          jsonLdProduct = node;
        }
      });
    } catch { /* Ignore malformed JSON-LD */ }
  });

  if (jsonLdProduct) {
    if (!title && jsonLdProduct.name) title = normalizeText(jsonLdProduct.name);
    if (!price && jsonLdProduct.offers?.price) {
      price = `${jsonLdProduct.offers.priceCurrency || ""} ${jsonLdProduct.offers.price}`.trim();
    }
    if (jsonLdProduct.material) {
      materialHints.push(normalizeText(String(jsonLdProduct.material)));
    }
    if (jsonLdProduct.additionalProperty) {
      const props = Array.isArray(jsonLdProduct.additionalProperty)
        ? jsonLdProduct.additionalProperty
        : [jsonLdProduct.additionalProperty];
      props.forEach((prop) => {
        if (prop?.value) materialHints.push(normalizeText(String(prop.value)));
      });
    }
  }

  const pageText = normalizeText($("body").text()).slice(0, 7000);
  const lowerPageText = pageText.toLowerCase();

  // Extended certification & sustainability signals
  const certKeywords = [
    "fsc", "gots", "fair trade", "b corp", "organic", "recycled",
    "carbon neutral", "bluesign", "oeko-tex", "rainforest alliance",
    "energy star", "epeat", "cradle to cradle", "compostable",
    "biodegradable", "climate pledge", "1% for the planet"
  ];
  certKeywords.forEach((kw) => {
    if (lowerPageText.includes(kw)) certifications.push(kw);
  });

  // Extract weight hints for carbon estimation
  const weightMatch = pageText.match(/(\d+(?:\.\d+)?)\s*(kg|lbs?|g\b|oz)/i);
  const weight = weightMatch ? `${weightMatch[1]} ${weightMatch[2]}` : null;

  // Extract country of origin
  const originMatch = lowerPageText.match(/made in ([a-z\s]{3,20}?)[\s.,]/i);
  const originCountry = originMatch ? originMatch[1].trim() : null;

  materialHints = [...new Set(materialHints.filter(Boolean))];
  certifications = [...new Set(certifications)];

  return {
    sourceUrl,
    title,
    description,
    image,
    price,
    materialHints,
    certifications,
    pageSnippet: pageText,
    weight,
    originCountry
  };
}

// ─── Resilient fetch with fallback ───────────────────────

async function scrapeProductPage(url) {
  const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache"
  };

  let html = null;
  let fetchWarning = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(url, { headers: HEADERS, signal: controller.signal });
    clearTimeout(timeout);

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok) {
      fetchWarning = `Site returned HTTP ${response.status} — analysis uses URL + search data.`;
    } else if (!contentType.includes("text/html")) {
      fetchWarning = "URL did not return HTML — analysis uses URL + search data.";
    } else {
      html = await response.text();
    }
  } catch (err) {
    fetchWarning = `Could not reach the page (${err.message}) — analysis uses URL + search data.`;
  }

  if (html) {
    const data = extractProductData(html, url);
    if (fetchWarning) data.fetchWarning = fetchWarning;
    return data;
  }

  // Graceful fallback — derive product name from URL slug
  const urlObj = new URL(url);
  const slug = urlObj.pathname.split("/").filter(Boolean).pop() || "";
  const guessedTitle = slug
    .replace(/[-_]/g, " ")
    .replace(/\.\w+$/, "")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "Unknown Product";

  return {
    sourceUrl: url,
    title: guessedTitle,
    description: null,
    image: null,
    price: null,
    materialHints: [],
    certifications: [],
    pageSnippet: "",
    weight: null,
    originCountry: null,
    fetchWarning
  };
}

// ─── Multi-source search enrichment ──────────────────────

async function searchProductData(productTitle) {
  if (!productTitle) return { alternatives: [], sustainabilityContext: "" };

  const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  };

  // Run two searches in parallel: alternatives + brand sustainability
  const [altResponse, sustainResponse] = await Promise.allSettled([
    fetch(
      `https://duckduckgo.com/html/?q=${encodeURIComponent(`eco-friendly sustainable alternative to ${productTitle} buy`)}`,
      { headers: HEADERS }
    ),
    fetch(
      `https://duckduckgo.com/html/?q=${encodeURIComponent(`${productTitle} sustainability carbon footprint environmental impact materials`)}`,
      { headers: HEADERS }
    )
  ]);

  let alternatives = [];
  let sustainabilityContext = "";

  if (altResponse.status === "fulfilled" && altResponse.value.ok) {
    const html = await altResponse.value.text();
    const $ = load(html);
    $(".result").each((_, el) => {
      const title = normalizeText($(el).find(".result__title a").text());
      const url = $(el).find(".result__title a").attr("href");
      const snippet = normalizeText($(el).find(".result__snippet").text());
      if (!title || !url || !/^https?:\/\//i.test(url)) return;
      alternatives.push({ title, url, snippet });
    });
    alternatives = alternatives.slice(0, 6);
  }

  if (sustainResponse.status === "fulfilled" && sustainResponse.value.ok) {
    const html = await sustainResponse.value.text();
    const $ = load(html);
    const snippets = [];
    $(".result").each((_, el) => {
      const snippet = normalizeText($(el).find(".result__snippet").text());
      if (snippet) snippets.push(snippet);
    });
    sustainabilityContext = snippets.slice(0, 4).join(" | ");
  }

  return { alternatives, sustainabilityContext };
}

// ─── AI sustainability + carbon analysis ─────────────────

async function analyzeSustainability(productData, alternatives, sustainabilityContext) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      overallScore: 0,
      confidence: "Low",
      verdict: "Missing API Key",
      summary: "Set ANTHROPIC_API_KEY to enable AI analysis.",
      categoryScores: { materials: 0, manufacturing: 0, packaging: 0, ethicsAndLabor: 0, durabilityAndRepairability: 0 },
      strengths: [],
      concerns: ["AI scoring disabled — API key not configured."],
      recommendations: [],
      carbonEstimate: { kgCO2e: 0, category: "Unknown", comparison: "N/A", lifecycle: "N/A", mainDrivers: [] },
      greenerAlternatives: alternatives.map((a) => ({
        name: a.title, url: a.url, reason: a.snippet || "Potentially greener option.", estimatedScore: null
      }))
    };
  }

  const hasLimitedData = !productData.pageSnippet && !productData.description;
  const anthropic = new Anthropic({ apiKey });

  const prompt = `
You are an expert environmental impact analyst for GreenCart, an e-commerce sustainability platform.
Analyze the product below and return ONLY a valid JSON object — no markdown fences, no text outside the JSON.

## Product Data
${JSON.stringify(productData, null, 2)}

## Sustainability Context from Web Search
${sustainabilityContext || "No additional context found."}

## Eco-Friendly Alternatives from Search
${JSON.stringify(alternatives, null, 2)}

${hasLimitedData ? "⚠ Limited data: page could not be scraped. Infer from product name, type, and search context. Use Low confidence." : ""}

## Carbon Estimation Guide (use as proxy):
- Electronics (laptop, phone): 150-400 kg CO2e lifecycle
- Clothing (synthetic): 5-25 kg CO2e per item
- Clothing (organic/natural): 2-10 kg CO2e per item
- Furniture (wood): 20-80 kg CO2e
- Plastic household items: 3-15 kg CO2e
- Bamboo/cork items: 1-8 kg CO2e
- Secondhand/refurbished: reduce estimate by 60-80%
- Carbon neutral certified: set to 0 or near 0
- Manufacturing in Asia + sea shipping: add ~15%
- Manufacturing in USA/EU: baseline

## Return this exact JSON schema:
{
  "overallScore": number (0-100),
  "confidence": "High" | "Medium" | "Low",
  "verdict": "Excellent" | "Good" | "Moderate" | "Poor",
  "summary": string (2-3 sentences),
  "categoryScores": {
    "materials": number,
    "manufacturing": number,
    "packaging": number,
    "ethicsAndLabor": number,
    "durabilityAndRepairability": number
  },
  "strengths": string[] (3-5 items),
  "concerns": string[] (3-5 items),
  "recommendations": string[] (3-4 actionable items),
  "carbonEstimate": {
    "kgCO2e": number,
    "category": "Very Low" | "Low" | "Moderate" | "High" | "Very High",
    "comparison": string (e.g. "equivalent to driving 38 miles in an average car"),
    "lifecycle": string (e.g. "Most emissions occur during manufacturing (70%) and end-of-life disposal (20%)"),
    "mainDrivers": string[] (2-4 top carbon contributors for this product)
  },
  "greenerAlternatives": [
    {
      "name": string,
      "url": string,
      "reason": string,
      "estimatedScore": number
    }
  ]
}

Rules:
- ALWAYS populate ALL fields. Never use null or empty arrays.
- Clamp all scores 0-100.
- kgCO2e must be a realistic number — never 0 unless certified carbon neutral.
- comparison must use relatable everyday references (driving miles, tree-months, flight hours).
- greenerAlternatives: 3-5 items from the search results provided.
- If data is weak, hedge with "likely", "estimated", "may" — never fabricate certifications.
- Return ONLY the JSON object.
`.trim();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2200,
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }]
  });

  const rawText = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = parseAiJson(rawText);
  if (!parsed) throw new Error("AI response could not be parsed as JSON.");
  return parsed;
}

// ─── Public entry point ───────────────────────────────────

export async function runAnalysis(url) {
  const product = await scrapeProductPage(url);
  const { alternatives, sustainabilityContext } = await searchProductData(product.title);
  const analysis = await analyzeSustainability(product, alternatives, sustainabilityContext);
  return { product, analysis };
}

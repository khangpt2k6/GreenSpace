import Anthropic from "@anthropic-ai/sdk";
import { load } from "cheerio";

function normalizeText(value) {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
}

function extractPrice(text) {
  if (!text) return null;
  const priceMatch = text.match(/([$€£]\s?\d[\d,]*(?:\.\d{2})?)/);
  return priceMatch ? priceMatch[1] : null;
}

function parseAiJson(rawText) {
  try {
    const cleaned = rawText
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

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
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  });

  if (jsonLdProduct) {
    if (!title && jsonLdProduct.name) {
      title = normalizeText(jsonLdProduct.name);
    }
    if (!price && jsonLdProduct.offers?.price) {
      price = `${jsonLdProduct.offers.priceCurrency || ""} ${
        jsonLdProduct.offers.price
      }`.trim();
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

  const pageText = normalizeText($("body").text()).slice(0, 6500);
  const lowerPageText = pageText.toLowerCase();
  const certKeywords = [
    "fsc",
    "gots",
    "fair trade",
    "b corp",
    "organic",
    "recycled",
    "carbon neutral"
  ];
  certKeywords.forEach((keyword) => {
    if (lowerPageText.includes(keyword)) certifications.push(keyword);
  });

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
    pageSnippet: pageText
  };
}

async function scrapeProductPage(url) {
  const HEADERS = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
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
      fetchWarning = `Site returned HTTP ${response.status} — analysis will rely on URL and search context only.`;
    } else if (!contentType.includes("text/html")) {
      fetchWarning = "URL did not return an HTML page — analysis will rely on URL and search context only.";
    } else {
      html = await response.text();
    }
  } catch (fetchError) {
    fetchWarning = `Could not reach the page (${fetchError.message}) — analysis will rely on URL and search context only.`;
  }

  if (html) {
    const data = extractProductData(html, url);
    if (fetchWarning) data.fetchWarning = fetchWarning;
    return data;
  }

  // Graceful fallback: derive product name from the URL path
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname
    .split("/")
    .filter(Boolean)
    .pop() || "";
  const guessedTitle = pathParts
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
    fetchWarning
  };
}

async function findAlternativeProducts(productTitle) {
  if (!productTitle) return [];

  const query = encodeURIComponent(`eco-friendly alternative to ${productTitle}`);
  const searchUrl = `https://duckduckgo.com/html/?q=${query}`;
  const response = await fetch(searchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    }
  });
  if (!response.ok) return [];

  const html = await response.text();
  const $ = load(html);
  const alternatives = [];

  $(".result").each((_, el) => {
    const title = normalizeText($(el).find(".result__title a").text());
    const url = $(el).find(".result__title a").attr("href");
    const snippet = normalizeText($(el).find(".result__snippet").text());
    if (!title || !url || !/^https?:\/\//i.test(url)) return;
    alternatives.push({ title, url, snippet });
  });

  return alternatives.slice(0, 6);
}

async function analyzeSustainability(productData, alternatives) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      overallScore: 0,
      confidence: "Low",
      verdict: "Missing API Key",
      summary:
        "Set ANTHROPIC_API_KEY in your environment to enable AI sustainability analysis.",
      categoryScores: {
        materials: 0,
        manufacturing: 0,
        packaging: 0,
        ethicsAndLabor: 0,
        durabilityAndRepairability: 0
      },
      strengths: [],
      concerns: ["AI scoring disabled because API key is not configured."],
      recommendations: [],
      greenerAlternatives: alternatives.map((item) => ({
        name: item.title,
        url: item.url,
        reason: item.snippet || "Potentially better environmental profile."
      }))
    };
  }

  const anthropic = new Anthropic({ apiKey });
  const hasLimitedData = !productData.pageSnippet && !productData.description;
  const prompt = `
You are an environmental impact analyst for an e-commerce sustainability platform called GreenCart.
Analyze the product and return ONLY valid JSON — no markdown, no preamble.

Product data:
${JSON.stringify(productData, null, 2)}

Search results for greener alternatives:
${JSON.stringify(alternatives, null, 2)}

${hasLimitedData ? "NOTE: Limited data was available for this product (the page could not be scraped). Base scoring on the product name, category, and search results. Use Low confidence and note the limited data in your summary." : ""}

Return this exact JSON schema:
{
  "overallScore": number (0-100),
  "confidence": "High" | "Medium" | "Low",
  "verdict": "Excellent" | "Good" | "Moderate" | "Poor",
  "summary": string (2-3 sentences, mention data limitations if applicable),
  "categoryScores": {
    "materials": number,
    "manufacturing": number,
    "packaging": number,
    "ethicsAndLabor": number,
    "durabilityAndRepairability": number
  },
  "strengths": string[] (3-5 items, use product name and type to infer where data is missing),
  "concerns": string[] (3-5 items),
  "recommendations": string[] (3-4 actionable items),
  "greenerAlternatives": [
    { "name": string, "url": string, "reason": string, "estimatedScore": number }
  ]
}

Rules:
- ALWAYS populate all fields — never return null or empty arrays.
- Use conservative scoring when data is weak; explain in summary.
- Never fabricate certifications. Use hedged language like "may use" or "likely" when inferring.
- Clamp all scores to 0-100.
- greenerAlternatives must have 3-5 items using the search results provided.
- Return ONLY the JSON object. No markdown fences. No text before or after.
`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }]
  });

  const rawText = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  const parsed = parseAiJson(rawText);
  if (!parsed) throw new Error("AI response could not be parsed as JSON.");
  return parsed;
}

export async function runAnalysis(url) {
  const product = await scrapeProductPage(url);
  const alternatives = await findAlternativeProducts(product.title);
  const analysis = await analyzeSustainability(product, alternatives);
  return { product, analysis };
}

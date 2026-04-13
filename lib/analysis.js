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
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    }
  });

  if (!response.ok) {
    throw new Error(`Could not fetch page (${response.status}).`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    throw new Error("URL does not point to an HTML product page.");
  }

  const html = await response.text();
  return extractProductData(html, url);
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
  const prompt = `
You are an environmental impact analyst for an e-commerce sustainability platform.
Analyze the product information and return strict JSON only.

Product data:
${JSON.stringify(productData, null, 2)}

Potential alternatives from search:
${JSON.stringify(alternatives, null, 2)}

Output schema:
{
  "overallScore": number,
  "confidence": "High" | "Medium" | "Low",
  "verdict": "Excellent" | "Good" | "Moderate" | "Poor",
  "summary": string,
  "categoryScores": {
    "materials": number,
    "manufacturing": number,
    "packaging": number,
    "ethicsAndLabor": number,
    "durabilityAndRepairability": number
  },
  "strengths": string[],
  "concerns": string[],
  "recommendations": string[],
  "greenerAlternatives": [
    { "name": string, "url": string, "reason": string }
  ]
}

Rules:
- Use conservative scoring if data is weak.
- Never invent certifications or claims.
- Clearly highlight missing evidence.
- Keep recommendations practical and actionable.
- Clamp scores to 0..100.
`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1400,
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

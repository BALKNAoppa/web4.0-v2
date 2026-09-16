import { NextResponse, type NextRequest } from "next/server";
import OpenAI from "openai";

import { tvodMovies, type TvodMovie } from "@/data/tvod-movies";

const MODEL = "gpt-4o-mini";

const MAX_RESULTS = 5;

const MAX_QUERY_LENGTH = 200;

let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (openaiClient) return openaiClient;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

function buildCatalogJson(): string {
  return JSON.stringify(
    tvodMovies.map((m) => ({
      id: m.id,
      title: m.title,
      year: m.year,
      genres: m.genres,
      description: m.description,
      themes: m.themes,
      keywords: m.keywords,
    })),
  );
}

const CATALOG_JSON = buildCatalogJson();

const SYSTEM_PROMPT = `You are a multilingual movie recommendation assistant for a Mongolian streaming service.

The user query may be in Mongolian (Cyrillic), English, or mixed. Understand the intent regardless of language.

Match against the catalog considering:
- Themes (e.g. "epic space opera", "father-daughter bond")
- Keywords (e.g. "Nolan", "neon noir", "Tokyo")
- Genres, year, rating
- The description field
- "Similar to X" / "X шиг" queries should find movies with overlapping themes/feel — NOT the literal movie X
- Specific director/franchise/era queries (e.g. "Tarantino", "1970s", "Marvel") match accordingly

Catalog (JSON array of movies):
${CATALOG_JSON}

Respond with EXACTLY this JSON structure:
{
  "results": [
    { "id": "movie-id-from-catalog", "reason": "One short sentence (in same language as user query) explaining why this matches" }
  ]
}

Rules:
- Return 3 to ${MAX_RESULTS} results, ordered best→worst match
- "id" must be a movie id that exists in the catalog above
- "reason" must be in the SAME language as the user query (Mongolian → Mongolian, English → English)
- If you cannot find any reasonable matches, return { "results": [] }
- Do NOT include any text outside the JSON object`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const query = typeof body?.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json({ error: "query шаардлагатай" }, { status: 400 });
    }
    if (query.length > MAX_QUERY_LENGTH) {
      return NextResponse.json({ error: "query хэт урт" }, { status: 400 });
    }

    const openai = getOpenAI();
    if (!openai) {
      console.error("OPENAI_API_KEY is not set");
      return NextResponse.json(
        { error: "Server тохиргоо дутуу: OPENAI_API_KEY байхгүй" },
        { status: 500 },
      );
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 600,
    });

    const content = completion.choices[0]?.message?.content ?? "{}";

    let parsed: { results?: Array<{ id?: unknown; reason?: unknown }> };
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("LLM JSON parse error:", e, "content:", content);
      return NextResponse.json({ error: "Хариу буруу хэлбэртэй" }, { status: 502 });
    }

    const llmResults = Array.isArray(parsed.results) ? parsed.results : [];

    const movieMap = new Map(tvodMovies.map((m) => [m.id, m]));
    const validResults: Array<{ movie: TvodMovie; reason: string }> = [];

    for (const item of llmResults) {
      if (typeof item?.id !== "string") continue;
      const movie = movieMap.get(item.id);
      if (!movie) continue;
      const reason = typeof item.reason === "string" ? item.reason : "";
      validResults.push({ movie, reason });
      if (validResults.length >= MAX_RESULTS) break;
    }

    return NextResponse.json({ results: validResults });
  } catch (error) {
    console.error("Semantic search error:", error);
    return NextResponse.json({ error: "Хайлт амжилтгүй боллоо" }, { status: 500 });
  }
}

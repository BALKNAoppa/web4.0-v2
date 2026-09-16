import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const KEY = "web4:header-variant";

function upstash(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

const DEV_FILE = join(tmpdir(), "web4-header-variant.json");

function normalize(value: unknown): 1 | 2 {
  return value === 2 || value === "2" ? 2 : 1;
}

async function read(): Promise<1 | 2> {
  const cfg = upstash();
  if (cfg) {
    const res = await fetch(`${cfg.url}/get/${encodeURIComponent(KEY)}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Upstash GET ${res.status}`);
    const data: unknown = await res.json();
    return normalize((data as { result?: unknown })?.result);
  }
  try {
    const raw = await readFile(DEV_FILE, "utf8");
    return normalize((JSON.parse(raw) as { variant?: unknown })?.variant);
  } catch {
    return 1;
  }
}

async function write(variant: 1 | 2): Promise<void> {
  const cfg = upstash();
  if (cfg) {
    const res = await fetch(`${cfg.url}/set/${encodeURIComponent(KEY)}/${variant}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Upstash SET ${res.status}`);
    return;
  }
  await writeFile(DEV_FILE, JSON.stringify({ variant }), "utf8");
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const variant = await read();
    return Response.json(
      { variant },
      { headers: { "Cache-Control": "public, s-maxage=1, stale-while-revalidate=1" } },
    );
  } catch {
    return Response.json({ variant: null }, { status: 200 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON биш" }, { status: 400 });
  }
  const raw = (body as { variant?: unknown })?.variant;
  if (raw !== 1 && raw !== 2) {
    return Response.json({ error: "variant нь 1 эсвэл 2 байх ёстой" }, { status: 400 });
  }
  try {
    await write(raw);
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
  return Response.json({ variant: raw }, { headers: { "Cache-Control": "no-store" } });
}

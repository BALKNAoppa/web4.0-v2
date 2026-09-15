import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * ХУВААЛЦСАН ХУВИЛБАРЫН ТӨЛӨВ — `/admin` бичнэ, бүх зочин уншина.
 *
 * ЯАГААД СЕРВЕР ДЭЭР: танилцуулга дээр stakeholder өөрийн гар утсаараа QR
 * уншаад нээчихсэн байна. Төлөв нь браузерт (localStorage) байвал тэдний
 * дэлгэцийг зайнаас солих БОЛОМЖГҮЙ. Сервер дээр нэг хувь байж байж л нэг
 * дарахад бүгд солигдоно.
 *
 * ⚠️ ЯАГААД САНАХ ОЙД БИШ: Vercel дээр нэг deployment ч гэсэн олон instance
 * (lambda) дээр ажиллана — модулийн хувьсагч нь instance тус бүрдээ тусдаа
 * байх тул зарим утас хуучин утгыг авах эрсдэлтэй. Гадна талын Redis нь
 * БҮХ instance-д нэг л үнэн өгнө.
 *
 * ⚠️ ТҮЛХҮҮР БРЭНДЭЭС ХАМААРАХГҮЙ (САНААТАЙ). Vercel дээр ХОЁР project —
 * `unitel-web4` ба `univision-web4` — нэг repo-гоос, тусдаа deployment.
 * Локал дээр мөн 3000/3001 хоёр process. Аль нь ч санах ой хуваалцдаггүй тул
 * ХОЁУЛАА ИЖИЛ НЭГ Upstash DB-г заасан байх ЁСТОЙ: нэг дарахад хоёулаа
 * солигдоно гэдэг нөхцөл зөвхөн тэгж байж биелнэ.
 * ⚠️ Хоёр ТУСДАА Redis үүсгэвэл алдаа өгөхгүй — зүгээр л хоёр сайт өөр өөр
 * хувилбар үзүүлж, танилцуулга дундуур зөрнө.
 *
 * ⚠️ НУУЦ ҮГГҮЙ (2026-09-15, захиалагчийн шийдвэр: "надаас өөр хүн орохгүй,
 * орсон ч эвдэх зүйл алга"). Хэрэв дараа нь хэрэгтэй болвол: Vercel дээр
 * `ADMIN_PASSWORD` env нэмээд, доорх `POST`-ийн эхэнд header-ийн утгатай
 * тулгаж 401 буцаана — өөр газар засах шаардлагагүй.
 */

// Redis-ийн түлхүүр. Утга нь "1" эсвэл "2" гэсэн ЭНГИЙН мөр.
const KEY = "web4:header-variant";

/**
 * Upstash-ийн REST холболт.
 *
 * Нэрийг Vercel-ийн Storage интеграци өөрөө оруулдаг — Marketplace-ээс
 * холбоход `KV_REST_API_*`, шууд Upstash-аас авбал `UPSTASH_REDIS_REST_*`
 * болдог тул ХОЁУЛАНГ НЬ хүлээж авна (аль нь ирснийг тааварлах хэрэггүй).
 *
 * ⚠️ SDK ХЭРЭГЛЭЭГҮЙ САНААТАЙГААР. `@upstash/redis` нэмбэл package.json,
 * lockfile хөндөгдөнө; REST нь энгийн `fetch` тул шинэ dependency огт
 * шаардахгүй.
 */
function upstash(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

/**
 * ЛОКАЛ ЗАСВАРЫН НӨӨЦ — Redis-ийн env байхгүй үед (`npm run dev`).
 * Файлыг СИСТЕМИЙН TEMP-д тавина: 3000 ба 3001 хоёр process нэг файлыг
 * хуваалцана (дотор нь `.next` хавтас брэнд бүрт ӨӨР тул түүн дотор
 * тавьж болохгүй), git-д хэзээ ч орохгүй, .gitignore хөндөх шаардлагагүй.
 * ⚠️ Production-д энэ салаа ажиллахгүй — Vercel-ийн файлын систем read-only.
 */
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
    // Хоосон (хэзээ ч бичигдээгүй) бол `result: null` — 1 гэж үзнэ.
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

/** Хуудас бүтээх үед биш, хүсэлт ирэх бүрт ажиллана. */
export const dynamic = "force-dynamic";

/**
 * ⚠️ `s-maxage=1` НЬ ЗОРИУЛАЛТТАЙ. Танилцуулга дээр 20 утас 2 сек тутам
 * татвал минутад 600 хүсэлт — Upstash-ийн үнэгүй хязгаарыг (өдөрт 10,000
 * команд) нэг танилцуулга шавхаж мэднэ. CDN нь эдгээрийг шингээж, Redis
 * рүү секундэд ~1 л хүсэлт өгнө — утасны тооноос ҮЛ ХАМААРНА.
 * Төлбөр нь ~1 секундын саатал: солих хугацаа нийтдээ 1-3 сек.
 */
export async function GET() {
  try {
    const variant = await read();
    return Response.json(
      { variant },
      { headers: { "Cache-Control": "public, s-maxage=1, stale-while-revalidate=1" } },
    );
  } catch {
    // ⚠️ Алдаанд 500 БУЦААХГҮЙ. Клиент 1 рүү унахаас сүүлийн утга дээрээ
    // үлдэх нь дээр — тиймээс "мэдэхгүй" гэдгийг ойлгуулж, клиент алгасна.
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

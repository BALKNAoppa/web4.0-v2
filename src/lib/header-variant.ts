"use client";

import { useSyncExternalStore } from "react";

/**
 * Header-ийн хувилбарын store.
 *   1 = ШИЛЭН КАПСУЛ (хуучин загвар, ЖИШИГ) · 2 = ХАВТГАЙ 2 давхарга + dock
 *
 * ⚠️ ЗӨВХӨН МОБАЙЛЫГ ЛЭ ЯЛГАНА. Desktop дээр хоёр хувилбар нь ЯГ ИЖИЛ
 * (`header.tsx > LogoLeftHeader`) — 2026-09-14-нд захиалагч desktop-ийн
 * батлагдсан хувилбарыг сонгож, бусдыг нь хассан.
 *
 * ⚠️⚠️ ДУГААРЛАЛТ 2026-09-14-НД ХОЁР УДАА ӨӨРЧЛӨГДСӨН:
 *   ① Хуучин мобайл хувилбар 1 (header дээрх ангиллын мөр + таб dropdown)
 *      БҮРМӨСӨН ХАСАГДАЖ, үлдсэн хоёр нь урагшаа шилжив:
 *          хуучин 2 (доод dock) → 1 · хуучин 3 (burger drawer) → 2
 *   ② Тэр өдрийн орой захиалагч ХОЁУЛАНГ НЬ СОЛИВ ("хувилбар 1-ийн хувилбар
 *      2 болгоод хувилбар 2-г хувилбар 1 болго"):
 *          ①-ийн 1 (хавтгай · Layer 2 · dock) → ЭЦСИЙН 2
 *          ①-ийн 2 (шилэн капсул)             → ЭЦСИЙН 1
 * ⇒ ЭЦСИЙН 1 нь ХУУЧИН загвар (хөндөхгүй жишиг), ЭЦСИЙН 2 нь ШИНЭ загвар
 *   (09-14-ны бүх засвар түүн дээр).
 *
 * ⚠️⚠️ 2026-09-15: ТӨЛӨВ НЬ БРАУЗЕРААС СЕРВЕР РҮҮ НҮҮСЭН.
 * Өмнө нь `localStorage` байсан — тэр нь утас тус бүрдээ тусдаа байсан тул
 * танилцуулга дээр stakeholder-ийн гар утсыг ЗАЙНААС солих боломжгүй байв.
 * Одоо утга нь `/api/header-variant`-д (Upstash Redis) нэг л хувь байна:
 *   · `/admin` дээрээс солино  → ХОЁУЛАН БРЭНДИЙН бүх зочинд хүрнэ
 *   · Хуудсууд 2 секунд тутам татна → refresh хийлгэхгүйгээр өөрөө солигдоно
 *
 * `localStorage` нь ЗӨВХӨН ЗУРАГЛАЛЫН КЭШ болж үлдэв: сервер хариулахаас
 * өмнөх эхний зураглалыг сүүлд мэдэгдэж байсан хувилбараар гаргана
 * (эс бөгөөс 2-ыг үзүүлж байтал хуудас дахин ачаалахад 1 анивчина).
 * ⚠️ Кэш нь ЭРХ МЭДЭЛГҮЙ — серверийн хариу ирмэгц дардаг.
 */
export type HeaderVariant = 1 | 2;

/** Хуваалцсан төлвийн эцсийн эх сурвалж. `/admin` энэ рүү бичнэ. */
export const HEADER_VARIANT_API = "/api/header-variant";

/**
 * Зураглалын кэшийн түлхүүр.
 * ⚠️ ХУВИЛБАРЫН УТГА СОЛИГДОХ БҮРТ ШИНЭ НЭРТЭЙ БАЙНА. Хуучин түлхүүрийг
 * үлдээвэл өмнө нь үзсэн хүний браузерт сууж байгаа "2" нь ӨӨР хувилбарыг
 * заана — тэр хүн нэгийг хүлээж байтал нөгөө нь нээгдэнэ.
 */
const CACHE_KEY = "uv-header-variant-cache-2026-09-15";

/** Татах давтамж. 2 сек — танилцуулгад мэдэгдэхгүй, сервер рүү ачаалал багатай. */
const POLL_MS = 2000;

let current: HeaderVariant = 1;
let poll: ReturnType<typeof setInterval> | null = null;
let muteUntil = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function apply(next: HeaderVariant) {
  try {
    window.localStorage.setItem(CACHE_KEY, String(next));
  } catch {
    // localStorage хориотой орчин (private mode) — кэшгүйгээр ажиллана
  }
  if (next === current) return;
  current = next;
  emit();
}

/** Серверээс татах. ⚠️ Алдаа гарвал СҮҮЛИЙН утга дээрээ үлдэнэ (1 рүү УНАХГҮЙ). */
async function pull() {
  try {
    const res = await fetch(HEADER_VARIANT_API, { cache: "no-store" });
    if (!res.ok) return;
    const data: unknown = await res.json();
    const value = (data as { variant?: unknown })?.variant;
    // ⚠️ Сервер 'мэдэхгүй' (null) гэж хариулбал ХӨДӨЛГӨХГҮЙ — Redis мөчхөн
    // алдаа өгсөн байж болно. Сүүлд мэдэгдэж байсан утга үнэн хэвээр.
    if (value !== 1 && value !== 2) return;
    // Саяхан энэ браузераас бичсэн бол CDN-ээс ХУУЧИН утга ирж мэднэ
    // (s-maxage=1). Богино хугацаанд татсаныг үл тоомсорлоно — эс бөгөөс
    // admin дээр дарсан товч секундын дараа буцаж 'үсэрч' харагдана.
    if (Date.now() < muteUntil) return;
    apply(value);
  } catch {
    // сүлжээ тасарсан — дараагийн poll дээр дахин оролдоно
  }
}

function onVisible() {
  // Утас халааснаас гарахад ШУУД шинэчилнэ — эс бөгөөс унтсан хугацаанд
  // солигдсоныг алдаж, хуучин хувилбараа харуулсаар байна.
  if (document.visibilityState === "visible") void pull();
}

function start() {
  try {
    if (window.localStorage.getItem(CACHE_KEY) === "2") {
      current = 2;
      emit();
    }
  } catch {
    // кэш уншигдахгүй бол 1-ээс эхэлнэ
  }
  void pull();
  poll = setInterval(() => {
    if (document.visibilityState === "visible") void pull();
  }, POLL_MS);
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("focus", onVisible);
}

function stop() {
  if (poll) clearInterval(poll);
  poll = null;
  document.removeEventListener("visibilitychange", onVisible);
  window.removeEventListener("focus", onVisible);
}

function subscribe(cb: () => void) {
  // Сонсогч эхнийх нь орж ирэхэд л татаж эхэлнэ, сүүлчийнх нь гармагц зогсоно.
  if (listeners.size === 0) start();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) stop();
  };
}

function getSnapshot(): HeaderVariant {
  return current;
}

/** SSR-д үргэлж 1 — client дээр кэш/серверээс шинэчилнэ. */
function getServerSnapshot(): HeaderVariant {
  return 1;
}

export function useHeaderVariant(): HeaderVariant {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Хувилбар солих — ЗӨВХӨН `/admin` ашиглана.
 * Серверт бичээд, өөрийн дэлгэцийг шууд шинэчилнэ (poll хүлээхгүй).
 */
export async function setHeaderVariant(v: HeaderVariant): Promise<void> {
  const res = await fetch(HEADER_VARIANT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variant: v }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Хадгалж чадсангүй (${res.status})`);
  muteUntil = Date.now() + 2500;
  apply(v);
}

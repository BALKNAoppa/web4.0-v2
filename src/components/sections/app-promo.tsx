import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

import type { AppPromoContent } from "@/data/app-promo";
import { sectionType } from "@/lib/section-type";
import { sectionBg } from "@/lib/section-bg";
import { cn } from "@/lib/utils";

/**
 * APP PROMO — "апп-аа тат" section. Unitel болон Univision ХОЁУЛАА үүнийг
 * ашиглана, зөвхөн `content` нь өөр (`@/data/app-promo`).
 *
 * Бүтэц: зүүн талд гарчиг · тайлбар · store badge (lg+ дээр QR),
 * баруун талд текстгүй утасны mockup зураг.
 *
 * ЧУХАЛ: зурган дотор ТЕКСТ байж БОЛОХГҮЙ. Бүх текст HTML-ээр гарна —
 * screen reader уншина, орчуулагдана, дэлгэцийн өргөнөөр зөв тохирно.
 *
 * Брэндийн ногоон нь `--app-accent` custom property-гээр section дээрээс
 * доошоо дамжина — Tailwind анги нэрийг ажил үед үүсгэж чаддаггүй тул
 * динамик өнгийг ингэж өгнө.
 *
 * ⚠️ БАРААН ДЭВСГЭР ХАСАГДСАН (2026-09-07, захиалагчийн явуулсан загвар).
 * Өмнө нь section нь `content.background` (`#0a1a14`) гэсэн ХАТУУ hex-ээр
 * буудаг, дээр нь цагаан цэгэн бүтэц (Singtel-маягийн texture) орж, бүх
 * бичвэр цагаан байв. Одоо хуудасны theme token-ийг хэрэглэнэ:
 *   `bg-background` · `text-foreground` · `text-muted-foreground`
 * Ингэснээр light/dark хоёуланд зөв буух ба хөрш section-уудтай
 * (`Promotions`, `OtherServices`) нэг гадаргатай болно.
 * → ЦЭГЭН БҮТЭЦ ХАМТ ХАСАГДСАН: түүний цэгүүд `rgba(255,255,255,.6)` тул
 *   цайвар дэвсгэр дээр ЮУ Ч ХАРАГДАХГҮЙ, зөвхөн DOM-д үлдэх байсан.
 */
export function AppPromo({ content }: { content: AppPromoContent }) {
  const titleId = `${content.id}-title`;

  const sectionStyle = {
    "--app-accent": content.accent,
  } as React.CSSProperties;

  return (
    <section
      id={content.id}
      aria-labelledby={titleId}
      /**
       * ⚠️⚠️ `sectionBg.band` → `sectionBg.page` (2026-09-10, захиалагчийн
       * загварын screenshot: "footer хэсгийн bg өөрчлөгдсөн байна … загварын
       * дагуу байх ёстой").
       *
       * ЯАГААД ЭНЭ НЬ ЗҮГЭЭР НЭГ ӨНГӨ СОЛИХ БИШ: `band` (=`bg-card`,
       * #f3f5f7) нь доорх утасны зургийн картын дэвсгэртэй ЯГ ИЖИЛ токен
       * байсан ⇒ карт нь section дээр огт ялгарахгүй, зөвхөн ring/shadow-оороо
       * л мэдэгддэг байв. `page` (=`bg-background`, #e2e8ec) болгосноор карт
       * нэг шат ЦАЙВАР болж, загварынх шиг тодорхой хайрцаг болно.
       *
       * ⚠️ ЭНЭ НЬ 2026-09-09-НЫ ХЭМНЭЛЭЭС ЗӨРЛӨӨ. `lib/section-bg.ts`-ийн
       * диаграмд "Апп татах = band" гэж бичигдсэн байсныг захиалагч
       * 2026-09-10-нд ЗӨВШӨӨРӨН өөрчилсөн. Үр дагавар: "Бусад үйлчилгээ" →
       * "Апп татах" → footer ГУРВУУЛАА саарал болж, хооронд нь зааг
       * үлдэхгүй — энэ нь ЗОРИУД (загварт тэгж харагдана).
       */
      className={cn(sectionBg.page, "relative w-full overflow-hidden")}
      style={sectionStyle}
    >
      {/* Бусад section-уудтай ижил 1200px контентын хүрээнд тэгшилнэ */}
      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
        {/* ============ LEFT — text + store badges ============
            ⚠️ EYEBROW ("● UNITEL АПП") ХАСАГДСАН. Хоёр шалтгаан:
              1. Захиалагчийн явуулсан загварт БАЙХГҮЙ — утасны зургийн
                 дараа шууд гарчиг ирдэг.
              2. Тэр нь `text-xs font-bold` ногоон бичвэр байсан. Бараан
                 дэвсгэр дээр контраст сайн байв; ЦАЙВАР дэвсгэр дээр
                 #45c700 нь ердөө ~1.8:1 болж, 12px бичвэрт шаардагдах
                 WCAG 1.4.3-ын 4.5:1-ээс ХОЛ дутна.
            `content.eyebrow` дата талбар нь ҮЛДСЭН (доорх тайлбарыг үз) —
            буцаах бол зөвхөн энэ блокийг сэргээнэ. */}
        <div className="order-2 lg:order-1">
          <h2 id={titleId} className={sectionType.titleHero}>
            {content.titlePre}
            <span style={{ color: content.accent }}>{content.titleAccent}</span>
            {content.titlePost}
          </h2>

          <p className="text-muted-foreground mt-5 max-w-lg text-base leading-relaxed md:text-lg">
            {content.description}
          </p>

          {/* Mobile / tablet: store badges */}
          <div className="mt-7 flex flex-wrap items-center gap-3 lg:hidden">
            <AppStoreBadge href={content.appStoreHref} />
            <GooglePlayBadge href={content.googlePlayHref} />
          </div>

          {/* Desktop (lg+): QR code.
              ⚠️ QR-ийн хайрцаг нь ЗОРИУД `bg-white` — сканнердах найдвартай
              байдал өнгөний контрастаас хамаардаг тул theme-ээр хөвөрдөг
              token хэрэглэхгүй. `fgColor` нь өмнө `content.background`
              (#0a1a14) байсан; тэр талбар хасагдсан тул хатуу бараан. */}
          <div className="mt-7 hidden items-center gap-5 lg:flex">
            <div className="border-border rounded-2xl border bg-white p-3 shadow-lg">
              <QRCodeSVG
                value={content.qrUrl}
                size={120}
                bgColor="#ffffff"
                fgColor="#0a0a0a"
                level="M"
                marginSize={0}
              />
            </div>
            <div className="text-muted-foreground max-w-45 text-sm leading-relaxed">
              {content.qrCaption}
            </div>
          </div>
        </div>

        {/* ============ RIGHT — phone card (float animation) ============
            ⚠️ ХАЙРЦГИЙН ӨНГӨ. Өмнө нь `shadow-black/60` + `ring-white/5` —
            бараан дэвсгэр дээр ажилладаг байв. Цайвар дэвсгэр дээр 60%
            хар сүүдэр нь бохир толбо, цагаан ring нь үл харагдах болно.
            Одоо `bg-card` + `ring-border` + зөөлөн сүүдэр — загварын дагуу
            зураг нь цайвар хавтан дээр суудаг. */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="animate-float-card bg-card ring-border relative aspect-[3/2] w-full max-w-lg overflow-hidden rounded-3xl shadow-lg ring-1 sm:max-w-xl lg:max-w-2xl xl:max-w-3xl">
            <Image
              src={content.bannerImage}
              alt=""
              fill
              sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 50vw, (min-width: 640px) 80vw, 95vw"
              className="object-cover"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// STORE BADGES — Apple App Store / Google Play
//
// ⚠️ ӨНГӨ нь `bg-foreground text-background`, ХАТУУ `bg-black` БИШ.
// Загварт badge нь цайвар дэвсгэр дээрх БАРААН таблет — token хэрэглэснээр
// light theme-д яг тийм болж, dark theme-д ЭСРЭГЭЭР (цайвар таблет)
// хөрвөнө. `bg-black` үлдээвэл dark theme-д хар таблет хар дэвсгэр дээр
// уусах байсан. Apple-ийн badge-ийн заавар хар ба цагаан хоёуланг
// зөвшөөрдөг тул брэндийн шаардлага зөрчигдөхгүй.
//
// ⚠️ ХАСАГДСАН: `border-white/15` (цайвар дэвсгэр дээр үл харагдана) ба
// `hover:bg-white/10` (badge-ийг бараг тунгалаг болгож, доорхыг гаргана).
// Hover нь одоо `opacity-90` — хоёр theme-д ч ижил ажиллана.
//
// Focus ring нь section-ээс ирсэн `--app-accent`-ыг уншина; офсет нь
// `ring-offset-background` буюу token (`--app-bg` хасагдсан).
// =====================================================================

const BADGE_CLASS =
  "bg-foreground text-background focus-visible:ring-offset-background inline-flex h-14 items-center gap-3 rounded-2xl px-5 transition-opacity duration-300 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] focus-visible:ring-offset-2 focus-visible:outline-none";

function AppStoreBadge({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="App Store-оос татах" className={BADGE_CLASS}>
      <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden="true">
        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] tracking-wide uppercase opacity-90">
          Download on the
        </span>
        <span className="-mt-0.5 block text-lg font-semibold">App Store</span>
      </span>
    </Link>
  );
}

function GooglePlayBadge({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="Google Play-оос татах" className={BADGE_CLASS}>
      <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden="true">
        <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198 2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.119 12l2.579-2.491zM5.864 2.658 16.802 8.99l-2.303 2.303-8.635-8.635z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] tracking-wide uppercase opacity-90">GET IT ON</span>
        <span className="-mt-0.5 block text-lg font-semibold">Google Play</span>
      </span>
    </Link>
  );
}

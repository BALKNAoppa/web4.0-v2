import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

import type { AppPromoContent } from "@/data/app-promo";

/**
 * APP PROMO — "апп-аа тат" section. Unitel болон Univision ХОЁУЛАА үүнийг
 * ашиглана, зөвхөн `content` нь өөр (`@/data/app-promo`).
 *
 * Бүтэц: зүүн талд eyebrow · гарчиг · тайлбар · store badge (lg+ дээр QR),
 * баруун талд текстгүй утасны mockup зураг.
 *
 * ЧУХАЛ: зурган дотор ТЕКСТ байж БОЛОХГҮЙ. Бүх текст HTML-ээр гарна —
 * screen reader уншина, орчуулагдана, дэлгэцийн өргөнөөр зөв тохирно.
 *
 * Брэндийн өнгө нь `--app-accent` / `--app-bg` custom property-гээр section
 * дээрээс доошоо дамжина — Tailwind анги нэрийг ажил үед үүсгэж чаддаггүй
 * тул динамик өнгийг ингэж өгнө.
 */
export function AppPromo({ content }: { content: AppPromoContent }) {
  const titleId = `${content.id}-title`;

  const sectionStyle = {
    backgroundColor: content.background,
    "--app-accent": content.accent,
    "--app-bg": content.background,
  } as React.CSSProperties;

  return (
    <section
      id={content.id}
      aria-labelledby={titleId}
      className="relative w-full overflow-hidden"
      style={sectionStyle}
    >
      {/* Subtle dot pattern (Singtel-style texture) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Бусад section-уудтай ижил 1200px контентын хүрээнд тэгшилнэ */}
      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
        {/* ============ LEFT — text + store badges ============ */}
        <div className="order-2 lg:order-1">
          <div
            className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase"
            style={{ color: content.accent }}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: content.accent }}
              aria-hidden="true"
            />
            {content.eyebrow}
          </div>

          <h2
            id={titleId}
            className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            {content.titlePre}
            <span style={{ color: content.accent }}>{content.titleAccent}</span>
            {content.titlePost}
          </h2>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
            {content.description}
          </p>

          {/* Mobile / tablet: store badges */}
          <div className="mt-7 flex flex-wrap items-center gap-3 lg:hidden">
            <AppStoreBadge href={content.appStoreHref} />
            <GooglePlayBadge href={content.googlePlayHref} />
          </div>

          {/* Desktop (lg+): QR code */}
          <div className="mt-7 hidden items-center gap-5 lg:flex">
            <div className="rounded-2xl bg-white p-3 shadow-lg">
              <QRCodeSVG
                value={content.qrUrl}
                size={120}
                bgColor="#ffffff"
                fgColor={content.background}
                level="M"
                marginSize={0}
              />
            </div>
            <div className="max-w-45 text-sm leading-relaxed text-white/80">
              {content.qrCaption}
            </div>
          </div>
        </div>

        {/* ============ RIGHT — phone card (float animation) ============ */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="animate-float-card relative aspect-[3/2] w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl ring-1 shadow-black/60 ring-white/5 sm:max-w-xl lg:max-w-2xl xl:max-w-3xl">
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
// Focus ring нь section-ээс ирсэн `--app-accent` / `--app-bg`-ыг уншина.
// =====================================================================

const BADGE_CLASS =
  "inline-flex h-14 items-center gap-3 rounded-xl border border-white/15 bg-black px-5 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)] focus-visible:outline-none";

function AppStoreBadge({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="App Store-оос татах" className={BADGE_CLASS}>
      <svg viewBox="0 0 24 24" className="size-7 fill-white" aria-hidden="true">
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
      <svg viewBox="0 0 24 24" className="size-7 fill-white" aria-hidden="true">
        <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198 2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.119 12l2.579-2.491zM5.864 2.658 16.802 8.99l-2.303 2.303-8.635-8.635z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] tracking-wide uppercase opacity-90">GET IT ON</span>
        <span className="-mt-0.5 block text-lg font-semibold">Google Play</span>
      </span>
    </Link>
  );
}

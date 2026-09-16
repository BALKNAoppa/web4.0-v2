import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

import type { AppPromoContent } from "@/data/app-promo";
import { sectionType } from "@/lib/section-type";
import { sectionBg } from "@/lib/section-bg";
import { cn } from "@/lib/utils";

export function AppPromo({ content }: { content: AppPromoContent }) {
  const titleId = `${content.id}-title`;

  const sectionStyle = {
    "--app-accent": content.accent,
  } as React.CSSProperties;

  return (
    <section
      id={content.id}
      aria-labelledby={titleId}
      className={cn(sectionBg.page, "relative w-full overflow-hidden")}
      style={sectionStyle}
    >
      {}
      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
        {
}
        <div className="order-2 lg:order-1">
          <h2 id={titleId} className={sectionType.titleHero}>
            {content.titlePre}
            <span style={{ color: content.accent }}>{content.titleAccent}</span>
            {content.titlePost}
          </h2>

          <p className="text-muted-foreground mt-5 max-w-lg text-base leading-relaxed md:text-lg">
            {content.description}
          </p>

          {}
          <div className="mt-7 flex flex-wrap items-center gap-3 lg:hidden">
            <AppStoreBadge href={content.appStoreHref} />
            <GooglePlayBadge href={content.googlePlayHref} />
          </div>

          {
}
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

        {
}
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

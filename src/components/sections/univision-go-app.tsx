import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

import { univisionGoApp } from "@/data/univision-go-app";

export function UnivisionGoApp() {
  return (
    <section
      aria-labelledby="univision-go-title"
      className="relative w-full overflow-hidden bg-[#0a1a14]"
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

      <div className="relative mx-auto grid w-full max-w-screen-2xl items-center gap-10 px-6 py-7 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-12">
        {/* ============ LEFT — text + store badges ============ */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#0FAA0A] uppercase">
            <span className="size-2 rounded-full bg-[#0FAA0A]" aria-hidden="true" />
            {univisionGoApp.eyebrow}
          </div>

          <h2
            id="univision-go-title"
            className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            {univisionGoApp.titlePre}
            <span className="text-[#0FAA0A]">{univisionGoApp.titleAccent}</span>
            {univisionGoApp.titlePost}
          </h2>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
            {univisionGoApp.description}
          </p>

          {/* Mobile / tablet: store badges */}
          <div className="mt-7 flex flex-wrap items-center gap-3 lg:hidden">
            <AppStoreBadge href={univisionGoApp.appStoreHref} />
            <GooglePlayBadge href={univisionGoApp.googlePlayHref} />
          </div>

          {/* Desktop (lg+): QR code */}
          <div className="mt-7 hidden items-center gap-5 lg:flex">
            <div className="rounded-2xl bg-white p-3 shadow-lg">
              <QRCodeSVG
                value={univisionGoApp.qrUrl}
                size={120}
                bgColor="#ffffff"
                fgColor="#0a1a14"
                level="M"
                marginSize={0}
              />
            </div>
            <div className="max-w-45 text-sm leading-relaxed text-white/80">
              {univisionGoApp.qrCaption}
            </div>
          </div>
        </div>

        {/* ============ RIGHT — phone card (float animation) ============ */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="animate-float-card relative aspect-[3/2] w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl ring-1 shadow-black/60 ring-white/5 sm:max-w-xl lg:max-w-2xl xl:max-w-3xl">
            <Image
              src={univisionGoApp.bannerImage}
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
// =====================================================================

function AppStoreBadge({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="App Store-оос татах"
      className="inline-flex h-14 items-center gap-3 rounded-xl border border-white/15 bg-black px-5 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#0FAA0A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1a14] focus-visible:outline-none"
    >
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
    <Link
      href={href}
      aria-label="Google Play-оос татах"
      className="inline-flex h-14 items-center gap-3 rounded-xl border border-white/15 bg-black px-5 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#0FAA0A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1a14] focus-visible:outline-none"
    >
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

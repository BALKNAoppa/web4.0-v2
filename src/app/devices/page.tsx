"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Breadcrumb, type BreadcrumbItem } from "@/components/layout/breadcrumb";
import { ServiceSample } from "@/components/sections/service-sample";
import { findService } from "@/data/service-index";
import {
  deviceCategories,
  deviceCategoryLabel,
  deviceProducts,
  devicesHero,
  type DeviceProduct,
} from "@/data/devices";
import { cn } from "@/lib/utils";

/**
 * ДЭЛГҮҮР — нэг зам дээр ХОЁР горим (/main-packages, /service-тэй ижил зарчим).
 * Аль параметр байгаагаар салаална:
 *
 *   /devices                  → каталогийн landing, бүх бараа
 *   /devices?category=phones  → landing, тухайн ангиллаар шүүсэн
 *   /devices?type=phone       → тухайн төхөөрөмжийн SAMPLE дэлгэрэнгүй
 *
 * ⚠️ `type` ба `category` нь ЗОРИУД өөр нэртэй, өөр үүрэгтэй:
 *   `type`     — `groupNavV2`-оос `findService`-ээр олдох ҮЙЛЧИЛГЭЭ (өмнөх
 *                хувилбарын дэлгэрэнгүй хуудас). Хөндөөгүй, хэвээр.
 *   `category` — ЭНЭ landing-ийн шүүлтүүр (`deviceCategories`).
 * Хоёуланг нэг параметрээр шийдвэл дэлгэрэнгүй нь шүүлтүүрийг дардаг (эсвэл
 * эсрэгээр) тул салгав.
 */
export default function DevicesPage() {
  return (
    <Suspense fallback={null}>
      <DevicesRouter />
    </Suspense>
  );
}

function DevicesRouter() {
  const params = useSearchParams();
  const type = params.get("type");
  const service = type ? findService(`/devices?type=${type}`) : null;

  if (service) return <ServiceSample service={service} />;
  return <DevicesLanding categoryParam={params.get("category")} />;
}

// =====================================================================
// LANDING — hero · ангиллын шүүлтүүр · барааны grid
// =====================================================================
function DevicesLanding({ categoryParam }: { categoryParam: string | null }) {
  /**
   * `?category=` нь таслалаар тусгаарласан ОЛОН утга авч чадна.
   *
   * Шалтгаан: mobile-ын цэс ангиллуудыг НЭГТГЭДЭГ ("Гар утас & Дагалдах
   * хэрэгсэл" гэсэн НЭГ мөр — `archivedMegaMenus.Дэлгүүр.mobile`). Тэр мөр хоёр
   * ангиллыг зэрэг нээх ёстой тул `?category=phones,accessories` гэж явна.
   * Desktop-ын мөрүүд ганц утгатай — ижил кодоор хоёулаа ажиллана.
   *
   * Танихгүй id-г ЧИМЭЭГҮЙ хаяна: буруу линкээс болж хуудас хоосон гарахаас
   * бүх барааг харуулсан нь дээр.
   */
  const requested = categoryParam?.split(",").filter(Boolean) ?? [];
  const active = requested.filter((id) => id in deviceCategoryLabel);

  const visible = active.length
    ? deviceProducts.filter((p) => active.includes(p.category))
    : deviceProducts;

  // Breadcrumb нь ЗӨВХӨН нэг ангилал сонгосон үед гүнзгийрнэ — нэгтгэсэн
  // (олон) сонголтод "Дэлгүүр" гэсэн нэг шат хэвээр.
  const breadcrumbItems: BreadcrumbItem[] =
    active.length === 1
      ? [{ label: "Дэлгүүр", href: "/devices" }, { label: deviceCategoryLabel[active[0]] }]
      : [{ label: "Дэлгүүр" }];

  return (
    <main id="main-content" className="bg-background min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      {/* ============ HERO — /campaigns-тай ижил хэмнэл ============ */}
      <section className="container mx-auto px-4 pt-12 pb-8 text-center md:pt-20 md:pb-12">
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          {devicesHero.title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base leading-relaxed md:text-lg">
          {devicesHero.description}
        </p>
      </section>

      {/* ============ АНГИЛЛЫН ШҮҮЛТҮҮР ============
          Товч БИШ, ЛИНК. Ингэснээр цэснээс шууд гүн холбоос болно, буцах товч
          ажиллана, шүүсэн хуудсаа хуваалцаж болно. `scroll={false}` — pill
          дархад хуудас дээшээ үсрэхгүй. */}
      <nav aria-label="Төхөөрөмжийн ангилал" className="container mx-auto px-4 pb-12 md:pb-16">
        <ul className="flex flex-wrap items-center justify-center gap-3">
          {deviceCategories.map((cat) => {
            const isActive = cat.id === "all" ? active.length === 0 : active.includes(cat.id);
            return (
              <li key={cat.id}>
                <Link
                  href={cat.id === "all" ? "/devices" : `/devices?category=${cat.id}`}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "focus-visible:ring-ring inline-flex h-12 min-w-30 items-center justify-center rounded-2xl border px-5 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:text-base",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:shadow-sm",
                  )}
                >
                  {cat.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ============ БАРААНЫ GRID ============ */}
      <section
        aria-labelledby="devices-grid-title"
        className="container mx-auto px-4 pb-16 md:pb-24"
      >
        <h2
          id="devices-grid-title"
          className="text-foreground mb-8 text-center text-3xl font-bold tracking-tight md:mb-12 md:text-4xl"
        >
          {/* Нэгтгэсэн (олон) сонголтод ангиллын нэрсийг залгана — эс бөгөөс
              зөвхөн 2 ангилал харагдаж байхад "Бүх төхөөрөмж" гэж худал
              гарчиглана. Сонголтгүй үед л жинхэнэ "бүх". */}
          {active.length
            ? active.map((id) => deviceCategoryLabel[id]).join(" · ")
            : "Бүх төхөөрөмж"}
        </h2>

        {visible.length === 0 ? (
          <p className="text-muted-foreground py-16 text-center">
            Энэ ангилалд төхөөрөмж одоогоор алга байна.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <DeviceCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

// =====================================================================
// БАРААНЫ КАРТ
// =====================================================================
function DeviceCard({ product }: { product: DeviceProduct }) {
  return (
    <article className="bg-card border-border flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-lg">
      {/* Зургийн слот — жинхэнэ зураг гарахаар солино.
          ⚠️ `bg-gray-100` гэх мэт тогтмол өнгө ХЭРЭГЛЭХГҮЙ (campaigns-д ийм
          үлдэгдэл байгаа): `bg-muted` нь dark theme-д хамт эргэдэг. */}
      {/* ⚠️ `aria-hidden` нь ЗӨВХӨН placeholder текст дээр — БҮХ блок дээр
          тавибал дотор нь байгаа badge ("Онцлох" / "Шинэ") ч хамт нуугдана. Тэр нь
          зургийн чимэг БИШ, утга агуулсан мэдээлэл. */}
      <div className="bg-muted relative flex aspect-[4/3] items-center justify-center">
        <span
          aria-hidden="true"
          className="text-muted-foreground/50 text-2xl font-semibold md:text-3xl"
        >
          {product.placeholderText}
        </span>
        {product.badge && (
          <span className="bg-primary text-primary-foreground absolute top-4 right-4 inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wide shadow-md">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Ангиллын шошго.
            ⚠️ `navType` (nav-type.ts) ХЭРЭГЛЭХГҮЙ — тэр нь HEADER-ийн цэсний
            үсгийн стандарт (bar · mega menu · mobile sheet), барааны карт нь
            цэс БИШ. Тэндээс татвал тэр файлын хамрах хүрээ чимээгүй тэлнэ. */}
        <p className="text-muted-foreground text-[13px] font-normal">
          {deviceCategoryLabel[product.category]}
        </p>
        <h3 className="text-foreground mt-1.5 text-xl font-bold tracking-tight md:text-2xl">
          {product.name}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">{product.spec}</p>

        {/* ҮНИЙН СЛОТ — `ServiceSample`-ийн `00,000₮`-тэй ижил хэв маяг. Бодит
            үнэ шийдэгдээгүй тул тоо ЗОХИОХГҮЙ, зөвхөн байрыг нь эзэлнэ. */}
        <div className="border-border mt-5 border-t pt-4">
          <p className="text-foreground text-2xl font-bold tracking-tight">
            000,000₮{" "}
            {/* `ml-2` нь ЗӨВХӨН харагдах зай — текстийн зангилаанууд шууд
                залгаа байвал screen reader "000,000₮эсвэл" гэж нийлүүлж
                уншина. Тиймээс жинхэнэ хоосон зай хэрэгтэй. */}
            <span className="text-muted-foreground ml-2 text-sm font-normal">
              эсвэл 00,000₮ / сар
            </span>
          </p>
        </div>

        <div className="mt-auto pt-5">
          <Link
            href={product.detailHref}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Дэлгэрэнгүй
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

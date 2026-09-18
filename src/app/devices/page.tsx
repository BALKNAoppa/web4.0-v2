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

function DevicesLanding({ categoryParam }: { categoryParam: string | null }) {
  const requested = categoryParam?.split(",").filter(Boolean) ?? [];
  const active = requested.filter((id) => id in deviceCategoryLabel);

  const visible = active.length
    ? deviceProducts.filter((p) => active.includes(p.category))
    : deviceProducts;

  const breadcrumbItems: BreadcrumbItem[] =
    active.length === 1
      ? [{ label: "Дэлгүүр", href: "/devices" }, { label: deviceCategoryLabel[active[0]] }]
      : [{ label: "Дэлгүүр" }];

  return (
    <main id="main-content" className="bg-background min-h-dvh">
      <Breadcrumb items={breadcrumbItems} />

      <section className="container mx-auto px-4 pt-12 pb-8 text-center md:pt-20 md:pb-12">
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          {devicesHero.title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base leading-relaxed md:text-lg">
          {devicesHero.description}
        </p>
      </section>

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

      <section
        aria-labelledby="devices-grid-title"
        className="container mx-auto px-4 pb-16 md:pb-24"
      >
        <h2
          id="devices-grid-title"
          className="text-foreground mb-8 text-center text-3xl font-bold tracking-tight md:mb-12 md:text-4xl"
        >
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

function DeviceCard({ product }: { product: DeviceProduct }) {
  return (
    <article className="bg-card border-border flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-lg">
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
        <p className="text-muted-foreground text-[13px] font-normal">
          {deviceCategoryLabel[product.category]}
        </p>
        <h3 className="text-foreground mt-1.5 text-xl font-bold tracking-tight md:text-2xl">
          {product.name}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">{product.spec}</p>

        <div className="border-border mt-5 border-t pt-4">
          <p className="text-foreground text-2xl font-bold tracking-tight">
            000,000₮{" "}
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

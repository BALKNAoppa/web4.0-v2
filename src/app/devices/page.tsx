"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ServiceSample } from "@/components/sections/service-sample";
import { findService } from "@/data/service-index";

/**
 * Хоёр горим нэг зам дээр (/main-packages, /service-тэй ижил зарчим):
 *   /devices              → төхөөрөмжийн ерөнхий хэсэг
 *   /devices?type=phone   → тухайн төхөөрөмжийн sample дэлгэрэнгүй
 */
export default function DevicesPage() {
  return (
    <Suspense fallback={null}>
      <DevicesRouter />
    </Suspense>
  );
}

function DevicesRouter() {
  const type = useSearchParams().get("type");
  const service = type ? findService(`/devices?type=${type}`) : null;
  return service ? <ServiceSample service={service} /> : <DevicesLanding />;
}

function DevicesLanding() {
  return (
    <main id="main-content" className="min-h-screen">
      <Breadcrumb items={[{ label: "Төхөөрөмж" }]} />

      <section className="flex min-h-[60vh] items-center justify-center px-4 py-20">
        <h1 className="text-foreground text-center text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          ЭНД ТӨХӨӨРӨМЖИЙН ХЭСЭГ БАЙНА
        </h1>
      </section>

      <Footer />
    </main>
  );
}

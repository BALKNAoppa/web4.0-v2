"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Footer } from "@/components/layout/footer";
import { ServiceSample } from "@/components/sections/service-sample";
import { findService } from "@/data/service-index";

/**
 * Ерөнхий үйлчилгээний sample зам — өөрийн гэсэн бүрэн хуудас хараахан
 * байхгүй зүйлст (HBO Max, M Karaoke, Smart Home г.м.) очих газар болно.
 *   /service?id=hbo-max
 * Контентоо цэсний датаас (service-index) уншина.
 */
export default function ServicePage() {
  return (
    <Suspense fallback={null}>
      <ServiceRouter />
    </Suspense>
  );
}

function ServiceRouter() {
  const id = useSearchParams().get("id");
  const service = id ? findService(`/service?id=${id}`) : null;

  if (!service) return <UnknownService />;
  return <ServiceSample service={service} />;
}

function UnknownService() {
  return (
    <main id="main-content" className="min-h-screen">
      <Breadcrumb items={[{ label: "Үйлчилгээ" }]} />
      <section className="py-16">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight">Үйлчилгээ олдсонгүй</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            Хайсан үйлчилгээ цэсэнд байхгүй байна. Дээрх цэснээс сонгоно уу.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}

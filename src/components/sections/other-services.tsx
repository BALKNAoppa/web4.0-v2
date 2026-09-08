import Link from "next/link";
import {
  ArrowDownUp,
  CreditCard,
  Globe,
  Layers,
  Smartphone,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { otherServices, otherServicesTitle, type OtherServiceIcon } from "@/data/other-services";
import { ACCENT } from "@/lib/brand";

/**
 * "БУСАД ҮЙЛЧИЛГЭЭ" — `Promotions`-ийн ШУУД дор.
 *
 *              Бусад үйлчилгээ                  ← ГАНЦ гарчиг, ТӨВД
 *   [◯ Дата багц      ] [◯ Нэмэлт үйлчилгээ ]   ← 2 багана (мобайл)
 *   [◯ Family үйлчилг.] [◯ Олон улсын үйлч.  ]
 *
 * ⚠️ ХУУЧИН ХУВИЛБАР ХАСАГДСАН (2026-09-07). Өмнө нь энэ section нь
 * "Санал болгох үйлчилгээ" гэсэн гарчигтай бөгөөд `BrandRibbon`-оор ӨНГӨТ
 * дүрст товчны ХЭВТЭЭ мөр (7 × `size-20` тайл, шошго нь дүрсний ДООД талд,
 * нарийн дэлгэцэнд хэвтээ гүйлгээ) рендэрлэдэг байв. Захиалагчийн явуулсан
 * загвар нь ГОЛЛУУЛСАН СЕТКА, ногоон ХҮРЭЭТЭЙ дугуй дүрс, шошго нь дүрсний
 * ХАЖУУД тул бүтэц шинээр бичигдсэн.
 * → `BrandRibbon` компонент ба `recommendedServicesRibbon` дата нь одоо ХААНА
 *   Ч дуудагдахгүй болсон. УСТГААГҮЙ — устгах эсэхийг захиалагч шийднэ.
 *
 * ⚠️ ТАЙЛБАР МӨР БАЙХГҮЙ — захиалагч "short description-гүйгээр" гэж
 * тусгайлан хэлсэн. Хөрш section-ууд (`RecommendedPlans`, `Promotions`)
 * гарчиг + тайлбартай тул энэ нь ЗОРИУДЫН ялгаа, мартагдсан зүйл БИШ.
 *
 * ⚠️ ГАРЧИГ ТӨВД, хэмжээ нь `RecommendedPlans` · `Promotions`-тэй НЭГ
 * (`text-3xl md:text-4xl lg:text-5xl`) — нүүрний section-ууд нэг хэмнэлтэй
 * байх ёстой тул гурвыг зэрэг өөрчил.
 *
 * ⚠️ `<section>` байх ЁСТОЙ бөгөөд `#main-content`-ийн ШУУД хүүхэд —
 * `SectionSnapScroller` тэгж хайдаг.
 */
const ICONS: Record<OtherServiceIcon, LucideIcon> = {
  data: ArrowDownUp,
  addons: Layers,
  family: Users,
  international: Globe,
  "home-internet": Wifi,
  phone: Smartphone,
  "prepaid-card": CreditCard,
};

export function OtherServices() {
  return (
    <section
      aria-labelledby="other-services-title"
      className="bg-background w-full pt-6 pb-14 md:pt-8 md:pb-20 lg:pt-10 lg:pb-24"
    >
      <div className="mx-auto max-w-300 px-4">
        <h2
          id="other-services-title"
          className="text-foreground text-center text-3xl font-extrabold tracking-tight text-balance md:text-4xl lg:text-5xl"
        >
          {otherServicesTitle}
        </h2>

        {/* СЕТКА — мобайлд 2 багана (загварын дагуу), өргөн дэлгэцэнд 3 ба 4.
            7 зүйл тул сүүлийн мөр дүүрэхгүй — тэр нь загварт ч ийм. */}
        <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 lg:grid-cols-4">
          {otherServices.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.label}>
                {/* `h-full` — хөрш нь хоёр мөр шошготой байхад (ж:
                    "Нэмэлт үйлчилгээ") нэг мөртэй нь ч ижил өндөртэй болно. */}
                <Link
                  href={item.href}
                  className="bg-card focus-visible:ring-ring focus-visible:ring-offset-background flex h-full items-center gap-3 rounded-2xl p-3 transition-shadow duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {/* НОГООН ХҮРЭЭТЭЙ дугуй — дотор нь тунгалаг.
                      ⚠️ Өнгө нь `border-primary` (oklch) БИШ, `ACCENT`
                      (`lib/brand.ts`): брэнд бүр өөрийн ногоонтой байх ёстой
                      (Unitel #45c700 / Univision #0FAA0A).
                      ⚠️ Дүрс нь ЧИМЭГЛЭЛ (`aria-hidden`) — мэдээллийг доорх
                      шошго бүрэн дамжуулна. Тиймээс ногоон нь цагаан дээр
                      ердөө ~2.1:1 болох нь WCAG 1.4.11-ийг зөрчихгүй (тэр нь
                      МЭДЭЭЛЭЛ дамжуулах графикт хамаарна). */}
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border-2"
                    style={{ borderColor: ACCENT, color: ACCENT }}
                  >
                    <Icon className="size-5" strokeWidth={2} />
                  </span>
                  <span className="text-foreground text-sm leading-snug font-semibold">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

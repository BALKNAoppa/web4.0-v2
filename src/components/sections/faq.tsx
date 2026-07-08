"use client";

import Link from "next/link";
import { Wifi, Tv, Film, Receipt, Package, Headphones, type LucideIcon } from "lucide-react";

import { faqCategories, faqMeta, type FaqCategory, type FaqIcon } from "@/data/faq";

// Icon нэрийг lucide компонентэд буулгах map
const iconMap: Record<FaqIcon, LucideIcon> = {
  internet: Wifi,
  tv: Tv,
  movie: Film,
  billing: Receipt,
  subscription: Package,
  agent: Headphones,
};

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-muted/30 py-7 lg:py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 id="faq-title" className="text-3xl font-bold tracking-tight md:text-4xl">
            {faqMeta.title}
          </h2>
          <p className="text-muted-foreground mt-3 text-base md:text-lg">{faqMeta.description}</p>
        </div>

        {/* Circular icon grid — 6 категори (entry point → /support) */}
        <ul
          aria-label="FAQ ангилал"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6"
        >
          {faqCategories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </ul>
      </div>
    </section>
  );
}

// =====================================================================
// CATEGORY ITEM — circular icon + label
// opensChat үед хуудас руу шилжихгүй, глобал chatbot-ыг нээнэ
// =====================================================================
function CategoryItem({ category }: { category: FaqCategory }) {
  const Icon = iconMap[category.icon];

  const itemClass =
    "group focus-visible:ring-ring flex w-full flex-col items-center gap-3 rounded-lg p-2 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

  const content = (
    <>
      <span className="bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground flex size-16 items-center justify-center rounded-full transition-all group-hover:scale-110 group-hover:shadow-lg md:size-20">
        <Icon className="size-7 md:size-8" aria-hidden="true" />
      </span>
      <span className="text-foreground text-center text-sm font-medium md:text-base">
        {category.label}
      </span>
    </>
  );

  return (
    <li>
      {category.opensChat ? (
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("univision:chat-open"))}
          className={itemClass}
        >
          {content}
        </button>
      ) : (
        <Link href={category.href} className={itemClass}>
          {content}
        </Link>
      )}
    </li>
  );
}

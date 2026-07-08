import { Headphones, Search } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqMeta, faqTopics } from "@/data/faq";

/**
 * /support хуудсанд харагдах Singtel-style тусламжийн төв:
 *  - Дээд card: avatar + хайлтын input + "Асуух" товч
 *  - Доод card: "Түгээмэл асуултууд" гарчигтай Accordion
 *
 * `title` prop өгөгдсөн үед категори тус бүрийн тусгай гарчгийг харуулна
 * (жш: "Танд интернеттэй холбоотой тусламж хэрэгтэй юу?")
 */
export function SupportCenter({ title }: { title?: string }) {
  const displayTitle = title ?? faqMeta.title;
  return (
    <section
      id="support"
      aria-labelledby="support-title"
      className="bg-muted/30 py-12 lg:py-16"
    >
      <div className="mx-auto max-w-4xl space-y-6 px-4">
        {/* =============== TOP CARD — Avatar + Search =============== */}
        <div className="bg-card border-border rounded-2xl border p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div
              className="bg-primary text-primary-foreground flex size-16 shrink-0 items-center justify-center rounded-full shadow-md sm:size-20"
              aria-hidden="true"
            >
              <Headphones className="size-7 sm:size-8" strokeWidth={1.8} />
            </div>

            {/* Title + Search form */}
            <div className="w-full flex-1">
              <h1
                id="support-title"
                className="text-foreground text-2xl font-bold tracking-tight md:text-3xl"
              >
                {displayTitle}
              </h1>

              <form
                role="search"
                action="#"
                className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <label htmlFor="support-search" className="sr-only">
                  Тусламжийн хайлт
                </label>
                <div className="relative flex-1">
                  <Search
                    className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    id="support-search"
                    type="search"
                    name="q"
                    placeholder={faqMeta.searchPlaceholder}
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30 h-12 w-full rounded-lg border px-3 pl-9 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/40 inline-flex h-12 items-center justify-center rounded-lg px-8 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {faqMeta.askButtonText}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* =============== BOTTOM CARD — Trending topics =============== */}
        <div className="bg-card border-border rounded-2xl border shadow-sm">
          <div className="border-border border-b px-6 py-5 sm:px-8">
            <h2 className="text-foreground text-lg font-semibold tracking-tight md:text-xl">
              {faqMeta.trendingTitle}
            </h2>
          </div>

          <Accordion type="single" collapsible className="px-6 sm:px-8">
            {faqTopics.map((topic) => (
              <AccordionItem key={topic.id} value={topic.id}>
                <AccordionTrigger className="text-base font-medium md:text-lg">
                  {topic.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {topic.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

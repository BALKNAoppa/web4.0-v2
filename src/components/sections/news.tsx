import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { newsItems, newsSection, type NewsItem } from "@/data/news";

export function News() {
  return (
    <section aria-labelledby="news-title" className="bg-background py-12 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h2 id="news-title" className="text-3xl font-bold tracking-tight md:text-4xl">
            {newsSection.title}
          </h2>
          <Link
            href={newsSection.ctaHref}
            className="text-primary hover:text-primary/80 focus-visible:ring-ring mt-3 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {newsSection.ctaLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Cards grid */}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newsItems.map((item) => (
            <li key={item.id}>
              <NewsCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={item.href}
      className="group bg-card border-border focus-visible:ring-ring relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {/* Image */}
      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
        {item.image && (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
          {item.category}
        </div>
        <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-lg font-bold tracking-tight transition-colors md:text-xl">
          {item.title}
        </h3>
        <p className="text-muted-foreground mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">
          {item.description}
        </p>

        {/* Arrow at bottom right — Telstra-маягийн */}
        <div className="text-foreground mt-4 flex justify-end">
          <ArrowRight
            className="size-5 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

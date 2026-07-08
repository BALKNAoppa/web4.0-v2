import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { MovieCard } from "@/components/sections/tvod-movie-card";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getCategoryIds, getCategoryMovies, getCategoryTitle } from "@/data/tvod-movies";

/**
 * Static generation — бүх category-уудын page-ийг build-time-д үүсгэнэ.
 * (5 category тул маш хямд.)
 */
export function generateStaticParams() {
  return getCategoryIds().map((id) => ({ id }));
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const title = getCategoryTitle(id);
  const movies = getCategoryMovies(id);

  if (!title || movies.length === 0) {
    notFound();
  }

  return (
    <main id="main-content" className="min-h-screen">
      <Breadcrumb
        items={[
          { label: "Энтертайнмент" },
          { label: "TVOD", href: "/entertainment/main#tvod" },
          { label: title },
        ]}
      />

      <section className="bg-background py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link
            href={`/entertainment/main#category-${id}`}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Кино сан руу буцах
          </Link>

          {/* Header */}
          <div className="mt-6 mb-10">
            <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {movies.length} кино
            </p>
          </div>

          {/* Movies grid */}
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}

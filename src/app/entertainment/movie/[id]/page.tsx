import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Star } from "lucide-react";

import { MovieCard } from "@/components/sections/tvod-movie-card";
import { TrailerDialog } from "@/components/sections/trailer-dialog";
import { RentMovieButton } from "@/components/sections/rent-movie-button";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { tvodMovies } from "@/data/tvod-movies";
import {
  formatRuntime,
  getMovieById,
  getMovieDetail,
  getSimilarMovies,
} from "@/data/tvod-movie-details";

/**
 * Бүх кинонд detail page-ийг build-time-д үүсгэнэ. Detail metadata байхгүй
 * кинонууд ч graceful fallback-аар (poster→backdrop, багийн мэдээлэл нуугдсан)
 * харагдана.
 */
export function generateStaticParams() {
  return tvodMovies.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = getMovieById(id);
  if (!movie) return { title: "Кино олдсонгүй" };
  return {
    title: `${movie.title} (${movie.year}) — Univision TVOD`,
    description: movie.description,
  };
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = getMovieById(id);

  if (!movie) {
    notFound();
  }

  const detail = getMovieDetail(id);
  const similar = getSimilarMovies(id, 5);

  // Detail metadata байхгүй үеийн fallback-ууд
  const dateLabel = detail?.releaseDate ?? String(movie.year);
  const runtimeLabel = detail ? formatRuntime(detail.runtimeMinutes) : null;
  const backdrop = detail?.backdrop ?? movie.poster;

  return (
    <main id="main-content" className="min-h-screen">
      <Breadcrumb
        items={[
          { label: "Энтертайнмент" },
          { label: "TVOD", href: "/entertainment/main#tvod" },
          { label: movie.title },
        ]}
      />

      <article className="bg-background py-8 lg:py-10">
        <div className="container mx-auto px-4">
          {/* ============ HEADER — гарчиг + rating ============ */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                {movie.title}
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm md:text-base">
                {dateLabel}
                {runtimeLabel && (
                  <>
                    <span className="px-2" aria-hidden="true">
                      ·
                    </span>
                    {runtimeLabel}
                  </>
                )}
              </p>
            </div>

            <RatingBlock rating={movie.rating} voteCount={detail?.voteCount} />
          </div>

          {/* ============ MEDIA — poster + backdrop/trailer ============ */}
          <div className="mt-6 grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)] md:grid-cols-[225px_minmax(0,1fr)]">
            {/* Poster */}
            <div className="bg-muted relative aspect-[2/3] overflow-hidden rounded-2xl shadow-sm">
              {movie.poster && (
                <Image
                  src={movie.poster}
                  alt={`${movie.title} постер`}
                  fill
                  sizes="(min-width: 768px) 225px, (min-width: 640px) 180px, 50vw"
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {/* Backdrop + Watch Trailer — poster-тэй ижил өндөртэй (sm+) */}
            <div className="bg-muted relative aspect-video overflow-hidden rounded-2xl shadow-sm sm:aspect-auto sm:h-full">
              {backdrop && (
                <Image
                  src={backdrop}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 70vw, 100vw"
                  className="object-cover"
                  priority
                />
              )}

              {/* Доод-зүүн булангийн үйлдлүүд: Трейллер + Кино түрээслэх */}
              <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
                {detail?.trailerUrl && (
                  <TrailerDialog
                    title={movie.title}
                    trailerUrl={detail.trailerUrl}
                    triggerClassName="bg-background/90 text-foreground hover:bg-background focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-lg backdrop-blur transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  />
                )}
                <RentMovieButton title={movie.title} />
              </div>
            </div>
          </div>

          {/* ============ GENRES ============ */}
          {movie.genres.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <li
                  key={genre}
                  className="bg-muted text-foreground rounded-full px-3 py-1 text-xs font-medium"
                >
                  {genre}
                </li>
              ))}
            </ul>
          )}

          {/* ============ OVERVIEW ============ */}
          {movie.description && (
            <p className="text-foreground mt-4 max-w-3xl text-sm leading-relaxed md:text-base">
              {movie.description}
            </p>
          )}

          {/* ============ CREW ============ */}
          {detail && (
            <dl className="mt-8 max-w-4xl">
              <CrewRow label="Director" names={[detail.director]} />
              <CrewRow label="Writer" names={detail.writers} />
              <CrewRow label="Stars" names={detail.stars} />
            </dl>
          )}

          {/* ============ MORE LIKE THIS ============ */}
          {similar.length > 0 && (
            <section aria-labelledby="more-like-this" className="mt-12">
              <div className="flex items-center justify-between gap-4">
                <h2
                  id="more-like-this"
                  className="text-foreground text-2xl font-bold tracking-tight"
                >
                  Ижил төстэй кинонууд
                </h2>
                <Link
                  href="/entertainment/main#tvod"
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex shrink-0 items-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  See more
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {similar.map((m) => (
                  <li key={m.id}>
                    <MovieCard movie={m} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}

// =====================================================================
// RATING BLOCK — баруун дээд булан (Rating / ★ 7.0/10 / vote count)
// =====================================================================
function RatingBlock({ rating, voteCount }: { rating: number; voteCount?: number }) {
  return (
    <div className="shrink-0 text-right">
      <div className="text-muted-foreground text-xs font-semibold tracking-wide">Rating</div>
      <div className="mt-1 flex items-center justify-end gap-1.5">
        <Star className="size-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
        <span className="text-foreground text-base font-bold">
          <span className="sr-only">Үнэлгээ </span>
          {rating.toFixed(1)}
          <span className="text-muted-foreground text-sm font-medium">/10</span>
        </span>
      </div>
      {typeof voteCount === "number" && (
        <div className="text-muted-foreground mt-0.5 text-xs">{voteCount}</div>
      )}
    </div>
  );
}

// =====================================================================
// CREW ROW — Director / Writer / Stars. Нэрсийг "·"-аар тусгаарлана.
// =====================================================================
function CrewRow({ label, names }: { label: string; names: string[] }) {
  if (names.length === 0) return null;
  return (
    <div className="border-border flex flex-col gap-1 border-b py-4 sm:flex-row sm:gap-6">
      <dt className="text-foreground w-28 shrink-0 text-sm font-bold">{label}</dt>
      <dd className="text-muted-foreground text-sm">
        <span className="text-muted-foreground/50" aria-hidden="true">
          ·{" "}
        </span>
        {names.map((name) => (
          <span key={name}>
            {name}
            <span className="text-muted-foreground/50" aria-hidden="true">
              {" · "}
            </span>
          </span>
        ))}
      </dd>
    </div>
  );
}

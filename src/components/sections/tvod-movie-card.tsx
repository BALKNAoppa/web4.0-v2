import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { type TvodMovie } from "@/data/tvod-movies";

/**
 * Нэг TVOD кинонын карт — Postercount: poster (есвэл placeholder) + rating + title.
 * tvod-catalog (search/grid) болон category detail page-д хоёуланд ашиглагдана.
 */
export function MovieCard({ movie }: { movie: TvodMovie }) {
  return (
    <Link
      href={`/entertainment/movie/${movie.id}`}
      className="group bg-card focus-visible:ring-ring block overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="bg-muted relative aspect-[2/3] w-full overflow-hidden">
        {movie.poster ? (
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-3">
            <span className="text-muted-foreground text-center text-sm font-semibold">
              {movie.title}
            </span>
          </div>
        )}
      </div>
      <div className="px-3 py-3">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
          <span>
            <span className="sr-only">Үнэлгээ </span>
            {movie.rating.toFixed(1)}/10
          </span>
          <span className="text-muted-foreground/60">·</span>
          <span>{movie.year}</span>
        </div>
        <h4 className="text-foreground mt-1.5 truncate text-sm font-medium" title={movie.title}>
          {movie.title}
        </h4>
      </div>
    </Link>
  );
}

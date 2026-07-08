/**
 * Univision Web 4.0 — TVOD movie detail metadata
 *
 * `tvod-movies.ts`-ийн үндсэн catalog дээр нэмэлт "detail page"-ийн мэдээллийг
 * (нээлтийн огноо, үргэлжлэх хугацаа, багийн бүрэлдэхүүн, trailer, backdrop)
 * энд кино тус бүрийн id-гаар хадгална. Зөвхөн бэлтгэгдсэн кинонууд энд орно;
 * бусад кино detail хуудсандаа graceful fallback-аар харагдана.
 *
 * Backdrop зургууд: public/tvod/backdrops/{id}.(jpg|jpeg)
 */
import { tvodMovies, type TvodMovie } from "@/data/tvod-movies";

export type TvodMovieDetail = {
  /** ISO огноо — "2024-03-01" */
  releaseDate: string;
  /** Үргэлжлэх хугацаа минутаар */
  runtimeMinutes: number;
  /** Үнэлгээ өгсөн хүний тоо (rating-ийн доор) */
  voteCount: number;
  /** Landscape backdrop — public folder path */
  backdrop: string;
  /** Trailer-ийн холбоос (YouTube гэх мэт). Байхгүй бол товч харагдахгүй. */
  trailerUrl?: string;
  director: string;
  writers: string[];
  stars: string[];
};

export const tvodMovieDetails: Record<string, TvodMovieDetail> = {
  "dune-part-two": {
    releaseDate: "2024-03-01",
    runtimeMinutes: 166,
    voteCount: 1,
    backdrop: "/tvod/backdrops/dune-part-two.jpeg",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    director: "Denis Villeneuve",
    writers: ["Denis Villeneuve", "Jon Spaihts", "Frank Herbert"],
    stars: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Josh Brolin"],
  },
  oppenheimer: {
    releaseDate: "2023-07-21",
    runtimeMinutes: 180,
    voteCount: 1,
    backdrop: "/tvod/backdrops/oppenheimer.jpeg",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    director: "Christopher Nolan",
    writers: ["Christopher Nolan", "Kai Bird", "Martin J. Sherwin"],
    stars: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr.", "Florence Pugh"],
  },
  "the-batman": {
    releaseDate: "2022-03-04",
    runtimeMinutes: 176,
    voteCount: 1,
    backdrop: "/tvod/backdrops/the-batman.jpeg",
    trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    director: "Matt Reeves",
    writers: ["Matt Reeves", "Peter Craig"],
    stars: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Jeffrey Wright", "Colin Farrell"],
  },
};

/** Catalog-аас кино id-гаар хайх */
export function getMovieById(id: string): TvodMovie | undefined {
  return tvodMovies.find((m) => m.id === id);
}

/** Detail metadata буцаах (байхгүй бол undefined) */
export function getMovieDetail(id: string): TvodMovieDetail | undefined {
  return tvodMovieDetails[id];
}

/** "More like this" — ижил genre хуваалцсан кинонууд (өөрийгөө хасч, rating-аар эрэмбэлнэ) */
export function getSimilarMovies(id: string, limit = 10): TvodMovie[] {
  const movie = getMovieById(id);
  if (!movie) return [];
  return tvodMovies
    .filter((m) => m.id !== id && m.genres.some((g) => movie.genres.includes(g)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/** Минутыг "2h 46m" / "3h" хэлбэрт хөрвүүлэх */
export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

import { tvodMovies, type TvodMovie } from "@/data/tvod-movies";

export type TvodMovieDetail = {
  releaseDate: string;
  runtimeMinutes: number;
  voteCount: number;
  backdrop: string;
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

export function getMovieById(id: string): TvodMovie | undefined {
  return tvodMovies.find((m) => m.id === id);
}

export function getMovieDetail(id: string): TvodMovieDetail | undefined {
  return tvodMovieDetails[id];
}

export function getSimilarMovies(id: string, limit = 10): TvodMovie[] {
  const movie = getMovieById(id);
  if (!movie) return [];
  return tvodMovies
    .filter((m) => m.id !== id && m.genres.some((g) => movie.genres.includes(g)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

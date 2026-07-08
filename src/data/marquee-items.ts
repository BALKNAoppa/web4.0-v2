/**
 * Univision Web 4.0 — Featured content
 *
 * Apps болон Movies хоёр тусдаа массив.
 * featured-marquee.tsx дотор хоёр өөр carousel ажиллана:
 *  - Apps: том center-peek carousel
 *  - Movies: жижиг center-peek carousel
 * Хоёулаа ижил pattern, ижил 5s tutам shift хийнэ.
 */

export type MarqueeItem = {
  id: string;
  name: string;
  description: string;
  href: string;
  shade: "light" | "medium" | "dark";
  /** Landscape зураг — байхгүй үед shade placeholder харагдана */
  image?: string;
};

// ====================================================
// APPS — landscape зургийг public/featured/apps/{id}.jpg-аас уншина
// ====================================================
export const apps: MarqueeItem[] = [
  {
    id: "hbo-max",
    name: "HBO Max",
    description: "Дэлхийн шилдэг кино, цуврал, шоу нэвтрүүлэгүүд — нэг дор.",
    href: "/entertainment/main#tvod",
    shade: "dark",
    image: "/featured/apps/hbo-max.png",
  },
  {
    id: "sport-app",
    name: "Sport App",
    description: "Шууд дамжуулалт, онцлох мөч, статистикуу, 4K нягтаршил.",
    href: "/entertainment/main#tvod",
    shade: "medium",
    image: "/featured/apps/sport-app.png",
  },
  {
    id: "m-karaoke",
    name: "M Karaoke",
    description: "10,000+ дуу.",
    href: "/entertainment/main#tvod",
    shade: "light",
    image: "/featured/apps/m-karaoke.jpg",
  },
  {
    id: "adult-app",
    name: "Adult App",
    description: "Зөвхөн насанд хүрэгчдэд зориулсан контент.",
    href: "/entertainment/main#tvod",
    shade: "dark",
    image: "/featured/apps/adult-app.png",
  },
];

// ====================================================
// MOVIES — TVOD каталогын бодит кино, постеруудыг ашиглана
// ====================================================
import { tvodMovies } from "@/data/tvod-movies";

/** Featured marquee-д харуулах кинонуудын id (TVOD каталогаас) */
const FEATURED_MOVIE_IDS = [
  "dune-part-two",
  "oppenheimer",
  "the-batman",
  "interstellar",
  "spider-verse-2",
  "demon-slayer-infinity-castle",
  "john-wick-4",
  "parasite",
];

export const movies: MarqueeItem[] = FEATURED_MOVIE_IDS.map((id, i) => {
  const m = tvodMovies.find((mv) => mv.id === id);
  if (!m) throw new Error(`Featured movie id "${id}" not found in tvodMovies`);
  return {
    id: m.id,
    name: m.title,
    description: `${m.genres.join(", ")} · ${m.year}`,
    href: "/entertainment/main#tvod",
    shade: (["light", "medium", "dark"] as const)[i % 3],
    image: m.poster,
  };
});

export const featuredSection = {
  eyebrow: "Endless entertainment",
  title: "Endless entertainment",
  description: "Кино, спорт, апп — нэг газар.",
};  
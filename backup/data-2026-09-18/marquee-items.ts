import { tvodMovies } from "@/data/tvod-movies";

const UNIVISION_APPS = "/Univision/apps";

export type MarqueeItem = {
  id: string;
  photoLabel: string;
  name: string;
  description: string;
  href: string;
  shade: "light" | "medium" | "dark";
  image?: string;
  restricted?: boolean;
};

export const apps: MarqueeItem[] = [
  {
    id: "hbo-max",
    photoLabel: "HBO Max",
    name: "HBO Max",
    description: "Дэлхийн шилдэг стрийминг платформ Юнивишнд.",
    href: "/#",
    shade: "dark",
    image: `${UNIVISION_APPS}/hbo-max.png`,
  },
  {
    id: "sport-app",
    photoLabel: "Спорт Апп",
    name: "Спорт Апп",
    description: "Үндэсний дээд лиг ба EASL — 2025-2026 оны тэмцээн.",
    href: "/#",
    shade: "dark",
    image: `${UNIVISION_APPS}/sport-app.png`,
  },
  {
    id: "m-karaoke",
    photoLabel: "M-Karaoke",
    name: "M-Karaoke",
    description: "Караоке апп.",
    href: "/#",
    shade: "medium",
    image: `${UNIVISION_APPS}/m-karaoke.jpg`,
  },
  {
    id: "adult-app",
    photoLabel: "Нууц өрөө",
    name: "Нууц өрөө",
    description: "Насанд хүрэгчдэд зориулсан контент.",
    href: "/#",
    shade: "dark",
    image: `${UNIVISION_APPS}/adult-app.png`,
    restricted: true,
  },
];

export const movies: MarqueeItem[] = tvodMovies.slice(0, 8).map((movie, i) => ({
  id: movie.id,
  photoLabel: movie.title,
  name: movie.title,
  description: movie.genres.slice(0, 2).join(" · "),
  href: "/#",
  shade: (["light", "medium", "dark"] as const)[i % 3],
  image: movie.poster,
}));

export const featuredSection = {
  title: "Кино, цуврал, контентийг нэг дороос",
  ctaLabel: "Дэлгэрэнгүй",
};

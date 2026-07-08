/**
 * Univision Web 4.0 — TVOD онцлох багцууд
 *
 * Монгол, Хит цуврал, Ази — тус бүр нэг cover image-тэй hero card-ууд.
 * Зургийг picsum.photos-аас seeded placeholder татна.
 */
export type TvodPackage = {
  id: string;
  name: string;
  description: string;
  /** Багцын cover image */
  cover?: string;
  /** Багцын дэлгэрэнгүй хуудас руу очих URL */
  detailHref: string;
};

function picsumCover(seed: string): string {
  return `https://picsum.photos/seed/${seed}-pkg/900/600`;
}

export const tvodPackages: TvodPackage[] = [
  {
    id: "mongol",
    name: "Монгол багц",
    description:
      "Манай улсынхаа кино урлагийн алтан үе нэг дор. Хуучин классикаас орчин үеийн хит хүртэл — Монголын хамгийн алдартай уран сайхны кино, цувралуудыг нэгтгэв. Хэрвээ та Монгол кино урлагийн сүүлийн зууны турш хэрхэн өөрчлөгдсөнийг харах хүсэлтэй бол энэхүү багцыг түрээслээд үзээрэй!",
    cover: picsumCover("mongol"),
    detailHref: "#",
  },
  {
    id: "hit-series",
    name: "Хит цуврал багц",
    description:
      "Бидний зурагтын өмнө ойр дотныхонтойгоо тодорхой нэг цагт болзуулдаг байсан зүйл бол хит болж байсан цувралууд. Сүүлийн 20-иод жилийн турш гарсан олон хит цуврал кинонуудыг нэг дор хүссэн цагтаа үзээрэй! Хуанжу Гэг, Дэгүй нас, Сэргэлэн охин Ян Сун, Чингис хаан зэрэг олон гайхалтай цуврал танд хүлээж байна.",
    cover: picsumCover("hit-series"),
    detailHref: "#",
  },
  {
    id: "asia",
    name: "Ази багц",
    description:
      "Сүүлийн жилүүдэд Дорнын кино урлаг барууны кино урлагийг гүйцэж ирээд байна. Солонгосын KBS, MBC, SBC зэрэг алдартай сувгуудын шилдэг контент, нэг ангит болон олон ангит кинонуудыг албан ёсны эрхтэйгээр, дуу дүрсний өндөр чанартайгаар үзэхийг хүсвэл Ази багцыг түрээслээрэй!",
    cover: picsumCover("asia"),
    detailHref: "#",
  },
];

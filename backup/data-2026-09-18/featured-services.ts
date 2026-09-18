const UNIVISION_POPULAR = "/Univision/Most  popular";

export type FeaturedService = {
  id: string;
  badge?: string;
  photoLabel: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image?: string;
  imagePosition?: string;
};

export const featuredServicesSection = {
  title: "Эрэлттэй байгаа үйлчилгээ",
};

export const featuredServices: FeaturedService[] = [
  {
    id: "hbo-max",
    photoLabel: "HBO Max",
    title: "HBO Max x Univision",
    description:
      "Албан ёсны эрхтэй HBO Max-ийг Юнивишнээрээ өндөр дуу, дүрсний чанартайгаар үзээрэй.",
    ctaLabel: "Идэвхжүүлэх",
    href: "/#",
    image: `${UNIVISION_POPULAR}/attachment.jpeg`,
  },
  {
    id: "sport-app",
    photoLabel: "Спорт Апп",
    title: "Спорт Апп",
    description: "Дэлхийн болон Монголын шилдэг лигүүдийг шууд дамжуулна",
    ctaLabel: "Идэвхжүүлэх",
    href: "/#",
    image: `${UNIVISION_POPULAR}/sport-app.jpg`,
    imagePosition: "center bottom",
  },
];

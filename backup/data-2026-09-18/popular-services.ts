export type PopularService = {
  id: string;
  image: string;
  imageAlt?: string;
  imagePosition?: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  activation?: string;
};

export const popularServicesSection = {
  title: "Эрэлттэй байгаа үйлчилгээ",
};

export const popularServices: PopularService[] = [
  {
    id: "call-save",
    image: "/Unitel/Most  popular/Duudlaga hadgalah.png",
    title: "Дуудлага хадгалах",
    imagePosition: "center 5%",
    description:
      "Аялалаар явах үедээ дуудлага хадгалах үйлчилгээгээ идэвхжүүлэн чухал дуудлага бүрийн мэдээллийг алдалгүй аваарай.",
    ctaLabel: "Идэвхжүүлэх",
    href: "/#",
  },
  {
    id: "family",
    image: "/Unitel/Most  popular/Family.png",
    title: "Family үйлчилгээ",
    imagePosition: "center 57%",
    description:
      "Гэр бүлийн үйлчилгээ шинэчлэгдэж илүү цогц боллоо Гэр бүлээрээ Family-д нэгдээд олон давуу талыг нэг дороос авах боломжтой.",
    ctaLabel: "Идэвхжүүлэх",
    href: "/#",
  },
];

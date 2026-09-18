export type WifiOption = {
  id: string;
  name: string;
  highlight?: string;
  description: string;
  previewText: string;
  devices: string;
  meshCount: number;
  hasOverflow?: boolean;
  illustration: "studio" | "small" | "medium" | "house";
};

export const wifiOptions: WifiOption[] = [
  {
    id: "small-apt",
    name: "Жижиг хэмжээтэй орон сууц",
    description: "1-2 өрөө, <60m²",
    previewText: "Жижиг хэмжээтэй орон сууцанд Univision Home Gateway дангаараа хангалттай.",
    devices: "1 × HGW",
    meshCount: 0,
    illustration: "studio",
  },
  {
    id: "medium-apt",
    name: "Дунд зэргийн орон сууц",
    description: "3-4 өрөө, <100m²",
    previewText:
      "Дунд зэргийн орон сууцанд нэг Mesh нэмэхэд гэрийн аль ч хэсэгт сүлжээ тогтвортой байна.",
    devices: "1 × HGW + 1 × Mesh",
    meshCount: 1,
    illustration: "medium",
  },
  {
    id: "large-apt",
    name: "Том хэмжээтэй орон сууц",
    description: "5+ өрөө, >130m²",
    previewText:
      "Том хэмжээтэй орон сууцанд нэмэлтээр 2 Mesh нэмэх нь танд мэдрэгдэх интернет алдагдал багасна.",
    devices: "1 × HGW + 2 × Mesh",
    meshCount: 2,
    illustration: "small",
  },
  {
    id: "house",
    name: "Хувийн орон сууц",
    description: "2-3 давхар",
    previewText: "Олон давхар сууцанд давхар тус бүрд Mesh байрлуулж бүх талбайг хамруулна.",
    devices: "1 × HGW + давхар тус бүрд Mesh",
    meshCount: 2,
    hasOverflow: true,
    illustration: "house",
  },
];

export const wifiSection = {
  eyebrow: "Гэрийн Wi-Fi",
  title: "Интернэт шийдэлүүд",
  descriptionPrefix: "Орон сууцны хэмжээгээ сонгоод ",
  descriptionHighlight: "хамгийн тохиромжтой",
  descriptionSuffix: " Wi-Fi шийдэлийг сонгоорой.",
  devicesLabel: "Шаардлагатай төхөөрөмж",
  ctaText: "Төхөөрөмж харах",
  ctaHref: "/devices?type=fttr",
  secondaryCtaText: "AI туслахаас асуух",
  secondaryCtaHref:
    "/assistant?q=%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%BD%D1%8D%D1%82%D0%B8%D0%B9%D0%BD%20%D1%85%D1%83%D1%80%D0%B4%20%D1%83%D0%B4%D0%B0%D0%B0%D0%BD%20%D0%B1%D0%B0%D0%B9%D0%BD%D0%B0",
};

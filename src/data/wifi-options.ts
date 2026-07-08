/**
 * Univision Web 4.0 — Wi-Fi сонголтын data
 *
 * 4 apartment категори, тус бүрд нь:
 *  - apartment-ийн нэр, тайлбар
 *  - шаардлагатай device тоо ба нэр
 *  - Building illustration variant key
 */

export type WifiOption = {
  id: string;
  /** Card дээр харагдах нэр */
  name: string;
  /** Card-ын дотоод тайлбар (өрөө тоо, m²) */
  highlight?: string;
  description: string;
  /** Preview хэсгийн "энэ apartment-д" зориулсан тайлбар */
  previewText: string;
  devices: string;
  /** Mesh device тоо — баруун талын visualization-д ашиглана */
  meshCount: number;
  /** Олон mesh байрлахыг "..." хэлбэрээр харуулах эсэх */
  hasOverflow?: boolean;
  /** Building illustration variant — SVG-д хэрэглэгдэнэ */
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
    illustration: "studio", // 1 device — нэг HGW
  },
  {
    id: "medium-apt",
    name: "Дунд зэргийн орон сууц",
    description: "3-4 өрөө, <100m²",
    previewText: "Дунд зэргийн орон сууцанд нэг Mesh нэмэхэд алслагдсан өрөөнүүд ч тогтвортой холбогдоно.",
    devices: "1 × HGW + 1 × Mesh",
    meshCount: 1,
    illustration: "medium", // 2 device — HGW + 1 Mesh
  },
  {
    id: "large-apt",
    name: "Том хэмжээтэй орон сууц",
    description: "5+ өрөө, >130m²",
    previewText: "Том хэмжээтэй орон сууцанд нэмэлтээр 2 Mesh нэмэх нь танд мэдрэгдэх интернет алдагдал багасна.",
    devices: "1 × HGW + 2 × Mesh",
    meshCount: 2,
    illustration: "small", // 3 device — HGW + 2 Mesh (SmallBuilding 3 device харуулна)
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
  /** Description-аас "highlight" үгийг __HIGHLIGHT__ marker-аар тэмдэглэв */
  descriptionPrefix: "Орон сууцны хэмжээгээ сонгоод ",
  descriptionHighlight: "хамгийн тохиромжтой",
  descriptionSuffix: " Wi-Fi шийдэлийг сонгоорой.",
  ctaText: "Дэлгэрэнгүй",
  ctaHref: "#",
};
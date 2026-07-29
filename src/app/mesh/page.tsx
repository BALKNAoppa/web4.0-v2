import type { Metadata } from "next";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Footer } from "@/components/layout/footer";
import { WifiPromo } from "@/components/sections/wifi-promo";

export const metadata: Metadata = {
  title: "Mesh Wi-Fi — гэрийн бүрэн хамрах хүрээ",
  description:
    "Сууцныхаа хэмжээгээр хэдэн Mesh цэг хэрэгтэйгээ хараарай — HGW, Mesh, FTTR шийдлүүд.",
};

/**
 * Mesh / Wi-Fi шийдлийн хуудас.
 *
 * Гол агуулга нь `WifiPromo` — сууцны хэмжээгээ сонгоход хэдэн HGW + Mesh
 * төхөөрөмж хэрэгтэйг байрны зурган дээр амьдаар харуулна.
 *
 * Hero-гийн туслах ("Интернэтийн хурд удаан…") болон нүүрний Mesh tile
 * хоёулаа энэ зам руу заана.
 */
export default function MeshPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Breadcrumb items={[{ label: "Mesh Wi-Fi" }]} />
      <WifiPromo />
      <Footer />
    </main>
  );
}

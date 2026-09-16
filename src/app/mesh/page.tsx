import type { Metadata } from "next";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Footer } from "@/components/layout/footer";
import { MeshSolutions } from "@/components/sections/mesh-solutions";
import { WifiPromo } from "@/components/sections/wifi-promo";

export const metadata: Metadata = {
  title: "Mesh Wi-Fi — гэрийн бүрэн хамрах хүрээ",
  description:
    "Сууцныхаа хэмжээгээр хэдэн Mesh цэг хэрэгтэйгээ хараарай — HGW, Mesh, FTTR шийдлүүд.",
};

export default function MeshPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Breadcrumb items={[{ label: "Mesh Wi-Fi" }]} />
      <WifiPromo />
      <MeshSolutions />
      <Footer />
    </main>
  );
}

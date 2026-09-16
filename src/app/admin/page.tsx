import type { Metadata } from "next";

import { VariantSwitch } from "./variant-switch";

export const metadata: Metadata = {
  title: "Удирдлага — хувилбар",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Header-ийн хувилбар</h1>
        <p className="text-muted-foreground text-sm">
          Сонгосон хувилбар нь Unitel болон Univision хоёуланд, нээлттэй байгаа бүх device дээр 1-3
          секундын дараа шинэчлэгддэг байна.
        </p>
      </div>

      <VariantSwitch />
    </main>
  );
}

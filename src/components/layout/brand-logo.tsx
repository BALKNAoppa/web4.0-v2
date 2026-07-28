import Image from "next/image";

import { BRAND, BRAND_LABEL, BRAND_LOGO } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Тухайн сайтын брэндийн үгэн лого — Unitel эсвэл Univision, light/dark хосоор.
 * Аль нь гарахыг NEXT_PUBLIC_BRAND шийднэ (build-ийн үед шигтгэгдэнэ).
 *
 * height нь ЗОРИЛТОТ өндөр (px); брэндийн scale-аар нэмэгдэж бодит өндөр гарна.
 * Ингэснээр дуудах тал нэг тоо өгөхөд хоёр брэндийн лого оптикоор жигд харагдана.
 *
 * Зөвхөн зургийг рендэрлэнэ (Link-гүй) — ингэснээр header өөрийн Link-д,
 * footer нь LogoHomeLink-д хийж, nested anchor үүсэхгүй.
 */
export function BrandLogo({
  height = 24,
  className,
  preload = false,
}: {
  height?: number;
  className?: string;
  preload?: boolean;
}) {
  const logo = BRAND_LOGO[BRAND];
  const alt = BRAND_LABEL[BRAND];
  const style = { height: Math.round(height * logo.scale), width: "auto" as const };

  return (
    <>
      <Image
        src={logo.light}
        alt={alt}
        width={logo.width}
        height={logo.height}
        preload={preload}
        style={style}
        className={cn("dark:hidden", className)}
      />
      <Image
        src={logo.dark}
        alt={alt}
        width={logo.width}
        height={logo.height}
        preload={preload}
        style={style}
        className={cn("hidden dark:block", className)}
      />
    </>
  );
}

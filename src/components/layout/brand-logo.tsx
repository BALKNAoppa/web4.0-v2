import Image from "next/image";

import { BRAND, BRAND_LABEL, BRAND_LOGO } from "@/lib/brand";
import { cn } from "@/lib/utils";

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

"use client";

import Link from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

import { resolveHref, type Owner } from "@/lib/brand";

type SmartLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Дотоод зам ("/main-packages?plan=triple"), гадаад URL эсвэл "#" */
  href: string;
  /** Хэн эзэмших вэ — энэ сайтынх бол дотоод, эсрэг бол нөгөө домэйн руу */
  owner?: Owner;
  children: ReactNode;
};

/**
 * Эко-системийн линк. Эзэн нь энэ сайт бол Next-ийн дотоод шилжилт, өөр брэнд
 * бол нөгөө сайтын НҮҮР рүү — ЭНЭ ТАБ ДОТРОО (2026-09-15). Зөвхөн жинхэнэ
 * гадаад URL (http…) л шинэ tab нээнэ — `resolveHref`-ийн `newTab`-ийг үз.
 *
 * ЧУХАЛ: дотоод/гадаад хоёр нь ХАРАГДАЦААРАА ЯЛГАРАХГҮЙ — сум ч, брэндийн нэр
 * ч байхгүй. Хэрэглэгчид ганц нэгдсэн цэс мэт мэдрэгдэх нь концепцийн гол цөм.
 *
 * forwardRef + prop spread — NavigationMenuLink asChild доор ажиллах шаардлагатай.
 */
export const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(function SmartLink(
  { href, owner, children, ...rest },
  ref,
) {
  const resolved = resolveHref(href, owner);

  if (resolved.external) {
    // ⚠️ `target` нь ЗӨВХӨН `newTab` үед. Хөндлөн брэнд нь бүтэн хуудас
    // ачаалалтайгаар ЭНЭ ТАБ ДОТРОО шилжинэ — өөр deployment тул Next-ийн
    // router-аар явах боломжгүй, `<a>` хэвээр.
    return (
      <a
        ref={ref}
        href={resolved.href}
        {...(resolved.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={resolved.href} {...rest}>
      {children}
    </Link>
  );
});

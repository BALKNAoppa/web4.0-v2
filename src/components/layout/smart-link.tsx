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
 * бол нөгөө домэйны бүтэн URL руу шинэ tab-аар.
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
    return (
      <a ref={ref} href={resolved.href} target="_blank" rel="noopener noreferrer" {...rest}>
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

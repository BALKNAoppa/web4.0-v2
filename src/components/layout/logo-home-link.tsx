"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Logo-ны нүүр хуудас руу заах link:
 *  - Өөр хуудсан дээр: ердийн navigation (Next.js автоматаар дээрээс эхлүүлнэ)
 *  - Нүүр хуудсан дээр: navigation хийхгүй, зөөлөн дээш (top section руу) scroll хийнэ
 */
export function LogoHomeLink({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        if (pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      {children}
    </Link>
  );
}

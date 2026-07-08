import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  /** Заагдсан бол линк, эс бөгөөс одоогийн (current) item */
  href?: string;
};

type BreadcrumbProps = {
  /** Эхэнд тавих "нүүр" линк. Default: { href: "/" } */
  homeHref?: string;
  /** Дунд болон сүүлийн item-ууд. Сүүлийнх href-гүй бол одоогийн хуудас гэж үзнэ. */
  items: BreadcrumbItem[];
};

/**
 * Дэлгэцийн дээд талд харагдах breadcrumb.
 * Эхэнд Home icon → ChevronRight → линк-үүд → одоогийн хуудас (foreground өнгөтэй).
 */
export function Breadcrumb({ homeHref = "/", items }: BreadcrumbProps) {
  return (
    <nav aria-label="Хуудасны зам" className="bg-background">
      <div className="container mx-auto px-4 py-1.5">
        <ol className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
          <li className="inline-flex items-center">
            <Link
              href={homeHref}
              aria-label="Нүүр хуудас"
              className="hover:text-foreground focus-visible:ring-ring inline-flex items-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <Home className="size-3.5" aria-hidden="true" />
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isCurrent = isLast || !item.href;
            return (
              <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                <ChevronRight
                  className="text-muted-foreground/60 size-3"
                  aria-hidden="true"
                />
                {isCurrent ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="text-foreground font-medium"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href!}
                    className="hover:text-foreground focus-visible:ring-ring rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

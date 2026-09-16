import Link from "next/link";
import {
  CreditCard,
  Gift,
  Layers,
  Package,
  Smartphone,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { type BrandRibbonIcon, type BrandRibbonItem } from "@/data/brand-ribbon";
import { cn } from "@/lib/utils";

const RIBBON_ICONS: Record<BrandRibbonIcon, LucideIcon> = {
  smartphone: Smartphone,
  "credit-card": CreditCard,
  users: Users,
  layers: Layers,
  gift: Gift,
  package: Package,
  wifi: Wifi,
};

export function BrandRibbon({ items, label }: { items: BrandRibbonItem[]; label: string }) {
  return (
    <nav aria-label={label} className="mx-auto max-w-[1200px] px-4 py-10">
      <ul className="flex items-start gap-3 overflow-x-auto pb-2 lg:justify-between">
        {items.map((item) => {
          const Icon = RIBBON_ICONS[item.icon];
          return (
            <li key={item.label} className="shrink-0">
              {
}
              <Link
                href={item.href}
                className="group flex w-32 flex-col items-center gap-3 text-center"
              >
                <span
                  className={cn(
                    "flex size-20 items-center justify-center rounded-2xl",
                    "transition-transform duration-700 ease-out group-hover:-translate-y-1",
                    item.tint,
                  )}
                >
                  <Icon className="size-9" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="-mt-2 text-[10px] font-semibold text-red-500">{item.badge}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

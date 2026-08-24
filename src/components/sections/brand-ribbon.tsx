import Link from "next/link";
import {
  CreditCard,
  Gift,
  Layers,
  Package,
  Smartphone,
  Users,
  type LucideIcon,
} from "lucide-react";

import { type BrandRibbonIcon, type BrandRibbonItem } from "@/data/brand-ribbon";
import { cn } from "@/lib/utils";

/**
 * BRAND RIBBON — өнгөт дүрст ангиллын товчлолын мөр.
 *
 * Устсан брэнд хуудасны template-ээс (`brand-showcase.tsx`) АВЧ ҮЛДСЭН цорын
 * ганц хэсэг. Дүрс нь өнгөт дугуйвтар дөрвөлжинд, доор нь шошго; hover дээр
 * зөөлөн дээш хөвнө.
 *
 * ⚠️ ОДООГООР ХААНА Ч ДУУДАГДААГҮЙ — байрлах хуудсаа хүлээж байна.
 *
 * Дүрсийг НЭРЭЭР (`icon: "smartphone"`) өгдөг болохоос component дамжуулдаггүй:
 * data давхарга (`brand-ribbon.ts`) нь `lucide-react`-аас хамаарахгүй байх
 * ёстой — эс бөгөөс серверийн data файл UI сангаас хамаарна.
 */
const RIBBON_ICONS: Record<BrandRibbonIcon, LucideIcon> = {
  smartphone: Smartphone,
  "credit-card": CreditCard,
  users: Users,
  layers: Layers,
  gift: Gift,
  package: Package,
};

export function BrandRibbon({ items, label }: { items: BrandRibbonItem[]; label: string }) {
  return (
    // `overflow-x-auto` — нарийн дэлгэцэнд хэвтээ гүйлгэнэ (мөр таслахгүй),
    // өргөн дэлгэцэнд төвлөрнө.
    <nav aria-label={label} className="mx-auto max-w-[1200px] px-4 py-10">
      <ul className="flex items-start gap-3 overflow-x-auto pb-2 lg:justify-center lg:gap-7">
        {items.map((item) => {
          const Icon = RIBBON_ICONS[item.icon];
          return (
            <li key={item.label} className="shrink-0">
              {/* `Link` — өмнө нь энгийн `<a>` байсан (зөвхөн `#anchor` рүү
                  үсэрдэг байсан тул). Одоо бодит зам ч орох боломжтой болсон
                  учир `next/link`-ээр client-side navigation болгов. */}
              <Link
                href={item.href}
                className="group flex w-24 flex-col items-center gap-2.5 text-center"
              >
                <span
                  className={cn(
                    "flex size-16 items-center justify-center rounded-2xl",
                    "transition-transform duration-700 ease-out group-hover:-translate-y-1",
                    item.tint,
                  )}
                >
                  <Icon className="size-7" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="text-xs font-medium">{item.label}</span>
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

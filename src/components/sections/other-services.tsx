import Link from "next/link";
import {
  ArrowDownUp,
  CreditCard,
  Globe,
  Layers,
  Smartphone,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { otherServices, otherServicesTitle, type OtherServiceIcon } from "@/data/other-services";
import { ACCENT } from "@/lib/brand";
import { sectionType } from "@/lib/section-type";
import { cn } from "@/lib/utils";
import { sectionBg } from "@/lib/section-bg";

const ICONS: Record<OtherServiceIcon, LucideIcon> = {
  data: ArrowDownUp,
  addons: Layers,
  family: Users,
  international: Globe,
  "home-internet": Wifi,
  phone: Smartphone,
  "prepaid-card": CreditCard,
};

export function OtherServices() {
  return (
    <section
      aria-labelledby="other-services-title"
      className={cn(sectionBg.page, "w-full pt-6 pb-14 md:pt-8 md:pb-20 lg:pt-10 lg:pb-24")}
    >
      <div className="mx-auto max-w-300 px-4">
        <h2 id="other-services-title" className={cn("text-center", sectionType.title)}>
          {otherServicesTitle}
        </h2>

        <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 lg:grid-cols-4">
          {otherServices.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="bg-card focus-visible:ring-ring focus-visible:ring-offset-background flex h-full items-center gap-3 rounded-2xl p-3 transition-shadow duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border-2"
                    style={{ borderColor: ACCENT, color: ACCENT }}
                  >
                    <Icon className="size-5" strokeWidth={2} />
                  </span>
                  <span className="text-foreground text-sm leading-snug font-semibold">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { mobilePlansDescription } from "@/data/mobile-plans";
import { Reveal } from "@/components/web4/reveal";

const UNITEL_GREEN = "#45c700";

export function MobilePlans() {
  return (
    <section
      aria-labelledby="mobile-plans-title"
      className="bg-background relative w-full overflow-hidden"
    >
      {
}
      <Reveal>
        <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-6 px-4 py-8 sm:gap-10 sm:py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
          {}
          <div className="order-2 lg:order-1">
            <div
              className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase"
              style={{ color: UNITEL_GREEN }}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: UNITEL_GREEN }}
                aria-hidden="true"
              />
              Үндсэн бүтээгдэхүүн · Мобайл
            </div>

            <h2
              id="mobile-plans-title"
              className="text-foreground mt-3 text-3xl font-extrabold tracking-tight sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl"
            >
              <span>Дараа төлбөрт</span> багцууд
            </h2>

            <p className="text-muted-foreground mt-4 max-w-lg text-base leading-relaxed sm:mt-5 md:text-lg">
              {mobilePlansDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-7">
              <Link
                href="#"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#45c700] px-7 text-sm font-semibold text-white transition-opacity duration-700 ease-out hover:opacity-85"
              >
                Дэлгэрэнгүй үзэх
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {
}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="ring-border/60 relative aspect-square w-full max-w-[38svh] overflow-hidden rounded-3xl shadow-xl ring-1 sm:max-w-md lg:max-w-lg">
              <Image
                src="/Priority.jpg"
                alt="Priority дараа төлбөрт багц"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 70vw, 95vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

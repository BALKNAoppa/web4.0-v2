import Link from "next/link";
import { ArrowRight, Cable, Router, Wifi } from "lucide-react";

import { deviceProducts } from "@/data/devices";

const SOLUTIONS = [
  { id: "net-hgw", Icon: Router },
  { id: "extra-mesh", Icon: Wifi },
  { id: "extra-fttr", Icon: Cable },
]
  .map(({ id, Icon }) => {
    const device = deviceProducts.find((d) => d.id === id);
    return device ? { device, Icon } : null;
  })
  .filter((x): x is { device: (typeof deviceProducts)[number]; Icon: typeof Router } => x !== null);

export function MeshSolutions() {
  if (SOLUTIONS.length === 0) return null;

  return (
    <section aria-labelledby="mesh-solutions-title" className="bg-background pb-14 lg:pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          {
}
          <span className="text-foreground/75 text-xs font-bold tracking-wider uppercase">
            Төхөөрөмжийн сонголт
          </span>
          {}
          <h2
            id="mesh-solutions-title"
            className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
          >
            HGW · Mesh · FTTR — гурван шийдэл
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm md:text-base">
            Хамрах хүрээг тэлэх гурван зам. Дээрх сонголт нь танд хэдэн төхөөрөмж хэрэгтэйг, доорх
            гурав нь ямар төхөөрөмж болохыг харуулна.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3">
          {SOLUTIONS.map(({ device, Icon }, index) => (
            <li key={device.id}>
              {
}
              <Link
                href={device.detailHref}
                className="border-border hover:border-primary/50 hover:bg-muted/30 focus-visible:ring-ring group flex h-full flex-col rounded-2xl border p-5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="flex items-center gap-3">
                  {
}
                  <span
                    aria-hidden="true"
                    className="text-foreground/70 text-xs font-bold tabular-nums"
                  >
                    0{index + 1}
                  </span>
                  <span className="bg-primary/10 text-primary inline-flex size-9 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  {device.badge && (
                    <span className="border-primary/40 text-primary ml-auto rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider">
                      {device.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-foreground mt-4 text-base font-bold">{device.name}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {device.spec}
                </p>

                {}
                <span className="text-primary mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold">
                  Дэлгэрэнгүй
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

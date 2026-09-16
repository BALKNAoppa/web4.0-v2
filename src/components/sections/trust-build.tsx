import Link from "next/link";
import { Video } from "lucide-react";

import { trustBlocks, trustBuildSection, type TrustBlock } from "@/data/trust-build";
import { cn } from "@/lib/utils";

export function TrustBuild() {
  return (
    <section aria-labelledby="trust-build-title" className="bg-background w-full">
      <h2 id="trust-build-title" className="sr-only">
        {trustBuildSection.srTitle}
      </h2>

      {
}
      <div className="mx-auto w-full max-w-[1200px] space-y-16 px-4 py-12 md:space-y-24 lg:py-20">
        {trustBlocks.map((block, i) => (
          <TrustRow key={block.id} block={block} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function TrustRow({ block, flip }: { block: TrustBlock; flip: boolean }) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {}
      <div className={cn("order-2", flip ? "lg:order-2" : "lg:order-1")}>
        <h3 className="text-foreground text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl">
          {block.title}
        </h3>
        <p className="text-muted-foreground mt-3 max-w-md text-base leading-relaxed md:text-lg">
          {block.description}
        </p>

        {
}
        <Link
          href={block.href}
          className="border-border text-primary hover:bg-muted focus-visible:ring-ring focus-visible:ring-offset-background mt-6 inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {block.ctaLabel}
        </Link>
      </div>

      {}
      <div className={cn("order-1", flip ? "lg:order-1" : "lg:order-2")}>
        <VideoPlaceholder label={block.videoLabel} />
      </div>
    </div>
  );
}

function VideoPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 rounded-2xl bg-[#1c1c1c]">
      <Video className="size-8 text-white/25" strokeWidth={1.5} aria-hidden="true" />
      <span className="text-sm font-medium text-white/40">{label}</span>
    </div>
  );
}

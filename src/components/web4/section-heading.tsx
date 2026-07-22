import type { ReactNode } from "react";
import { Reveal } from "@/components/web4/reveal";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, sub, className }: Props) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <Reveal>
        <span className="text-xs font-bold tracking-[0.32em] text-[#7dfa5a] uppercase md:text-sm">
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={100}>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-white md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={200}>
          <p className="mx-auto mt-4 max-w-xl text-base text-balance text-white/60 md:text-lg">
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type BrowserFrameProps = {
  src?: string;
  label: string;
  url?: string;
  className?: string;
  imgClassName?: string;
};

/** Browser-chrome frame around a live-site screenshot (graceful placeholder). */
export function BrowserFrame({
  src,
  label,
  url,
  className,
  imgClassName,
}: BrowserFrameProps) {
  const [ok, setOk] = useState(Boolean(src));

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl shadow-black/50",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="size-2 rounded-full bg-white/25" />
        <span className="size-2 rounded-full bg-white/25" />
        <span className="size-2 rounded-full bg-white/25" />
        <span className="mx-auto max-w-[70%] truncate rounded-md bg-white/5 px-3 py-0.5 text-[11px] text-white/45">
          {url?.replace(/^https?:\/\//, "") ?? label}
        </span>
      </div>
      <div className={cn("relative w-full", imgClassName ?? "aspect-[16/10]")}>
        {ok && src ? (
          <Image
            src={src}
            alt={label}
            fill
            sizes="(min-width:1024px) 640px, 92vw"
            className="object-cover object-top"
            onError={() => setOk(false)}
          />
        ) : (
          <div className="grid h-full place-items-center">
            <span className="text-sm font-semibold text-white/40">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

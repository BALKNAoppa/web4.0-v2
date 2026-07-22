import type { Metadata } from "next";

import { Web4Scroll } from "@/components/web4/web4-scroll";

export const metadata: Metadata = {
  title: "Web 4.0 — Concept",
  description:
    "Асуудлаас нэгдсэн шийдэл хүртэл — Unitel/Univision группын вэбсайтын стратегийн интерактив танилцуулга.",
};

export default function Web4Page() {
  return <Web4Scroll />;
}

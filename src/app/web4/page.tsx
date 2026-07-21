import type { Metadata } from "next";

import { Web4Deck } from "@/components/sections/web4-deck";

export const metadata: Metadata = {
  title: "Web 4.0 — Concept",
  description:
    "Brand architecture and how company goals and customer needs converge into Web 4.0.",
};

export default function Web4Page() {
  return <Web4Deck />;
}

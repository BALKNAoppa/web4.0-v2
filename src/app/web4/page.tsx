import type { Metadata } from "next";

import { Web4Deck } from "@/components/sections/web4-deck";

export const metadata: Metadata = {
  title: "Web 4.0 — Концепц",
  description:
    "Байгууллагын зорилго ба хэрэглэгчийн хэрэгцээ нэгдэж Web 4.0 болох bubble концепц.",
};

export default function Web4Page() {
  return <Web4Deck />;
}

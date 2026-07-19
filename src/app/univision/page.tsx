import type { Metadata } from "next";

import { BrandShowcase } from "@/components/sections/brand-showcase";
import { univisionPage } from "@/data/brand-pages";

export const metadata: Metadata = {
  title: "Univision — Телевиз ба контент",
  description: "Univision — IPTV, телевиз болон контентын үйлчилгээ.",
};

export default function UnivisionPage() {
  return <BrandShowcase page={univisionPage} />;
}

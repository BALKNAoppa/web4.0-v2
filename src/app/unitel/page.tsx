import type { Metadata } from "next";

import { BrandShowcase } from "@/components/sections/brand-showcase";
import { unitelPage } from "@/data/brand-pages";

export const metadata: Metadata = {
  title: "Unitel — Мобайл үйлчилгээ",
  description: "Unitel — мобайл, дата болон ярианы багцууд.",
};

export default function UnitelPage() {
  return <BrandShowcase page={unitelPage} />;
}

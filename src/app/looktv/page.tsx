import type { Metadata } from "next";

import { BrandShowcase } from "@/components/sections/brand-showcase";
import { looktvPage } from "@/data/brand-pages";

export const metadata: Metadata = {
  title: "LookTV — Интернэт телевиз",
  description: "LookTV — интернэт телевиз, кино болон контентын стриминг үйлчилгээ.",
};

export default function LooktvPage() {
  return <BrandShowcase page={looktvPage} />;
}

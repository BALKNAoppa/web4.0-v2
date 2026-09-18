import type { Metadata } from "next";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Footer } from "@/components/layout/footer";
import { ChatHero } from "@/components/sections/chat-hero";

export const metadata: Metadata = {
  title: "Ухаалаг туслах",
  description: "Асуултаа бичээд танд тохирох багц, үйлчилгээг олоорой.",
};

export default async function AssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = params.q;
  const initialQuestions = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return (
    <main id="main-content" className="min-h-dvh">
      <Breadcrumb items={[{ label: "Ухаалаг туслах" }]} />
      <ChatHero mode="page" initialQuestions={initialQuestions} />
      <Footer />
    </main>
  );
}

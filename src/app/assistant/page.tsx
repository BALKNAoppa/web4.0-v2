import type { Metadata } from "next";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Footer } from "@/components/layout/footer";
import { ChatHero } from "@/components/sections/chat-hero";

export const metadata: Metadata = {
  title: "Ухаалаг туслах",
  description: "Асуултаа бичээд танд тохирох багц, үйлчилгээг олоорой.",
};

/**
 * AI ТУСЛАХЫН ЯРИАНЫ ХУУДАС.
 *
 * Нүүрний hero нь ЗӨВХӨН НЭГ хариулт харуулдаг — яриа тэнд овоолохгүй.
 * Хэрэглэгч хоёр дахь асуултаа асуумагц энэ хуудас руу шилжиж, яриа нь
 * бүтнээрээ үргэлжилнэ. Ирмэгийн chat таб ч мөн энд авчирна.
 *
 * ЯРИА URL-ЭЭР ДАМЖИНА (`?q=…&q=…`), `sessionStorage`-аар БИШ:
 *   · server component нь `searchParams`-ыг шууд уншдаг тул эхний render
 *     дээрээ бүтэн яриатай гарна — hydration зөрөхгүй, анивчихгүй
 *   · линк хуваалцаж, буцах товч дарж, дахин ачаалж болно
 *
 * ⚠️ `ChatHero`-г ДАХИН АШИГЛАЖ байна (`mode="page"`). Хариултын бүх хэлбэр
 * (bullet, карт, ↳ санал, 👍👎) нэг эх сурвалжтай тул нүүр ба энэ хуудас
 * хоёр хэзээ ч зөрөхгүй.
 */
export default async function AssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = params.q;
  const initialQuestions = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return (
    <main id="main-content" className="min-h-screen">
      <Breadcrumb items={[{ label: "Ухаалаг туслах" }]} />
      <ChatHero mode="page" initialQuestions={initialQuestions} />
      <Footer />
    </main>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Gauge,
  List,
  Smartphone,
  Star,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { SupportAskBar } from "@/components/sections/support-ask-bar";
import {
  supportQuickLinks,
  type CategoryDetail,
  type SupportQuickLink,
  type SupportQuickLinkIcon,
  type SupportTopic,
} from "@/data/faq";

// Quick link иконы нэрийг lucide компонентэд буулгах map
const quickLinkIconMap: Record<SupportQuickLinkIcon, LucideIcon> = {
  usage: Gauge,
  account: UserRound,
  app: Smartphone,
  business: Briefcase,
};

type Props = {
  title: string;
  detail: CategoryDetail;
};

/**
 * /support?category={id} URL дээр харагдах категори тус бүрийн дэлгэрэнгүй:
 *  - Төв тэгшилсэн том гарчиг + тайлбар
 *  - 2 card: "Түгээмэл асуудлууд" + "Бусад асуудлууд"
 */
export function SupportCategoryDetail({ title, detail }: Props) {
  return (
    <section aria-labelledby="support-category-title" className="bg-muted/30 py-12 lg:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Hero */}
        <div className="mb-10 text-center md:mb-14">
          <h1
            id="support-category-title"
            className="text-foreground text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl"
          >
            {title}
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm leading-relaxed md:text-base">
            {detail.description}
          </p>

          {/* Ask AI — асуултыг глобал chatbot руу дамжуулна */}
          <SupportAskBar quickQuestions={detail.quickQuestions} />
        </div>

        {/* Two cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Frequent topics */}
          <TopicCard
            icon={<Star className="size-5" aria-hidden="true" />}
            title="Хайлт өндөртэй асуултууд"
            topics={detail.frequentTopics}
            columns={1}
          />

          {/* Other topics — 2 columns inside */}
          <TopicCard
            icon={<List className="size-5" aria-hidden="true" />}
            title="Бусад асуулт"
            topics={detail.otherTopics}
            columns={2}
          />
        </div>

        {/* Quick links — Singtel-style card-ууд */}
        <ul
          aria-label="Шуурхай холбоосууд"
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {supportQuickLinks.map((link) => (
            <QuickLinkCard key={link.id} link={link} />
          ))}
        </ul>
      </div>
    </section>
  );
}

// =====================================================================
// QUICK LINK CARD — дугуй икон + гарчиг + тайлбар + линк
// =====================================================================
function QuickLinkCard({ link }: { link: SupportQuickLink }) {
  const Icon = quickLinkIconMap[link.icon];

  return (
    <li className="bg-card border-border flex flex-col items-center rounded-2xl border p-6 text-center shadow-sm transition-shadow hover:shadow-lg">
      <span
        className={`flex size-20 items-center justify-center rounded-full ${link.iconBg}`}
        aria-hidden="true"
      >
        <Icon className="size-9" strokeWidth={1.6} />
      </span>

      <h3 className="text-foreground mt-4 text-base font-semibold tracking-tight md:text-lg">
        {link.title}
      </h3>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{link.description}</p>

      <Link
        href={link.href}
        className="text-primary hover:text-primary/80 focus-visible:ring-primary/40 mt-auto inline-flex items-center pt-5 text-sm font-semibold transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none"
      >
        {link.linkText}
      </Link>
    </li>
  );
}

// =====================================================================
// TOPIC CARD
// =====================================================================
function TopicCard({
  icon,
  title,
  topics,
  columns,
}: {
  icon: React.ReactNode;
  title: string;
  topics: SupportTopic[];
  columns: 1 | 2;
}) {
  return (
    <article className="bg-card border-border rounded-2xl border p-6 shadow-sm sm:p-8">
      <header className="text-foreground mb-4 flex items-center gap-2">
        <span className="text-primary" aria-hidden="true">
          {icon}
        </span>
        <h2 className="text-base font-semibold tracking-tight md:text-lg">{title}</h2>
      </header>

      <ul className={`grid gap-x-6 gap-y-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {topics.map((topic) => {
          const isExternal = topic.href.startsWith("http");
          const linkClass =
            "text-primary hover:text-primary/80 focus-visible:ring-primary/40 group inline-flex items-start gap-1.5 rounded text-sm leading-relaxed transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";
          const inner = (
            <>
              <ArrowRight
                className="mt-0.5 size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
              <span className="hover:underline">{topic.label}</span>
            </>
          );

          return (
            <li key={topic.id}>
              {isExternal ? (
                // Гадаад мэдээллийн сан (ckb.unitel.mn) — шинэ tab-д нээнэ
                <a
                  href={topic.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {inner}
                </a>
              ) : (
                <Link href={topic.href} className={linkClass}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

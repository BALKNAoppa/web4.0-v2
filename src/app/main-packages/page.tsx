"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  Phone,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Tv,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { plans, type Plan, type PlanGroup } from "@/data/plans";
import { quizQuestions, computeRecommendation, type PlanId } from "@/data/main-packages-quiz";

const iconMap: Record<PlanGroup["icon"], LucideIcon> = {
  wifi: Wifi,
  tv: Tv,
  play: Play,
  phone: Phone,
};

type Message =
  | { id: string; role: "bot"; text: string }
  | { id: string; role: "user"; text: string }
  | { id: string; role: "result"; plan: PlanId }
  | { id: string; role: "other-plans"; plans: PlanId[] };

const GREETING =
  "Сайн уу! Танд хамгийн тохирох багцыг сонгоход туслахын тулд хэдэн богино асуулт асууя.";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function typingDelayFor(m: Message): number {
  if (m.role === "user") return 0;
  if (m.role === "result" || m.role === "other-plans") return 700;
  const len = m.text.length;
  return Math.min(900, 350 + len * 12);
}

function buildInitialMessages(counterStart: number): { messages: Message[]; counter: number } {
  let counter = counterStart;
  const first = quizQuestions[0];
  const msgs: Message[] = [
    { id: `m-${++counter}`, role: "bot", text: GREETING },
    { id: `m-${++counter}`, role: "bot", text: first.question },
  ];
  if (first.hint) msgs.push({ id: `m-${++counter}`, role: "bot", text: first.hint });
  return { messages: msgs, counter };
}

export default function MainPackagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgCounter = useRef(0);
  const runToken = useRef(0);

  const totalQuestions = quizQuestions.length;
  const step = answers.length;
  const isResult = step >= totalQuestions;
  const currentQuestion = !isResult ? quizQuestions[step] : null;
  const recommendation = isResult ? computeRecommendation(answers) : null;
  const otherPlansShown = messages.some((m) => m.role === "other-plans");

  // Initial greeting + first question
  useEffect(() => {
    const initial = buildInitialMessages(msgCounter.current);
    msgCounter.current = initial.counter;
    void playSequence(initial.messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function nextId() {
    msgCounter.current += 1;
    return `m-${msgCounter.current}`;
  }

  async function playSequence(adds: Message[]) {
    runToken.current += 1;
    const token = runToken.current;
    setBusy(true);
    for (const m of adds) {
      if (token !== runToken.current) return;
      if (m.role === "user") {
        setMessages((prev) => [...prev, m]);
        await delay(140);
      } else {
        setTyping(true);
        await delay(typingDelayFor(m));
        if (token !== runToken.current) return;
        setTyping(false);
        setMessages((prev) => [...prev, m]);
        await delay(160);
      }
    }
    if (token === runToken.current) setBusy(false);
  }

  function buildAdvanceMessages(
    selectedOptionLabel: string,
    userBubbleText: string,
    confirm: boolean,
    newAnswers: number[],
  ): Message[] {
    const additions: Message[] = [{ id: nextId(), role: "user", text: userBubbleText }];
    if (confirm) {
      additions.push({
        id: nextId(),
        role: "bot",
        text: `Таны сонголтыг "${selectedOptionLabel}" гэж ойлголоо.`,
      });
    }
    const newStep = newAnswers.length;
    if (newStep >= totalQuestions) {
      additions.push({
        id: nextId(),
        role: "bot",
        text: "Хариултын дагуу танд хамгийн тохирох багцыг олж байна:",
      });
      additions.push({ id: nextId(), role: "result", plan: computeRecommendation(newAnswers) });
    } else {
      const nextQ = quizQuestions[newStep];
      additions.push({ id: nextId(), role: "bot", text: nextQ.question });
      if (nextQ.hint) additions.push({ id: nextId(), role: "bot", text: nextQ.hint });
    }
    return additions;
  }

  function selectOption(optionIdx: number) {
    if (isResult || busy) return;
    const q = quizQuestions[step];
    const option = q.options[optionIdx];
    if (!option) return;
    const newAnswers = [...answers, optionIdx];
    setAnswers(newAnswers);
    void playSequence(buildAdvanceMessages(option.label, option.label, false, newAnswers));
  }

  function matchOption(text: string): number | null {
    if (!currentQuestion) return null;
    const norm = text.trim().toLowerCase();
    if (!norm) return null;
    const exact = currentQuestion.options.findIndex((o) => o.label.toLowerCase() === norm);
    if (exact >= 0) return exact;
    const partial = currentQuestion.options.findIndex((o) => {
      const lbl = o.label.toLowerCase();
      return lbl.includes(norm) || norm.includes(lbl);
    });
    return partial >= 0 ? partial : null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");

    if (isResult) {
      void playSequence([
        { id: nextId(), role: "user", text },
        {
          id: nextId(),
          role: "bot",
          text: "Шинээр сонголт хийхийг хүсвэл дээд буланд буй 'Шинээр эхлэх' товчийг дарна уу.",
        },
      ]);
      return;
    }

    const matched = matchOption(text);
    if (matched !== null) {
      const option = currentQuestion!.options[matched];
      const newAnswers = [...answers, matched];
      setAnswers(newAnswers);
      void playSequence(buildAdvanceMessages(option.label, text, true, newAnswers));
      return;
    }

    void playSequence([
      { id: nextId(), role: "user", text },
      {
        id: nextId(),
        role: "bot",
        text: "Уучлаарай, таны хариултыг ойлгосонгүй. Доорх сонголтоос аль нэгийг даран сонгоно уу.",
      },
    ]);
  }

  function handleShowOtherPlans() {
    if (busy || !recommendation || otherPlansShown) return;
    const otherIds = plans.filter((p) => p.id !== recommendation).map((p) => p.id);
    void playSequence([
      { id: nextId(), role: "user", text: "Бусад багцуудыг харах" },
      { id: nextId(), role: "bot", text: "Мэдээж — энд бусад багцууд:" },
      { id: nextId(), role: "other-plans", plans: otherIds },
    ]);
  }

  function handleRestart() {
    runToken.current += 1; // cancel any in-flight sequence
    setAnswers([]);
    setInputValue("");
    msgCounter.current = 0;
    setMessages([]);
    setTyping(false);
    const initial = buildInitialMessages(msgCounter.current);
    msgCounter.current = initial.counter;
    void playSequence(initial.messages);
  }

  const showRestart = messages.length > 0 && (answers.length > 0 || messages.length > 3);

  return (
    <main id="main-content" className="min-h-screen">
      <Breadcrumb items={[{ label: "Бүтээгдэхүүн" }, { label: "Үндсэн багц" }]} />

      <section className="bg-muted/20 py-4 lg:py-8">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-primary mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="size-4" aria-hidden="true" />
              Таны хувийн туслах
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Танд тохирох багцыг олъё
            </h1>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Богино асуулт хариултын дагуу танд хамгийн тохирох багцыг олоорой.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <div
              className="bg-card border-border flex flex-col overflow-hidden rounded-2xl border shadow-sm"
              style={{ height: "min(72vh, 680px)" }}
            >
              {/* Chat header */}
              <div className="border-border bg-muted/40 flex items-center gap-3 border-b px-5 py-3">
                <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
                  <Bot className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Univision туслах</div>
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <span
                      className="inline-block size-1.5 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                    Онлайн
                  </div>
                </div>
                {showRestart && (
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    Шинээр эхлэх
                  </button>
                )}
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-5 md:px-5"
                aria-live="polite"
              >
                {groupMessages(messages).map((g, gi, all) => {
                  const isLast = gi === all.length - 1;
                  if (g.kind === "result") {
                    return <ResultMessage key={g.message.id} recommendation={g.message.plan} />;
                  }
                  if (g.kind === "other-plans") {
                    return <OtherPlansMessage key={g.message.id} planIds={g.message.plans} />;
                  }
                  if (g.kind === "bot") {
                    return (
                      <BotBubbleGroup
                        key={g.messages[0].id}
                        lines={g.messages}
                        typing={typing && isLast}
                      />
                    );
                  }
                  return <UserBubbleGroup key={g.messages[0].id} lines={g.messages} />;
                })}
                {typing && shouldShowStandaloneTyping(messages) && <TypingIndicator />}

                {/* Quick-reply chips — баруун талд (thumb навигаци дүрэм) */}
                {!busy && currentQuestion && (
                  <div className="animate-chat-msg-in flex flex-wrap justify-end gap-2">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => selectOption(idx)}
                        className="border-border bg-background hover:border-primary hover:bg-primary/5 focus-visible:ring-ring text-foreground inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:text-sm"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Үр дүн гарсны дараах follow-up chip */}
                {!busy && isResult && !otherPlansShown && (
                  <div className="animate-chat-msg-in flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleShowOtherPlans}
                      className="border-border bg-background hover:border-primary hover:bg-primary/5 focus-visible:ring-ring text-foreground inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:text-sm"
                    >
                      Бусад багцуудыг харах
                    </button>
                  </div>
                )}
              </div>

              {/* Composer — зөвхөн input */}
              <form
                onSubmit={handleSubmit}
                className="border-border bg-background flex items-center gap-2 border-t p-3 md:p-4"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isResult
                      ? "Шинээр эхлэх товчийг дарж дахин эхэлнэ үү..."
                      : "Хариултаа бичих эсвэл дээрх сонголтоос сонгоно уу"
                  }
                  className="bg-muted/50 border-border focus-visible:ring-ring text-foreground placeholder:text-muted-foreground flex-1 rounded-full border px-4 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  aria-label="Чатын мессеж"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || busy}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Илгээх"
                >
                  <Send className="size-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Дараалсан ижил-role мессежүүдийг нэг bubble-д нэгтгэх.
// Result мессеж нь үргэлж өөрөө group болно.
type BotLine = Extract<Message, { role: "bot" }>;
type UserLine = Extract<Message, { role: "user" }>;
type ResultMsg = Extract<Message, { role: "result" }>;
type OtherPlansMsg = Extract<Message, { role: "other-plans" }>;
type MessageGroup =
  | { kind: "bot"; messages: BotLine[] }
  | { kind: "user"; messages: UserLine[] }
  | { kind: "result"; message: ResultMsg }
  | { kind: "other-plans"; message: OtherPlansMsg };

function groupMessages(msgs: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];
  for (const m of msgs) {
    const last = groups[groups.length - 1];
    if (m.role === "result") {
      groups.push({ kind: "result", message: m });
      continue;
    }
    if (m.role === "other-plans") {
      groups.push({ kind: "other-plans", message: m });
      continue;
    }
    if (m.role === "bot") {
      if (last && last.kind === "bot") {
        last.messages.push(m);
      } else {
        groups.push({ kind: "bot", messages: [m] });
      }
      continue;
    }
    if (last && last.kind === "user") {
      last.messages.push(m);
    } else {
      groups.push({ kind: "user", messages: [m] });
    }
  }
  return groups;
}

// Хамгийн сүүлд илгээгдсэн мессеж нь bot бус (user/result) ҮЕД typing-ийг
// тусдаа bubble болгож зурна — bot bubble дотор шигтгэх боломжгүй учраас.
function shouldShowStandaloneTyping(msgs: Message[]): boolean {
  const last = msgs[msgs.length - 1];
  return !last || last.role !== "bot";
}

function BotBubbleGroup({ lines, typing }: { lines: BotLine[]; typing: boolean }) {
  return (
    <div className="animate-chat-msg-in flex items-end gap-2">
      <div
        className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <Bot className="size-4" />
      </div>
      <div className="bg-muted text-foreground max-w-[80%] space-y-1.5 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
        {lines.map((line) => (
          <p key={line.id} className="animate-chat-msg-in">
            {line.text}
          </p>
        ))}
        {typing && <TypingDots />}
      </div>
    </div>
  );
}

function UserBubbleGroup({ lines }: { lines: UserLine[] }) {
  return (
    <div className="animate-chat-msg-in flex justify-end">
      <div className="bg-primary text-primary-foreground max-w-[80%] space-y-1.5 rounded-2xl rounded-br-md px-4 py-2.5 text-sm">
        {lines.map((line) => (
          <p key={line.id} className="animate-chat-msg-in">
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span
      className="inline-flex items-center gap-1 pt-1"
      role="status"
      aria-label="Туслах бичиж байна"
    >
      <span
        className="animate-chat-typing-dot bg-muted-foreground/70 size-1.5 rounded-full"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="animate-chat-typing-dot bg-muted-foreground/70 size-1.5 rounded-full"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="animate-chat-typing-dot bg-muted-foreground/70 size-1.5 rounded-full"
        style={{ animationDelay: "300ms" }}
      />
    </span>
  );
}

function TypingIndicator() {
  return (
    <div className="animate-chat-msg-in flex items-end gap-2">
      <div
        className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <Bot className="size-4" />
      </div>
      <div className="bg-muted inline-flex items-center rounded-2xl rounded-bl-md px-4 py-3">
        <TypingDots />
      </div>
    </div>
  );
}

function ResultMessage({ recommendation }: { recommendation: PlanId }) {
  const plan = plans.find((p) => p.id === recommendation);
  if (!plan) return null;
  return (
    <div className="animate-chat-msg-in flex items-end gap-2">
      <div
        className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <Bot className="size-4" />
      </div>
      <div className="border-primary bg-card w-full max-w-[90%] rounded-2xl rounded-bl-md border-2 p-4 shadow-sm">
        <div className="text-primary mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase">
          <Check className="size-3.5" aria-hidden="true" />
          Танд хамгийн тохирох
        </div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
          {plan.name}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Сарын суурь хураамж <span className="text-foreground font-bold">{plan.price}</span>
        </p>
        <div className="mt-4 grid gap-4">
          {plan.groups.map((g) => (
            <PlanGroupBlock key={g.title} group={g} />
          ))}
        </div>
        <Link
          href={plan.detailHref}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring mt-5 inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Энэ багцыг захиалах
          <ArrowRight className="ml-2 size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function OtherPlansMessage({ planIds }: { planIds: PlanId[] }) {
  const list: Plan[] = planIds
    .map((id) => plans.find((p) => p.id === id))
    .filter((p): p is Plan => Boolean(p));
  if (list.length === 0) return null;
  return (
    <div className="animate-chat-msg-in flex items-end gap-2">
      <div
        className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <Bot className="size-4" />
      </div>
      <div className="bg-muted text-foreground w-full max-w-[90%] space-y-2 rounded-2xl rounded-bl-md p-3 text-sm">
        {list.map((p) => (
          <Link
            key={p.id}
            href={p.detailHref}
            className="bg-background hover:bg-background/70 focus-visible:ring-ring border-border group flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <div className="min-w-0">
              <div className="text-foreground text-base font-bold">{p.name}</div>
              <div className="text-muted-foreground text-xs">Сарын хураамж — {p.price}</div>
            </div>
            <ArrowRight
              className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

function PlanGroupBlock({ group }: { group: PlanGroup }) {
  const Icon = iconMap[group.icon];
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="text-primary size-5" />
        <h4 className="text-sm font-semibold">{group.title}</h4>
      </div>
      <dl className="space-y-1 pl-7">
        {group.features.map((feature) => (
          <div key={feature.label} className="flex items-baseline justify-between gap-2 text-sm">
            <dt className="text-muted-foreground">{feature.label}</dt>
            <dd className="text-right font-medium">{feature.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

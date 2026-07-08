"use client";

import { useEffect, useState } from "react";
import { MessageCircleQuestion, Sparkles } from "lucide-react";

/** Анимаци эхлэхээс өмнө болон асуултуудын хооронд харагдах үндсэн placeholder */
const DEFAULT_PLACEHOLDER = "Асуултаа дараах байдлаар бичнэ үү...";

/** Placeholder-ийн typing хурднууд (ms) — тайван, зөөлөн мэдрэмжээр */
const TYPE_SPEED = 55;
const ERASE_SPEED = 22;
const HOLD_AFTER_TYPED = 2400;
const GAP_BEFORE_NEXT = 450;
/** Default placeholder-ийг хэрэглэгчид уншуулах хугацаа — дараа нь жишээнүүд эхэлнэ */
const START_DELAY = 3000;

/**
 * Жишээ асуултуудыг placeholder дээр үсэг үсгээр бичиж, түр барьж,
 * арилгаад дараагийнхыг бичдэг давталт. prefers-reduced-motion үед
 * эхний асуултыг хөдөлгөөнгүй харуулна.
 * `enabled=false` үед анимаци зогсож, default placeholder харагдана
 * (хэрэглэгч input дээр бичиж байх үед сатааруулахгүй).
 */
function useTypingPlaceholder(texts: string[], enabled: boolean): string {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!enabled) {
      setText("");
      return;
    }
    if (texts.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(texts[0]);
      return;
    }

    let index = 0;
    let pos = 0;
    let erasing = false;
    let timer: number;

    const tick = () => {
      const current = texts[index];

      if (!erasing) {
        pos += 1;
        setText(current.slice(0, pos));
        if (pos >= current.length) {
          erasing = true;
          timer = window.setTimeout(tick, HOLD_AFTER_TYPED);
        } else {
          timer = window.setTimeout(tick, TYPE_SPEED);
        }
      } else {
        pos -= 1;
        setText(current.slice(0, pos));
        if (pos <= 0) {
          erasing = false;
          index = (index + 1) % texts.length;
          timer = window.setTimeout(tick, GAP_BEFORE_NEXT);
        } else {
          timer = window.setTimeout(tick, ERASE_SPEED);
        }
      }
    };

    timer = window.setTimeout(tick, START_DELAY);
    return () => window.clearTimeout(timer);
  }, [texts, enabled]);

  return text;
}

/**
 * Категори хуудасны title-н доор байрлах "AI-аас асуух" хэсэг.
 * Асуултыг өөрөө хариулахгүй — глобал ChatWidget рүү custom event-ээр
 * дамжуулж, chatbot нээгдэн хариулна (Phase 1).
 * Жишээ асуултууд placeholder дээр typing анимациар ээлжлэн харагдана.
 */
export function SupportAskBar({ quickQuestions }: { quickQuestions: string[] }) {
  const [question, setQuestion] = useState("");
  // Хэрэглэгч бичиж эхэлмэгц typing анимаци зогсоно — placeholder сатааруулахгүй
  const typedPlaceholder = useTypingPlaceholder(quickQuestions, question.length === 0);

  const askChatbot = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    window.dispatchEvent(new CustomEvent("univision:chat-ask", { detail: { question: trimmed } }));
    setQuestion("");
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      {/* Ask input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          askChatbot(question);
        }}
        className="bg-card border-border focus-within:border-primary focus-within:ring-primary/25 flex items-center gap-2 rounded-full border px-5 py-2 shadow-sm transition-all focus-within:ring-2"
      >
        <label htmlFor="support-ask-input" className="sr-only">
          Туслахаас асуух
        </label>
        <input
          id="support-ask-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={typedPlaceholder || DEFAULT_PLACEHOLDER}
          className="text-foreground placeholder:text-muted-foreground h-10 flex-1 bg-transparent text-sm outline-none"
        />
        <button
          type="submit"
          disabled={!question.trim()}
          className="text-primary hover:text-primary/80 inline-flex shrink-0 items-center gap-1 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Ai
        </button>
      </form>

      {/* Жишээ асуултууд — жижиг хэмжээтэй, багтахгүй бол дараагийн мөрөнд эвхэгдэнэ */}
      <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-1">
        {quickQuestions.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => askChatbot(q)}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded text-[11px] whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none md:text-xs"
            >
              <MessageCircleQuestion className="size-3 shrink-0" aria-hidden="true" />
              <span className="hover:underline">{q}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

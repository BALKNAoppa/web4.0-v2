"use client";

import { useEffect, useRef, useState } from "react";
import { BotMessageSquare, X, Send, Sparkles } from "lucide-react";

import { TypingAnimation } from "@/components/ui/typing-animation";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "bot",
    text: "Сайн байна уу! 👋 Би таны Univision туслах байна. Танд юугаар туслах вэ?",
  },
];

const QUICK_REPLIES = [
  "Багц сонгох",
  "Үнийн санал",
  "Холболтын заавар авах",
  "Ажилтантай холбогдох",
];

const SUGGESTION_TEXT = "Танд тусламж хэрэгтэй юу? 😊";
const SUGGESTION_DELAY_MS = 1500;

/**
 * Хэрэглэгч хамгийн сүүлд харилцан яриа эхлүүлсэн (мессеж илгээсэн) огноог
 * хадгалах түлхүүр. Тухайн өдөр яриа эхлээгүй л бол chat нээх болгонд
 * мэндчилгээ typing анимациар бичигдэж "амьд" мэдрэмж өгнө.
 */
const CONVERSATION_DATE_KEY = "univision-chat-conversation-date";

/** Өнөөдрийн огноо — YYYY-MM-DD */
const todayStr = () => new Date().toISOString().slice(0, 10);

// =====================================================================
// PHASE 1 — Бүх асуултад нэг ижил туршилтын хариу өгнө.
// Бодит AI / API холбогдох үед энэ функцийг сольж залгана.
// =====================================================================
function getBotReply(): string {
  return "Таны асуултыг хүлээн авлаа! 🤖 Одоогоор би туршилтын горимд ажиллаж байгаа тул энэ асуултад хариулж чадахгүй нь. AI холбогдсоны дараа танд зөв, дэлгэрэнгүй хариулт өгөх болно.";
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  // Анхны зочлолтод мэндчилгээг typing анимациар бичнэ
  const [typeGreeting, setTypeGreeting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Monotonic ID counter — render-ийн гадна өсдөг pure counter
  const nextIdRef = useRef(INITIAL_MESSAGES.length + 1);

  // Suggestion bubble — хуудас уншигдсаны дараа богино delay-тэйгээр гарна
  useEffect(() => {
    const t = setTimeout(() => setShowSuggestion(true), SUGGESTION_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Шинэ мессеж нэмэгдэх бүрд хамгийн доош scroll хийнэ
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat нээгдсэн үед input-д focus
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Тухайн өдөр харилцан яриа эхлээгүй л бол chat нээх болгонд
  // мэндчилгээ typing анимациар бичигдэнэ. Хэрэглэгч мессеж илгээмэгц
  // (= яриа эхэлмэгц) тэр өдрийн турш дахин бичигдэхгүй.
  useEffect(() => {
    if (!isOpen) return;
    try {
      if (localStorage.getItem(CONVERSATION_DATE_KEY) !== todayStr()) {
        setTypeGreeting(true);
      }
    } catch {
      // localStorage хориотой орчинд (private mode гэх мэт) шууд текст харуулна
    }
  }, [isOpen]);

  // ESC товч дарвал хаах
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Яриа эхэллээ — өнөөдрийн турш мэндчилгээ дахин typing хийхгүй
    try {
      localStorage.setItem(CONVERSATION_DATE_KEY, todayStr());
    } catch {
      // localStorage хориотой орчинд алгасна
    }
    setTypeGreeting(false);

    const userMsg: Message = {
      id: nextIdRef.current++,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Phase 1 — туршилтын нэг ижил хариу. Бодит AI / API-тай холбож сольно
    const reply = getBotReply();
    setTimeout(() => {
      const botMsg: Message = {
        id: nextIdRef.current++,
        role: "bot",
        text: reply,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  const openChat = () => {
    setIsOpen(true);
    setShowSuggestion(false);
  };

  // Support хуудасны Ask bar-аас ирэх асуултыг хүлээн авч chat нээгээд хариулна
  useEffect(() => {
    const onAsk = (e: Event) => {
      const question = (e as CustomEvent<{ question?: string }>).detail?.question;
      if (!question) return;
      setIsOpen(true);
      setShowSuggestion(false);
      sendMessage(question);
    };
    // "Ажилтантай холбогдох" гэх мэт газраас зүгээр л chat-ыг нээнэ (асуултгүй)
    const onOpen = () => {
      setIsOpen(true);
      setShowSuggestion(false);
    };
    window.addEventListener("univision:chat-ask", onAsk);
    window.addEventListener("univision:chat-open", onOpen);
    return () => {
      window.removeEventListener("univision:chat-ask", onAsk);
      window.removeEventListener("univision:chat-open", onOpen);
    };
    // sendMessage нь state setter-үүд дээр суурилсан тогтвортой логик тул deps-гүй
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* ============ SUGGESTION BUBBLE — Floating button-ий хажууд ============ */}
      {showSuggestion && !isOpen && (
        <div
          role="status"
          aria-live="polite"
          className="bg-card text-foreground border-border animate-in fade-in slide-in-from-bottom-2 fixed right-22 bottom-9 z-50 flex max-w-55 items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium shadow-lg duration-500 lg:right-24 lg:bottom-24"
        >
          <button
            type="button"
            onClick={openChat}
            className="text-left leading-snug"
            aria-label="Chat нээх"
          >
            {SUGGESTION_TEXT}
          </button>
          <button
            type="button"
            onClick={() => setShowSuggestion(false)}
            aria-label="Сэрэмжлүүлэг хаах"
            className="text-muted-foreground hover:text-foreground -mr-1 flex size-5 shrink-0 items-center justify-center rounded-full transition-colors"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
          {/* Speech-bubble сум (tail) */}
          <span
            aria-hidden="true"
            className="bg-card border-border absolute -right-1.5 bottom-3 size-3 rotate-45 border-r border-b"
          />
        </div>
      )}

      {/* ============ FLOATING BUTTON ============ */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Chat хаах" : "Chat нээх"}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        className={`bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:right-6 lg:bottom-20 ${
          isOpen ? "rotate-90" : ""
        }`}
      >
        {isOpen ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <>
            <BotMessageSquare className="size-6" aria-hidden="true" />
            {/* Pulse ring decoration */}
            <span
              aria-hidden="true"
              className="bg-primary absolute inset-0 -z-10 animate-ping rounded-full opacity-30"
            />
          </>
        )}
      </button>

      {/* ============ CHAT PANEL ============ */}
      {isOpen && (
        <div
          id="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-title"
          className="bg-card border-border fixed right-5 bottom-24 z-50 flex h-[min(580px,calc(100vh-8rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border shadow-2xl lg:right-6 lg:bottom-26"
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground/15 flex size-9 items-center justify-center rounded-full">
                <Sparkles className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="chat-title" className="text-sm font-semibold">
                  Univision туслах
                </h2>
                <p className="text-xs opacity-80">Онлайн • Хариулахад бэлэн</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Chat хаах"
              className="hover:bg-primary-foreground/10 -mr-1 flex size-8 items-center justify-center rounded-full transition-colors"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                typing={typeGreeting && index === 0}
                onTypingComplete={() => setTypeGreeting(false)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies — анхны байдалд л харагдана */}
          {messages.length <= 1 && (
            <div className="border-border flex flex-wrap gap-2 border-t px-4 py-3">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => sendMessage(reply)}
                  className="bg-muted hover:bg-muted/70 text-foreground rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="border-border flex items-center gap-2 border-t p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              Мессеж бичих
            </label>
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Мессеж бичих..."
              className="bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex-1 rounded-full px-4 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Илгээх"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// =====================================================================
// MESSAGE BUBBLE
// typing=true үед текст үсэг үсгээр бичигдэнэ (анхны мэндчилгээ)
// =====================================================================
function MessageBubble({
  message,
  typing = false,
  onTypingComplete,
}: {
  message: Message;
  typing?: boolean;
  onTypingComplete?: () => void;
}) {
  const isBot = message.role === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
          isBot
            ? "bg-muted text-foreground rounded-bl-sm"
            : "bg-primary text-primary-foreground rounded-br-sm"
        }`}
      >
        {typing ? (
          <TypingAnimation duration={35} delay={300} onComplete={onTypingComplete}>
            {message.text}
          </TypingAnimation>
        ) : (
          message.text
        )}
      </div>
    </div>
  );
}

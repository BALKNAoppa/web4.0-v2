"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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

// =====================================================================
// ЧИРЖ ЗӨӨХ (drag) — хөвөгч товч бусад элементтэй (жишээ нь нүүрний AI
// туслахын илгээх товч) давхцах үед хэрэглэгч өөрөө зөөж чадна.
// =====================================================================

/** Хөвөгч товчны хэмжээ (`size-14` = 56px) — байрлал тооцоход хэрэгтэй */
const FAB_SIZE = 56;
/** Дэлгэцийн ирмэгээс үлдээх хамгийн бага зай */
const EDGE_GAP = 8;
/** Үүнээс бага хөдөлгөөнийг чирэлт биш, ЗҮГЭЭР ДАРСАН гэж үзнэ */
const DRAG_THRESHOLD = 4;
/**
 * Панелийн өндөр — доорх `h-[...]` класстай ЯГ ижил илэрхийлэл байх ёстой.
 * Товчийг дээш чирэхэд панелийн дээд ирмэг дэлгэцээс гарахгүй байлгахад
 * хэрэглэнэ.
 */
const PANEL_H = "min(580px, calc(100svh - 15rem))";

/** Хөвөгч товчны байрлал — дэлгэцийн баруун/доод ирмэгээс px-ээр */
type Pos = { right: number; bottom: number };

/** Товчийг дэлгэцээс гаргахгүй барина */
function clampPos(p: Pos): Pos {
  return {
    right: Math.min(Math.max(p.right, EDGE_GAP), window.innerWidth - FAB_SIZE - EDGE_GAP),
    bottom: Math.min(Math.max(p.bottom, EDGE_GAP), window.innerHeight - FAB_SIZE - EDGE_GAP),
  };
}

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
  const pathname = usePathname();
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

  // ───── Чирж зөөх төлөв ─────
  // `null` = CSS-ийн анхны байрлал (`right-5 bottom-28`). ЗӨВХӨН чирсний
  // дараа inline style-аар дарж бичнэ — ингэснээр server/client-ийн эхний
  // render ижил хэвээр үлдэж hydration зөрөхгүй.
  const [pos, setPos] = useState<Pos | null>(null);
  const dragRef = useRef<{ x: number; y: number; from: Pos; moved: boolean } | null>(null);
  /** Чирэлт дууссаны дараа дагаж ирэх `click`-ийг залгихад */
  const draggedRef = useRef(false);

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

  // Дэлгэц (эсвэл цонх) хэмжээгээ өөрчлөхөд зөөсөн товч гадна үлдэж болзошгүй
  // тул дахин ирмэг дотор татна. `pos === null` үед юу ч хийхгүй.
  useEffect(() => {
    const onResize = () => setPos((p) => (p ? clampPos(p) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  // ───── Чирэх — pointer event (хулгана + хуруу нэг ижил замаар) ─────
  const onDragStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Хулганы зөвхөн ЗҮҮН товч. Хуруу/цахим үзэг бол шалгахгүй.
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      // Одоогийн БОДИТ байрлалаас эхэлнэ — `pos` хоосон (CSS-ийн анхны
      // байрлал) байсан ч зөв утга гарна.
      from: {
        right: window.innerWidth - rect.right,
        bottom: window.innerHeight - rect.bottom,
      },
      moved: false,
    };
    // Хуруу/хулгана товчноос гарсан ч event үргэлжлүүлэн энд ирнэ
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onDragMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    // Босго давах хүртэл хөдөлгөөнгүй — чичрэх хуруу дарахад саад болохгүй
    if (!d.moved && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
    d.moved = true;
    // right/bottom нь ирмэгээс хэмжигддэг тул хөдөлгөөнийг ХАСНА
    setPos(clampPos({ right: d.from.right - dx, bottom: d.from.bottom - dy }));
  };

  const onDragEnd = () => {
    const d = dragRef.current;
    dragRef.current = null;
    // Чирсэн бол дараагийн click-ийг залгина (chat санамсаргүй нээгдэхээс)
    draggedRef.current = d?.moved ?? false;
  };

  const onFabClick = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    setIsOpen((v) => !v);
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

  // /web4 — immersive концепцийн хуудас: chatbot харуулахгүй
  if (pathname?.startsWith("/web4")) return null;

  return (
    <>
      {/* ============ SUGGESTION BUBBLE — Floating button-ий хажууд ============ */}
      {showSuggestion && !isOpen && (
        <div
          role="status"
          aria-live="polite"
          // Байрлал: хөвөгч товчны ДЭЭР (өмнө нь ЗҮҮН талд байсан). Товчийг
          // чирсэн үед `style` нь класст өгсөн байрлалыг дарж дагана.
          // `bottom-44` = товчны дээд ирмэг (28+14=42) + 8px завсар.
          style={
            pos
              ? {
                  right: pos.right,
                  bottom: `min(${pos.bottom + FAB_SIZE + 8}px, calc(100svh - 5rem))`,
                }
              : undefined
          }
          className="bg-card text-foreground border-border animate-in fade-in slide-in-from-bottom-2 fixed right-5 bottom-44 z-50 flex max-w-55 items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium shadow-lg duration-500 lg:right-6"
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
          {/* Speech-bubble сум (tail) — ДООШ харна, товчны төв рүү чиглэнэ */}
          <span
            aria-hidden="true"
            className="bg-card border-border absolute right-6 -bottom-1.5 size-3 rotate-45 border-r border-b"
          />
        </div>
      )}

      {/* ============ FLOATING BUTTON ============ */}
      <button
        type="button"
        onClick={onFabClick}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        aria-label={isOpen ? "Chat хаах" : "Chat нээх"}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        title="Дарж нээнэ · чирж зөөнө"
        style={pos ? { right: pos.right, bottom: pos.bottom } : undefined}
        // `touch-none` — хуруугаар чирэхэд хуудас гүйлгэхгүй (drag л болно).
        // `transition-[transform,background-color]` — `transition-all` байсныг
        // сольсон: right/bottom-д анимаци тавибал чирэлт хоцорч мэдрэгддэг.
        className={`bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring fixed right-5 bottom-28 z-50 flex size-14 cursor-grab touch-none items-center justify-center rounded-full shadow-lg transition-[transform,background-color] select-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:cursor-grabbing lg:right-6 lg:bottom-28 ${
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
          // Товчийг чирсэн үед панель дагана. `min(...)` нь товчийг дээш
          // зөөхөд панелийн ДЭЭД ирмэг дэлгэцээс гарахаас сэргийлнэ —
          // хамгийн ихдээ `100svh − панелийн өндөр − 8px` хүртэл л дээшилнэ.
          style={
            pos
              ? {
                  right: pos.right,
                  bottom: `min(${pos.bottom + FAB_SIZE + 12}px, calc(100svh - ${PANEL_H} - 8px))`,
                }
              : undefined
          }
          className="bg-card border-border fixed right-5 bottom-47 z-50 flex h-[min(580px,calc(100svh-15rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border shadow-2xl lg:right-6 lg:bottom-34"
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

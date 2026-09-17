"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ASSISTANT_PATH } from "@/lib/routes";
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

const TAB_TOP = "58%";

const CONVERSATION_DATE_KEY = "univision-chat-conversation-date";

const todayStr = () => new Date().toISOString().slice(0, 10);

function getBotReply(): string {
  return "Таны асуултыг хүлээн авлаа! 🤖 Одоогоор би туршилтын горимд ажиллаж байгаа тул энэ асуултад хариулж чадахгүй нь. AI холбогдсоны дараа танд зөв, дэлгэрэнгүй хариулт өгөх болно.";
}

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typeGreeting, setTypeGreeting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(INITIAL_MESSAGES.length + 1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      if (localStorage.getItem(CONVERSATION_DATE_KEY) !== todayStr()) {
        setTypeGreeting(true);
      }
    } catch {
    }
  }, [isOpen]);

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

    try {
      localStorage.setItem(CONVERSATION_DATE_KEY, todayStr());
    } catch {
    }
    setTypeGreeting(false);

    const userMsg: Message = {
      id: nextIdRef.current++,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

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

  useEffect(() => {
    const onAsk = (e: Event) => {
      const question = (e as CustomEvent<{ question?: string }>).detail?.question;
      if (!question) return;
      setIsOpen(true);
      setRevealed(true);
      sendMessage(question);
    };
    const onOpen = () => {
      setIsOpen(true);
      setRevealed(true);
    };
    window.addEventListener("univision:chat-ask", onAsk);
    window.addEventListener("univision:chat-open", onOpen);
    return () => {
      window.removeEventListener("univision:chat-ask", onAsk);
      window.removeEventListener("univision:chat-open", onOpen);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (pathname?.startsWith("/web4") || pathname?.startsWith("/admin")) return null;

  return (
    <>
      {revealed && !isOpen && (
        <Link
          href={ASSISTANT_PATH}
          aria-label="AI туслах руу очих"
          style={{ top: TAB_TOP }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring animate-in slide-in-from-left-8 fade-in fixed left-0 z-50 flex flex-col items-center gap-2 rounded-r-xl px-2 py-4 shadow-lg transition-colors duration-500 ease-out focus-visible:ring-2 focus-visible:outline-none"
        >
          <BotMessageSquare className="size-5 shrink-0" aria-hidden="true" />
          <span className="text-xs font-semibold tracking-wide [writing-mode:vertical-rl]">
            Chat bot
          </span>
        </Link>
      )}

      {isOpen && (
        <div
          id="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-title"
          className="bg-card border-border animate-in fade-in slide-in-from-left-4 fixed bottom-4 left-4 z-50 flex h-[min(580px,calc(100svh-6rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border shadow-2xl duration-300 ease-out lg:bottom-6 lg:left-6"
        >
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

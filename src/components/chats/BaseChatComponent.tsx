import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, Menu, Settings, StopCircle, RefreshCw } from "lucide-react";

// --- Types ---
type Role = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt?: number;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt?: number;
};

// --- Helpers ---
const uid = () => Math.random().toString(36).slice(2);

const defaultWelcome: ChatMessage[] = [
  {
    id: uid(),
    role: "assistant",
    content:
      "Cześć! Jestem Twoim pomocnikiem. Zadaj pytanie albo opisz zadanie, a odpowiem najlepiej jak potrafię.",
    createdAt: Date.now(),
  },
];

// --- Avatar ---
function Avatar({ role }: { role: Role }) {
  const isUser = role === "user";
  return (
    <div
      className={`flex h-8 w-8 select-none items-center justify-center rounded-full text-xs font-semibold shadow ${isUser ? "bg-sky-600 text-white" : role === "assistant" ? "bg-emerald-600 text-white" : "bg-zinc-500 text-white"
        }`}
      aria-label={role}
    >
      {isUser ? "U" : role === "assistant" ? "AI" : "SYS"}
    </div>
  );
}

// --- Message Bubble ---
function MessageBubble({ m }: { m: ChatMessage }) {
  const isUser = m.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`group relative flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && <Avatar role={m.role} />}

      <div
        className={`${isUser
            ? "bg-sky-600 text-white"
            : "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
          } max-w-[80%] rounded-2xl px-4 py-2 shadow-sm`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">
          {m.content}
        </div>
      </div>

      {isUser && <Avatar role={m.role} />}
    </motion.div>
  );
}

// --- Typing Indicator ---
function TypingDots() {
  return (
    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0.2s]" />
      <span className="sr-only">asystent pisze…</span>
    </div>
  );
}

// --- Main Component ---
export default function ChatGPTStyle() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: uid(), title: "Nowa rozmowa", messages: defaultWelcome, createdAt: Date.now() },
  ]);
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const active = useMemo(() => conversations.find((c) => c.id === activeId)!, [conversations, activeId]);

  const viewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [active.messages.length, isThinking]);

  // --- Fake assistant response (placeholder) ---
  const reply = async (userText: string) => {
    console.log("User asked:", userText);
    setIsThinking(true);
    // Simulacja strumieniowania odpowiedzi
    const chunks = [
      "Dzięki za wiadomość! ",
      "To jest przykładowa odpowiedź asystenta ",
      "podzielona na kilka fragmentów ",
      "aby zasymulować strumieniowanie."
    ];
  
    const id = uid();
    let partial = "";

    for (const ch of chunks) {
      await new Promise((r) => setTimeout(r, 400));
      partial += ch;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
              ...c,
              messages: [
                ...c.messages.filter((m) => m.id !== id),
                { id, role: "assistant", content: partial, createdAt: Date.now() },
              ],
            }
            : c
        )
      );
    }

    setIsThinking(false);
  };

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: uid(), role: "user", content: input.trim(), createdAt: Date.now() };
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, userMsg] } : c))
    );
    setInput("");
    await reply(userMsg.content);
  };

  const stop = () => setIsThinking(false);

  const regenerate = async () => {
    const lastUser = [...active.messages].reverse().find((m) => m.role === "user");
    if (lastUser) await reply(lastUser.content + " (regeneracja)");
  };

  const newChat = () => {
    const id = uid();
    setConversations((prev) => [
      { id, title: "Nowa rozmowa", messages: defaultWelcome, createdAt: Date.now() },
      ...prev,
    ]);
    setActiveId(id);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-zinc-200 p-3 dark:border-zinc-800 md:flex">
        <div className="flex items-center justify-between gap-2 p-2">
          <button
            onClick={newChat}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" /> Nowy czat
          </button>
          <button className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Ustawienia">
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 flex-1 space-y-1 overflow-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${c.id === activeId
                  ? "bg-zinc-200/70 dark:bg-zinc-800/80"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
            >
              <div className="line-clamp-1 font-medium">{c.title}</div>
              <div className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(c.createdAt || Date.now()).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
        <div className="p-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Wersja demonstracyjna UI
        </div>
      </aside>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar (mobile) */}
        <div className="flex items-center gap-2 border-b border-zinc-200 p-3 dark:border-zinc-800 md:hidden">
          <button className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="font-semibold">Czat</div>
          <div className="ml-auto" />
        </div>

        {/* Chat viewport */}
        <div ref={viewportRef} className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            {active.messages.map((m) => (
              <MessageBubble key={m.id} m={m} />
            ))}

            <AnimatePresence>
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 text-sm text-zinc-500"
                >
                  <Avatar role="assistant" />
                  <TypingDots />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-zinc-200 bg-white p-3 shadow-[0_-1px_0_0_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Napisz wiadomość…"
                  rows={1}
                  className="max-h-40 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-12 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
                <button
                  onClick={send}
                  className="absolute bottom-2 right-2 inline-flex items-center justify-center rounded-xl p-2 transition hover:bg-zinc-100 active:scale-95 disabled:opacity-50 dark:hover:bg-zinc-800"
                  disabled={!input.trim() || isThinking}
                  aria-label="Wyślij"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={stop}
                  disabled={!isThinking}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <StopCircle className="h-4 w-4" /> Stop
                </button>
                <button
                  onClick={regenerate}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <RefreshCw className="h-4 w-4" /> Odśwież
                </button>
              </div>
            </div>

            <div className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Podpowiedź: Shift + Enter = nowa linia • Enter = wyślij
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

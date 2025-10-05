import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, StopCircle, RefreshCw, Settings } from "lucide-react";
import { useParams } from "react-router";
import { useToken } from "../../hooks/useToken";

// --- Types ---
type Role = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt?: number;
};

export type UserNewMessage = {
  message: string,
  containerId: number
}

// --- Helpers ---
const uid = () => Math.random().toString(36).slice(2);


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
export default function ChatUI() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [newMessage, setNewMessage] = useState<UserNewMessage>({
    message: "",
    containerId: parseInt(id ?? "0", 10),
  });
  const token = useToken();

  const viewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, isThinking]);

  const send = async () => {
    if (!newMessage.message.trim()) return;

    setIsThinking(true);
   setMessages(prev => [ ...prev, {
        id: uid(),
        role: "user",
        content: newMessage.message,
        createdAt: Date.now()
      }])
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/chat/send", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newMessage })
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const data = await response.text();
      setMessages(prev => [ ...prev, {
        id: uid(),
        role: "assistant",
        content: data,
        createdAt: Date.now()
      }])

    // wyczyść input
    setNewMessage({ ...newMessage, message: "" });

  } catch (error) {
    console.error("Błąd wysyłania wiadomości:", error);
  } finally {
    setIsThinking(false);
  }
};

const stop = () => setIsThinking(false);

const regenerate = async () => {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  console.log("lastUser: ", lastUser);
  // if (lastUser) await reply(lastUser.content + " (regeneracja)");
};

return (
  <div className="flex min-h-96 w-full flex-col text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
    {/* Top bar */}
    <div className="flex items-center gap-2 p-3 justify-end">
      <button className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Settings">
        <Settings className="h-5 w-5" />
      </button>
    </div>

    {/* Chat viewport */}
    <div ref={viewportRef} className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {messages.map((m) => (
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
              value={newMessage.message}
              onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
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
              disabled={!newMessage.message.trim() || isThinking}
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
  </div>
);
}

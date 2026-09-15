'use client';

import React, { useState, useRef, useEffect } from "react";
import { UIElementNode } from "@/types/section";
import { treeToHtml } from "@/lib/treeUtils";
import { DynamicNodeRenderer } from "./DynamicNodeRenderer";
import {
  Plus,
  Search,
  MessageSquare,
  ChevronLeft,
  ChevronDown,
  Mic,
  Send,
  Settings,
  Star,
  FileText,
  Eye,
  Code2,
  Copy,
  Check,
  Download,
  Sparkles,
  Globe,
} from "lucide-react";

/**
 * Local LLM Chat UI
 * Stack: React + Tailwind + DaisyUI (daisyUI classes used where they map cleanly:
 * btn, input, textarea, dropdown, menu, badge). Everything below is driven by
 * state/props — no hardcoded chat list or suggestions baked into markup.
 */

export interface ChatHistoryItem {
  id: string;
  title: string;
  active?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  layoutTree?: UIElementNode | null;
  layoutType?: string;
  matchedKeyword?: string;
}

const DEFAULT_CHATS: ChatHistoryItem[] = [
  { id: "c1", title: "Untitled Chat", active: true },
];

const DEFAULT_SUGGESTIONS: string[] = [
  "Explain quantum computing in simple terms.",
  "Write a short story about a friendly robot.",
  "Suggest some healthy breakfast ideas.",
  "What's the weather like in Paris?",
];

interface LocalLLMChatProps {
  appName?: string;
  userName?: string;
  chats?: ChatHistoryItem[];
  suggestions?: string[];
}

const LLM_CHATS_KEY = "local_llm_chats_v1";
const LLM_MESSAGES_KEY = "local_llm_messages_v1";
const LLM_THEME_KEY = "local_llm_theme_v1";

export default function LocalLLMChat({
  appName = "Local LLM",
  userName = "User",
  chats = DEFAULT_CHATS,
  suggestions = DEFAULT_SUGGESTIONS,
}: LocalLLMChatProps) {
  const [chatList, setChatList] = useState<ChatHistoryItem[]>(chats);
  const [activeChatId, setActiveChatId] = useState<string | null>(
    chats.find((c) => c.active)?.id ?? chats[0]?.id ?? null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [input, setInput] = useState("");
  const [messagesByChat, setMessagesByChat] = useState<Record<string, ChatMessage[]>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [copiedHtmlId, setCopiedHtmlId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeMessages = activeChatId ? messagesByChat[activeChatId] ?? [] : [];
  const isEmptyState = activeMessages.length === 0;

  const filteredChats = chatList.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem(LLM_CHATS_KEY);
      const savedMessages = localStorage.getItem(LLM_MESSAGES_KEY);
      const savedTheme = localStorage.getItem(LLM_THEME_KEY);

      if (savedChats) {
        const parsed = JSON.parse(savedChats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatList(parsed);
          const activeItem = parsed.find((c: ChatHistoryItem) => c.active);
          setActiveChatId(activeItem ? activeItem.id : parsed[0].id);
        }
      }
      if (savedMessages) {
        setMessagesByChat(JSON.parse(savedMessages));
      }
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }
    } catch (e) {
      console.error("Failed to load chats from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(LLM_CHATS_KEY, JSON.stringify(chatList));
      localStorage.setItem(LLM_MESSAGES_KEY, JSON.stringify(messagesByChat));
      localStorage.setItem(LLM_THEME_KEY, theme);
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [chatList, messagesByChat, theme, isHydrated]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeMessages.length]);

  function handleNewChat() {
    const id = `c${Date.now()}`;
    const newChat: ChatHistoryItem = { id, title: "Untitled Chat", active: true };
    setChatList((prev) => [newChat, ...prev.map((c) => ({ ...c, active: false }))]);
    setActiveChatId(id);
    setInput("");
  }

  function handleSend(text?: string) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || !activeChatId) return;

    const userMsg: ChatMessage = { id: `m${Date.now()}`, role: "user", content: trimmed };
    setMessagesByChat((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? []), userMsg],
    }));

    // Rename "Untitled Chat" to the first message, like most chat apps do
    setChatList((prev) =>
      prev.map((c) =>
        c.id === activeChatId && c.title === "Untitled Chat"
          ? { ...c, title: trimmed.slice(0, 30) }
          : c
      )
    );

    setInput("");

    // Simulated assistant reply with 1.5s delay
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: "assistant",
        content: `You said: "${trimmed}"`,
      };
      setMessagesByChat((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] ?? []), reply],
      }));
    }, 1500);
  }

  const handleCopyHtml = async (msgId: string, node: UIElementNode) => {
    try {
      const html = treeToHtml(node);
      await navigator.clipboard.writeText(html);
      setCopiedHtmlId(msgId);
      setTimeout(() => setCopiedHtmlId(null), 2500);
    } catch (err) {
      console.error("Failed to copy HTML:", err);
    }
  };

  const handleDownloadHtml = (layoutType: string, node: UIElementNode) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${layoutType.toUpperCase()} Section</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 antialiased">
${treeToHtml(node, 1)}
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${layoutType}-section.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isDark = theme === "dark";

  return (
    <div
      data-theme={theme}
      className={`flex h-screen w-full ${isDark ? "bg-neutral-900 text-neutral-100" : "bg-white text-neutral-900"}`}
    >
      {/* Sidebar */}
      <aside
        className={`flex flex-col shrink-0 border-r transition-all duration-200 ${
          isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
        } ${collapsed ? "w-0 overflow-hidden" : "w-[300px]"}`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h1 className="text-xl font-semibold tracking-tight">{appName}</h1>
          <button
            onClick={() => setCollapsed(true)}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="px-4">
          <button
            onClick={handleNewChat}
            className="btn w-full justify-start gap-2 border-none text-white hover:brightness-110"
            style={{ backgroundColor: "#E8823C" }}
          >
            <Plus size={18} />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        <div className="px-4 pt-4">
          <label
            className={`input input-bordered flex items-center gap-2 rounded-xl ${
              isDark ? "bg-neutral-800 border-neutral-700" : "bg-neutral-50"
            }`}
          >
            <Search size={16} className="opacity-50" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="grow bg-transparent outline-none text-sm"
            />
          </label>
        </div>

        <div className="px-5 pt-6 pb-2">
          <span className="text-xs font-semibold tracking-wide opacity-50">
            CHAT HISTORY
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {filteredChats.length === 0 && (
            <p className="px-2 text-sm opacity-50">No chats found.</p>
          )}
          {filteredChats.map((chat) => {
            const active = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-left transition-colors ${
                  active
                    ? isDark
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-orange-50 text-orange-600"
                    : isDark
                    ? "hover:bg-neutral-800"
                    : "hover:bg-neutral-100"
                }`}
              >
                <MessageSquare size={16} className="shrink-0" />
                <span className="truncate">{chat.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main panel */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className={`flex items-center justify-between px-8 py-4 border-b ${
            isDark ? "border-neutral-800" : "border-neutral-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="btn btn-ghost btn-sm btn-circle rotate-180"
                aria-label="Expand sidebar"
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost btn-sm btn-circle" aria-label="Search">
              <Search size={18} />
            </button>
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className={`btn btn-sm gap-2 normal-case rounded-xl ${
                  isDark ? "bg-neutral-800 border-neutral-700" : "bg-neutral-50 border-neutral-200"
                }`}
              >
                {isDark ? "Dark" : "Light"}
                <ChevronDown size={14} />
              </label>
              <ul
                tabIndex={0}
                className={`dropdown-content menu z-10 mt-2 w-32 rounded-xl p-1 shadow-lg ${
                  isDark ? "bg-neutral-800" : "bg-white"
                }`}
              >
                <li>
                  <button onClick={() => setTheme("light")}>Light</button>
                </li>
                <li>
                  <button onClick={() => setTheme("dark")}>Dark</button>
                </li>
              </ul>
            </div>
            <button className="btn btn-ghost btn-sm btn-circle" aria-label="Settings">
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Body */}
        {isEmptyState ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <Star size={40} className="mb-6" style={{ color: "#E8823C" }} strokeWidth={1.5} />
            <h2 className="text-4xl font-bold mb-2">What's up, {userName}?</h2>
            <p className={`mb-8 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
              How can I help you today?
            </p>

            <ChatInputBar
              input={input}
              setInput={setInput}
              onSend={handleSend}
              isDark={isDark}
            />

            <div className="mt-10 w-full max-w-2xl">
              <p className={`text-sm mb-3 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                Try these:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className={`rounded-xl px-4 py-3 text-sm text-left transition-colors ${
                      isDark
                        ? "bg-neutral-800 hover:bg-neutral-700"
                        : "bg-neutral-100 hover:bg-neutral-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {activeMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col gap-3 ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "user"
                        ? "text-white font-medium"
                        : isDark
                        ? "bg-neutral-800 text-neutral-200"
                        : "bg-neutral-100 text-neutral-800"
                    }`}
                    style={m.role === "user" ? { backgroundColor: "#E8823C" } : undefined}
                  >
                    {m.content}
                  </div>

                  {m.layoutTree && (
                    <div className="w-full max-w-5xl space-y-3">
                      {/* Status / View Mode Header */}
                      <div
                        className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl text-xs border ${
                          isDark
                            ? "bg-neutral-800/80 border-neutral-700 text-neutral-300"
                            : "bg-neutral-100/80 border-neutral-200 text-neutral-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#E8823C" }} />
                          <span className="font-bold capitalize">{m.layoutType || "Section"} Layout</span>
                          {m.matchedKeyword && (
                            <span className="text-[11px] opacity-70">
                              (keyword: <code className="text-orange-400 font-mono">{m.matchedKeyword}</code>)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`flex items-center p-0.5 rounded-lg border text-xs ${
                              isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-200"
                            }`}
                          >
                            <button
                              onClick={() => setViewMode("preview")}
                              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                viewMode === "preview"
                                  ? "bg-[#E8823C] text-white shadow-xs"
                                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                              }`}
                              title="Show Preview"
                            >
                              <Eye size={12} />
                              <span>Preview</span>
                            </button>
                            <button
                              onClick={() => setViewMode("code")}
                              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                viewMode === "code"
                                  ? "bg-[#E8823C] text-white shadow-xs"
                                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                              }`}
                              title="Show Code"
                            >
                              <Code2 size={12} />
                              <span>Code</span>
                            </button>
                          </div>

                          <button
                            onClick={() => handleCopyHtml(m.id, m.layoutTree!)}
                            className="px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-all cursor-pointer"
                          >
                            {copiedHtmlId === m.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            <span>{copiedHtmlId === m.id ? "Copied" : "Copy Code"}</span>
                          </button>
                          <button
                            onClick={() => handleDownloadHtml(m.layoutType || "section", m.layoutTree!)}
                            className={`p-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                              isDark
                                ? "bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300"
                                : "bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700"
                            }`}
                          >
                            <Download size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Preview Mode */}
                      {viewMode === "preview" && (
                        <div className="rounded-2xl border overflow-hidden shadow-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 w-full">
                          <div className="px-4 py-2 border-b text-xs font-medium flex items-center justify-between text-neutral-500 border-neutral-200 dark:border-neutral-800">
                            <span>Live Preview</span>
                            <span className="font-mono text-[11px]">uncody.com/preview</span>
                          </div>
                          <div className="p-4 overflow-y-auto max-h-[600px]">
                            <DynamicNodeRenderer node={m.layoutTree} onUpdateText={() => {}} isEditable={false} />
                          </div>
                        </div>
                      )}

                      {/* Code Mode */}
                      {viewMode === "code" && (
                        <div className="rounded-2xl border overflow-hidden shadow-sm bg-neutral-950 border-neutral-800 flex flex-col w-full">
                          <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs font-mono text-neutral-300 flex items-center justify-between">
                            <span>{m.layoutType}-section.html</span>
                            <span className="text-[10px] text-orange-400">HTML5 + Tailwind</span>
                          </div>
                          <div className="p-4 overflow-auto max-h-[600px] font-mono text-xs text-neutral-200">
                            <pre className="whitespace-pre"><code>{treeToHtml(m.layoutTree)}</code></pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <ChatInputBar input={input} setInput={setInput} onSend={handleSend} isDark={isDark} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

interface ChatInputBarProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  onSend: (text?: string) => void;
  isDark: boolean;
  disabled?: boolean;
}

function ChatInputBar({ input, setInput, onSend, isDark, disabled = false }: ChatInputBarProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div
      className={`w-full max-w-2xl flex items-center gap-2 rounded-2xl border px-3 py-2 ${
        isDark ? "bg-neutral-800 border-neutral-700" : "bg-white border-neutral-200 shadow-sm"
      }`}
    >
      <button className="btn btn-ghost btn-circle btn-sm shrink-0" aria-label="Attach file">
        <FileText size={18} />
      </button>
      <textarea
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message (Shift+Enter for new line)"
        disabled={disabled}
        className="grow resize-none bg-transparent outline-none text-sm py-2 max-h-32"
      />
      <button className="btn btn-ghost btn-circle btn-sm shrink-0" aria-label="Voice input">
        <Mic size={18} />
      </button>
      <button
        onClick={() => onSend()}
        disabled={disabled || !input.trim()}
        className="btn btn-circle btn-sm shrink-0 border-none text-white disabled:opacity-40"
        style={{ backgroundColor: "#E8823C" }}
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
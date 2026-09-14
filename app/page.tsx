'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UIElementNode,
  GenerateResponseBody,
  SaveResponseBody,
} from '@/types/section';
import { updateNodeContent, countNodes, treeToHtml } from '@/lib/treeUtils';
import {
  pricingTemplate,
  heroTemplate,
  featuresTemplate,
  ctaTemplate,
} from '@/data/templates';
import { DynamicNodeRenderer } from '@/components/DynamicNodeRenderer';
import { JsonInspectorModal } from '@/components/JsonInspectorModal';
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
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Code2,
  Save,
  Sparkles,
  CheckCircle2,
  Loader2,
  Trash2,
  Globe,
  RotateCcw,
  Eye,
  Copy,
  Check,
  Download,
} from 'lucide-react';

export type ViewMode = 'preview' | 'code';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  layoutTree?: UIElementNode | null;
  layoutType?: string;
  matchedKeyword?: string;
}

interface ChatSession {
  id: string;
  title: string;
  active: boolean;
  messages: ChatMessage[];
  currentLayoutTree: UIElementNode | null;
  history: UIElementNode[];
  future: UIElementNode[];
  saveStatus: 'saved' | 'unsaved' | 'saving';
  lastSavedTime: string | null;
  layoutType: string;
  matchedKeyword: string;
}

const DEFAULT_SUGGESTIONS = [
  { text: 'A pricing section with 3 tiers', type: 'pricing' },
  { text: 'Modern SaaS hero section with CTA buttons and metrics', type: 'hero' },
  { text: 'Feature grid with 4 capability cards', type: 'features' },
  { text: 'High converting CTA banner with guarantee', type: 'cta' },
];

const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'c1',
    title: 'Untitled Chat',
    active: true,
    messages: [],
    currentLayoutTree: null,
    history: [],
    future: [],
    saveStatus: 'saved',
    lastSavedTime: null,
    layoutType: 'pricing',
    matchedKeyword: 'pricing',
  },
  {
    id: 'c2',
    title: 'SaaS Hero Banner',
    active: false,
    messages: [
      {
        id: 'msg-hero-user',
        role: 'user',
        content: 'Modern SaaS hero section with CTA buttons and metrics',
      },
      {
        id: 'msg-hero-ai',
        role: 'assistant',
        content: 'Generated HERO section based on keyword "hero".',
        layoutTree: heroTemplate,
        layoutType: 'hero',
        matchedKeyword: 'hero',
      },
    ],
    currentLayoutTree: heroTemplate,
    history: [],
    future: [],
    saveStatus: 'saved',
    lastSavedTime: null,
    layoutType: 'hero',
    matchedKeyword: 'hero',
  },
  {
    id: 'c3',
    title: 'Features Grid',
    active: false,
    messages: [
      {
        id: 'msg-features-user',
        role: 'user',
        content: 'Feature grid with 4 capability cards',
      },
      {
        id: 'msg-features-ai',
        role: 'assistant',
        content: 'Generated FEATURES section based on keyword "features".',
        layoutTree: featuresTemplate,
        layoutType: 'features',
        matchedKeyword: 'features',
      },
    ],
    currentLayoutTree: featuresTemplate,
    history: [],
    future: [],
    saveStatus: 'saved',
    lastSavedTime: null,
    layoutType: 'features',
    matchedKeyword: 'features',
  },
  {
    id: 'c4',
    title: 'Pricing Tiers',
    active: false,
    messages: [
      {
        id: 'msg-pricing-user',
        role: 'user',
        content: 'A pricing section with 3 tiers and pro highlight',
      },
      {
        id: 'msg-pricing-ai',
        role: 'assistant',
        content: 'Generated PRICING section based on keyword "pricing".',
        layoutTree: pricingTemplate,
        layoutType: 'pricing',
        matchedKeyword: 'pricing',
      },
    ],
    currentLayoutTree: pricingTemplate,
    history: [],
    future: [],
    saveStatus: 'saved',
    lastSavedTime: null,
    layoutType: 'pricing',
    matchedKeyword: 'pricing',
  },
  {
    id: 'c5',
    title: 'Call to Action Banner',
    active: false,
    messages: [
      {
        id: 'msg-cta-user',
        role: 'user',
        content: 'High converting CTA banner with guarantee',
      },
      {
        id: 'msg-cta-ai',
        role: 'assistant',
        content: 'Generated CTA section based on keyword "cta".',
        layoutTree: ctaTemplate,
        layoutType: 'cta',
        matchedKeyword: 'cta',
      },
    ],
    currentLayoutTree: ctaTemplate,
    history: [],
    future: [],
    saveStatus: 'saved',
    lastSavedTime: null,
    layoutType: 'cta',
    matchedKeyword: 'cta',
  },
];

const STORAGE_KEY = 'ai_section_generator_chats_v2';
const ACTIVE_CHAT_KEY = 'ai_section_generator_active_chat_id_v2';
const THEME_KEY = 'ai_section_generator_theme_v2';

export default function Home() {
  const [chatList, setChatList] = useState<ChatSession[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>('c1');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [copiedHtmlId, setCopiedHtmlId] = useState<string | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chatList.find((c) => c.id === activeChatId) || chatList[0];
  const activeMessages = activeChat?.messages ?? [];
  const isEmptyState = activeMessages.length === 0;
  const isDark = theme === 'dark';

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyHtml = async (msgId: string, node: UIElementNode) => {
    try {
      const html = treeToHtml(node);
      await navigator.clipboard.writeText(html);
      setCopiedHtmlId(msgId);
      showToast('HTML code copied to clipboard!', 'success');
      setTimeout(() => setCopiedHtmlId(null), 2500);
    } catch (err) {
      console.error('Failed to copy HTML:', err);
      showToast('Failed to copy HTML', 'error');
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
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${layoutType}-section.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${layoutType}-section.html!`, 'success');
  };

  const filteredChats = chatList.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load chats & active chat from localStorage on initial render
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem(STORAGE_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_CHAT_KEY);
      const savedTheme = localStorage.getItem(THEME_KEY);

      if (savedChats) {
        const parsed = JSON.parse(savedChats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatList(parsed);
          if (savedActiveId && parsed.some((c: ChatSession) => c.id === savedActiveId)) {
            setActiveChatId(savedActiveId);
          } else {
            setActiveChatId(parsed[0].id);
          }
        }
      }
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (err) {
      console.error('Failed to load chats from localStorage:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save chats to localStorage on update
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatList));
    } catch (err) {
      console.error('Failed to save chats to localStorage:', err);
    }
  }, [chatList, isHydrated]);

  // Save active chat ID to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ACTIVE_CHAT_KEY, activeChatId);
    } catch (err) {
      console.error('Failed to save active chat ID to localStorage:', err);
    }
  }, [activeChatId, isHydrated]);

  // Save theme to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      console.error('Failed to save theme to localStorage:', err);
    }
  }, [theme, isHydrated]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [activeMessages.length, isGenerating]);

  // Create a new chat session
  function handleNewChat() {
    const id = `c${Date.now()}`;
    const newChat: ChatSession = {
      id,
      title: 'Untitled Chat',
      active: true,
      messages: [],
      currentLayoutTree: null,
      history: [],
      future: [],
      saveStatus: 'saved',
      lastSavedTime: null,
      layoutType: 'pricing',
      matchedKeyword: 'pricing',
    };
    setChatList((prev) => [newChat, ...prev.map((c) => ({ ...c, active: false }))]);
    setActiveChatId(id);
    setInput('');
  }

  // Delete a chat session
  function handleDeleteChat(e: React.MouseEvent, chatId: string) {
    e.stopPropagation();
    if (chatList.length <= 1) {
      showToast('At least one chat session must remain.', 'info');
      return;
    }
    const remaining = chatList.filter((c) => c.id !== chatId);
    setChatList(remaining);
    if (activeChatId === chatId) {
      setActiveChatId(remaining[0].id);
    }
    showToast('Chat deleted', 'info');
  }

  // Handle generating a section from a prompt
  async function handleSend(text?: string) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isGenerating || !activeChat) return;

    const userMsg: ChatMessage = {
      id: `m-user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    // Update active chat with user message and rename if it was "Untitled Chat"
    setChatList((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          const newTitle =
            chat.title === 'Untitled Chat'
              ? trimmed.length > 28
                ? `${trimmed.slice(0, 28)}...`
                : trimmed
              : chat.title;
          return {
            ...chat,
            title: newTitle,
            messages: [...chat.messages, userMsg],
          };
        }
        return chat;
      })
    );

    setInput('');
    setIsGenerating(true);

    try {
      // 1.8 second delay to show the synthesis/loading animation
      const [res] = await Promise.all([
        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: trimmed }),
        }),
        new Promise((resolve) => setTimeout(resolve, 1800)),
      ]);

      const data: GenerateResponseBody = await res.json();

      if (data.success && data.data) {
        const assistantMsg: ChatMessage = {
          id: `m-ai-${Date.now()}`,
          role: 'assistant',
          content: `Generated ${data.layoutType.toUpperCase()} section based on keyword "${data.matchedKeyword}".`,
          layoutTree: data.data,
          layoutType: data.layoutType,
          matchedKeyword: data.matchedKeyword,
        };

        setChatList((prev) =>
          prev.map((chat) => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                messages: [...chat.messages, assistantMsg],
                currentLayoutTree: data.data,
                layoutType: data.layoutType,
                matchedKeyword: data.matchedKeyword,
                history: [],
                future: [],
                saveStatus: 'saved',
              };
            }
            return chat;
          })
        );
        showToast(
          `Generated ${data.layoutType.toUpperCase()} section!`,
          'success'
        );
      } else {
        showToast(data.message || 'Failed to generate layout', 'error');
      }
    } catch (err) {
      console.error('Generation failed:', err);
      showToast('Error connecting to backend API', 'error');
    } finally {
      setIsGenerating(false);
    }
  }

  // Update text content inline within the active layout tree
  const handleUpdateText = useCallback(
    (id: string, newContent: string) => {
      setChatList((prev) =>
        prev.map((chat) => {
          if (chat.id !== activeChatId || !chat.currentLayoutTree) return chat;

          const updatedTree = updateNodeContent(
            chat.currentLayoutTree,
            id,
            newContent
          );

          // Update message containing the layout tree
          const updatedMessages = chat.messages.map((m) => {
            if (m.role === 'assistant' && m.layoutTree) {
              return { ...m, layoutTree: updatedTree };
            }
            return m;
          });

          return {
            ...chat,
            history: [...chat.history.slice(-20), chat.currentLayoutTree],
            future: [],
            currentLayoutTree: updatedTree,
            messages: updatedMessages,
            saveStatus: 'unsaved',
          };
        })
      );
    },
    [activeChatId]
  );

  // Undo edit
  const handleUndo = () => {
    if (!activeChat || activeChat.history.length === 0 || !activeChat.currentLayoutTree)
      return;

    const previousTree = activeChat.history[activeChat.history.length - 1];
    const newHistory = activeChat.history.slice(0, activeChat.history.length - 1);

    setChatList((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          const updatedMessages = chat.messages.map((m) =>
            m.role === 'assistant' && m.layoutTree
              ? { ...m, layoutTree: previousTree }
              : m
          );
          return {
            ...chat,
            history: newHistory,
            future: [chat.currentLayoutTree!, ...chat.future],
            currentLayoutTree: previousTree,
            messages: updatedMessages,
            saveStatus: 'unsaved',
          };
        }
        return chat;
      })
    );
    showToast('Undone edit', 'info');
  };

  // Redo edit
  const handleRedo = () => {
    if (!activeChat || activeChat.future.length === 0 || !activeChat.currentLayoutTree)
      return;

    const nextTree = activeChat.future[0];
    const newFuture = activeChat.future.slice(1);

    setChatList((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          const updatedMessages = chat.messages.map((m) =>
            m.role === 'assistant' && m.layoutTree ? { ...m, layoutTree: nextTree } : m
          );
          return {
            ...chat,
            history: [...chat.history, chat.currentLayoutTree!],
            future: newFuture,
            currentLayoutTree: nextTree,
            messages: updatedMessages,
            saveStatus: 'unsaved',
          };
        }
        return chat;
      })
    );
    showToast('Redone edit', 'info');
  };

  // Save changes to backend storage
  const handleSave = async () => {
    if (!activeChat?.currentLayoutTree) return;

    setIsSaving(true);
    setChatList((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, saveStatus: 'saving' } : c))
    );

    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layout: activeChat.currentLayoutTree,
          prompt: activeChat.title,
        }),
      });

      const data: SaveResponseBody = await res.json();

      if (data.success) {
        const formattedTime = new Date(data.savedAt).toLocaleTimeString();
        setChatList((prev) =>
          prev.map((c) =>
            c.id === activeChatId
              ? {
                  ...c,
                  saveStatus: 'saved',
                  lastSavedTime: formattedTime,
                }
              : c
          )
        );
        showToast(
          `Saved to backend at ${formattedTime}! (${data.nodeCount} nodes)`,
          'success'
        );
      } else {
        setChatList((prev) =>
          prev.map((c) => (c.id === activeChatId ? { ...c, saveStatus: 'unsaved' } : c))
        );
        showToast(data.message || 'Failed to save section', 'error');
      }
    } catch (err) {
      console.error('Save failed:', err);
      setChatList((prev) =>
        prev.map((c) => (c.id === activeChatId ? { ...c, saveStatus: 'unsaved' } : c))
      );
      showToast('Error saving to backend', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Viewport width styling
  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[390px] mx-auto border-x border-slate-300 dark:border-neutral-700 shadow-2xl';
      case 'tablet':
        return 'max-w-[768px] mx-auto border-x border-slate-300 dark:border-neutral-700 shadow-xl';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  const currentLayoutTree = activeChat?.currentLayoutTree ?? null;
  const totalNodes = currentLayoutTree ? countNodes(currentLayoutTree) : 0;

  return (
    <div
      data-theme={theme}
      className={`flex h-screen w-full overflow-hidden ${
        isDark ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-neutral-900'
      }`}
    >
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/60'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/90 text-rose-100 border-rose-700/60'
                : 'bg-neutral-900 text-white border-neutral-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Sidebar - Collapsible with 300px width */}
      <aside
        className={`flex flex-col shrink-0 border-r transition-all duration-200 select-none ${
          isDark
            ? 'border-neutral-800 bg-neutral-900'
            : 'border-neutral-200 bg-white'
        } ${collapsed ? 'w-0 overflow-hidden border-none' : 'w-[300px]'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: '#E8823C' }}
            >
              <Star className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold tracking-tight truncate">
              Section Gen
            </h1>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="btn btn-ghost btn-sm btn-circle text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-4">
          <button
            onClick={handleNewChat}
            className="btn w-full justify-start gap-2 border-none text-white hover:brightness-110 shadow-xs cursor-pointer"
            style={{ backgroundColor: '#E8823C' }}
          >
            <Plus size={18} />
            <span className="font-semibold text-sm">New Chat</span>
          </button>
        </div>

        {/* Search Chats Input */}
        <div className="px-4 pt-4">
          <label
            className={`input input-bordered flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-200'
                : 'bg-neutral-50 border-neutral-200 text-neutral-800'
            }`}
          >
            <Search size={16} className="opacity-50 shrink-0" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="grow bg-transparent outline-none text-sm min-w-0"
            />
          </label>
        </div>

        {/* Chat History Header */}
        <div className="px-5 pt-6 pb-2 flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider opacity-50 uppercase">
            Chat History
          </span>
          <span className="text-[11px] opacity-40 font-mono">
            {filteredChats.length}
          </span>
        </div>

        {/* Chat History List */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {filteredChats.length === 0 && (
            <p className="px-2 py-4 text-xs opacity-50 text-center">
              No chats found.
            </p>
          )}
          {filteredChats.map((chat) => {
            const active = chat.id === activeChatId;
            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`group w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                  active
                    ? isDark
                      ? 'bg-orange-500/15 text-orange-400 font-medium'
                      : 'bg-orange-50 text-orange-600 font-medium'
                    : isDark
                    ? 'hover:bg-neutral-800 text-neutral-300'
                    : 'hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
                  <MessageSquare size={16} className="shrink-0 opacity-70" />
                  <span className="truncate">{chat.title}</span>
                </div>

                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  title="Delete chat"
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-opacity rounded cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar Header */}
        {/* Top Bar Header - Clean & Minimal */}
        <header
          className={`flex items-center justify-between px-6 py-3.5 border-b shrink-0 ${
            isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
          }`}
        >
          {/* Left: Sidebar Toggle (when collapsed) & App Title */}
          <div className="flex items-center gap-3">
            {collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="btn btn-ghost btn-sm btn-circle rotate-180"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <h1 className="font-semibold text-base tracking-tight">
              AI Section Generator
            </h1>
          </div>

          {/* Right: Light / Dark Theme Dropdown & Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Dropdown */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className={`btn btn-sm gap-2 normal-case rounded-xl font-medium ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-neutral-200'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              >
                {isDark ? 'Dark' : 'Light'}
                <ChevronDown size={14} />
              </button>
              {themeDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-32 rounded-xl p-1.5 shadow-xl border z-30 ${
                    isDark
                      ? 'bg-neutral-800 border-neutral-700 text-neutral-100'
                      : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                >
                  <button
                    onClick={() => {
                      setTheme('light');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'font-bold text-orange-500 bg-orange-50 dark:bg-neutral-700'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'font-bold text-orange-500 bg-orange-50 dark:bg-neutral-700'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              )}
            </div>

            {/* Settings Button */}
            <button
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Body Area */}
        {isEmptyState ? (
          /* Empty State - Exact match to llm.tsx */
          <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto py-10">
            <Star
              size={40}
              className="mb-6 animate-pulse"
              style={{ color: '#E8823C' }}
              strokeWidth={1.5}
            />
            <h2 className="text-4xl font-bold mb-2 tracking-tight text-center">
              What's up, Creator?
            </h2>
            <p
              className={`mb-8 text-center text-sm sm:text-base ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              How can I help you build sections today?
            </p>

            <ChatInputBar
              input={input}
              setInput={setInput}
              onSend={handleSend}
              isDark={isDark}
              disabled={isGenerating}
            />

            <div className="mt-10 w-full max-w-2xl">
              <p
                className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                Try these:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEFAULT_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.text)}
                    className={`rounded-xl px-4 py-3 text-sm text-left transition-all border cursor-pointer flex items-center justify-between gap-3 ${
                      isDark
                        ? 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700/80 hover:border-neutral-600 text-neutral-200'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80 hover:border-neutral-300 text-neutral-800'
                    }`}
                  >
                    <span>{s.text}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0">
                      {s.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation Stream with Live Interactive Section Canvas */
          <div className="flex-1 flex flex-col min-h-0">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6"
            >
              {activeMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {m.role === 'user' ? (
                    /* User Message Bubble */
                    <div
                      className="max-w-[75%] rounded-2xl px-5 py-3 text-sm text-white shadow-sm font-medium"
                      style={{ backgroundColor: '#E8823C' }}
                    >
                      {m.content}
                    </div>
                  ) : (
                    /* Assistant Response with Generated Interactive Section */
                    <div className="w-full max-w-7xl space-y-3">
                      {/* Status / Metadata Badge Bar */}
                      <div
                        className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs border ${
                          isDark
                            ? 'bg-neutral-800/60 border-neutral-700/80 text-neutral-300'
                            : 'bg-neutral-100/70 border-neutral-200 text-neutral-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: '#E8823C' }}
                          />
                          <span className="font-bold capitalize text-neutral-900 dark:text-neutral-100">
                            {m.layoutType || 'Section'} Layout
                          </span>
                          <span className="opacity-40">•</span>
                          <span>
                            keyword:{' '}
                            <code className="font-mono font-bold text-orange-500">
                              {m.matchedKeyword || 'matched'}
                            </code>
                          </span>
                          <span className="hidden md:inline opacity-40">•</span>
                          <span className="hidden md:inline opacity-80 text-[11px]">
                            ✏️ Click any text in Preview to edit inline
                          </span>
                        </div>

                        {/* Switcher & Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Segmented Preview vs Code Tabs */}
                          <div
                            className={`flex items-center p-0.5 rounded-lg border text-xs ${
                              isDark
                                ? 'bg-neutral-900 border-neutral-700'
                                : 'bg-white border-neutral-200'
                            }`}
                          >
                            <button
                              onClick={() => setViewMode('preview')}
                              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                viewMode === 'preview'
                                  ? 'bg-[#E8823C] text-white shadow-xs'
                                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                              }`}
                              title="Show interactive preview"
                            >
                              <Eye size={12} />
                              <span>Preview</span>
                            </button>
                            <button
                              onClick={() => setViewMode('code')}
                              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                viewMode === 'code'
                                  ? 'bg-[#E8823C] text-white shadow-xs'
                                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                              }`}
                              title="Show generated code"
                            >
                              <Code2 size={12} />
                              <span>Code</span>
                            </button>
                          </div>

                          {/* Viewport Switcher (Active in Preview mode) */}
                          {viewMode === 'preview' && (
                            <>
                              <div
                                className={`flex items-center p-0.5 rounded-lg border text-xs ${
                                  isDark
                                    ? 'bg-neutral-900 border-neutral-700'
                                    : 'bg-white border-neutral-200'
                                }`}
                              >
                                <button
                                  onClick={() => setViewport('desktop')}
                                  title="Desktop (Full width)"
                                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    viewport === 'desktop'
                                      ? 'bg-[#E8823C] text-white shadow-xs'
                                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                  }`}
                                >
                                  <Monitor size={12} />
                                  <span className="hidden sm:inline">Desktop</span>
                                </button>
                                <button
                                  onClick={() => setViewport('tablet')}
                                  title="Tablet (768px)"
                                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    viewport === 'tablet'
                                      ? 'bg-[#E8823C] text-white shadow-xs'
                                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                  }`}
                                >
                                  <Tablet size={12} />
                                  <span className="hidden sm:inline">Tablet</span>
                                </button>
                                <button
                                  onClick={() => setViewport('mobile')}
                                  title="Mobile (390px)"
                                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    viewport === 'mobile'
                                      ? 'bg-[#E8823C] text-white shadow-xs'
                                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                  }`}
                                >
                                  <Smartphone size={12} />
                                  <span className="hidden sm:inline">Mobile</span>
                                </button>
                              </div>

                              {/* Undo / Redo */}
                              <div
                                className={`flex items-center p-0.5 rounded-lg border text-xs ${
                                  isDark
                                    ? 'bg-neutral-900 border-neutral-700'
                                    : 'bg-white border-neutral-200'
                                }`}
                              >
                                <button
                                  onClick={handleUndo}
                                  disabled={!activeChat || activeChat.history.length === 0}
                                  title="Undo edit"
                                  className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                                >
                                  <Undo2 size={13} />
                                </button>
                                <button
                                  onClick={handleRedo}
                                  disabled={!activeChat || activeChat.future.length === 0}
                                  title="Redo edit"
                                  className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                                >
                                  <Redo2 size={13} />
                                </button>
                              </div>
                            </>
                          )}

                          <button
                            onClick={() => handleCopyHtml(m.id, m.layoutTree!)}
                            className="px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-all cursor-pointer"
                            title="Copy HTML to clipboard"
                          >
                            {copiedHtmlId === m.id ? (
                              <Check size={12} className="text-emerald-400 dark:text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                            <span>{copiedHtmlId === m.id ? 'Copied!' : 'Copy Code'}</span>
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadHtml(m.layoutType || 'section', m.layoutTree!)
                            }
                            className={`p-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                              isDark
                                ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300'
                                : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                            }`}
                            title="Download HTML file"
                          >
                            <Download size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Preview Mode */}
                      {m.layoutTree && viewMode === 'preview' && (
                        <div className="w-full flex flex-col items-center">
                          {/* Desktop Viewport */}
                          {viewport === 'desktop' && (
                            <div
                              className={`w-full rounded-2xl border shadow-lg overflow-hidden transition-all duration-300 ${
                                isDark
                                  ? 'bg-neutral-900 border-neutral-800'
                                  : 'bg-white border-neutral-200'
                              }`}
                            >
                              <div
                                className={`px-4 py-2.5 border-b flex items-center justify-between text-xs ${
                                  isDark
                                    ? 'bg-neutral-800/80 border-neutral-800 text-neutral-400'
                                    : 'bg-neutral-100/90 border-neutral-200 text-neutral-500'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                  </div>
                                  <span className="font-semibold text-neutral-600 dark:text-neutral-300 text-[11px] ml-1">
                                    Desktop Browser
                                  </span>
                                </div>
                                <div
                                  className={`flex items-center gap-1.5 px-4 py-1 rounded-lg border text-xs font-mono max-w-sm w-full justify-center ${
                                    isDark
                                      ? 'bg-neutral-900 border-neutral-700 text-neutral-300'
                                      : 'bg-white border-neutral-200 text-neutral-600'
                                  }`}
                                >
                                  <Globe size={12} className="opacity-50" />
                                  <span className="truncate">uncody.com/preview/{m.layoutType || 'section'}</span>
                                </div>
                                <div className="text-[11px] text-neutral-400 font-medium">
                                  Full Width
                                </div>
                              </div>
                              <div
                                className={`p-2 sm:p-6 overflow-x-hidden ${
                                  isDark ? 'bg-neutral-950/40' : 'bg-neutral-50/40'
                                }`}
                              >
                                <DynamicNodeRenderer
                                  node={m.layoutTree}
                                  onUpdateText={handleUpdateText}
                                  isEditable={true}
                                />
                              </div>
                            </div>
                          )}

                          {/* Tablet Viewport (768px) */}
                          {viewport === 'tablet' && (
                            <div className="w-full flex justify-center py-2 overflow-x-auto">
                              <div
                                className={`w-[768px] max-w-full rounded-[28px] border-[5px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden transition-all duration-300 viewport-tablet shrink-0 ${
                                  isDark ? 'bg-neutral-900' : 'bg-white'
                                }`}
                              >
                                <div
                                  className={`px-4 py-2 border-b flex items-center justify-between text-xs ${
                                    isDark
                                      ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                                      : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5">
                                    <Tablet size={13} className="text-[#E8823C]" />
                                    <span className="font-semibold text-[11px]">Tablet Preview (768px)</span>
                                  </div>
                                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                                  <span className="font-mono text-[11px] opacity-60">uncody.com/preview</span>
                                </div>
                                <div
                                  className={`p-4 sm:p-6 overflow-y-auto max-h-[750px] overflow-x-hidden ${
                                    isDark ? 'bg-neutral-950/40' : 'bg-neutral-50/40'
                                  }`}
                                >
                                  <DynamicNodeRenderer
                                    node={m.layoutTree}
                                    onUpdateText={handleUpdateText}
                                    isEditable={true}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Mobile Viewport (390px) */}
                          {viewport === 'mobile' && (
                            <div className="w-full flex justify-center py-2 overflow-x-auto">
                              <div
                                className={`w-[390px] max-w-full rounded-[38px] border-[6px] border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden transition-all duration-300 viewport-mobile shrink-0 ${
                                  isDark ? 'bg-neutral-900' : 'bg-white'
                                }`}
                              >
                                {/* Simulated iPhone Dynamic Island Header */}
                                <div className="flex items-center justify-between px-6 pt-3 pb-2 bg-neutral-900 text-neutral-200 text-[11px] font-semibold select-none border-b border-neutral-800">
                                  <span>9:41</span>
                                  <div className="w-20 h-4 bg-neutral-950 rounded-full flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px]">
                                    <span>5G</span>
                                    <div className="w-4 h-2 rounded-xs border border-current p-0.5">
                                      <div className="w-full h-full bg-current rounded-2xs" />
                                    </div>
                                  </div>
                                </div>

                                {/* Inner Mobile Viewport Screen */}
                                <div
                                  className={`p-3 sm:p-4 overflow-y-auto max-h-[640px] overflow-x-hidden ${
                                    isDark ? 'bg-neutral-950/40' : 'bg-neutral-50/40'
                                  }`}
                                >
                                  <DynamicNodeRenderer
                                    node={m.layoutTree}
                                    onUpdateText={handleUpdateText}
                                    isEditable={true}
                                  />
                                </div>

                                {/* Simulated Home Indicator Bar */}
                                <div className="py-2.5 flex justify-center bg-neutral-900 border-t border-neutral-800 select-none">
                                  <div className="w-28 h-1 bg-neutral-600 rounded-full" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Code Mode */}
                      {m.layoutTree && viewMode === 'code' && (
                        <div
                          className={`w-full rounded-2xl border shadow-lg overflow-hidden ${
                            isDark
                              ? 'bg-neutral-950 border-neutral-800'
                              : 'bg-neutral-900 border-neutral-800'
                          }`}
                        >
                          <div className="px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                              </div>
                              <span className="font-mono text-xs text-neutral-200 font-semibold ml-2">
                                {m.layoutType}-section.html
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 text-orange-400 font-mono">
                                HTML5 + Tailwind CSS
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyHtml(m.id, m.layoutTree!)}
                                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                                title="Copy HTML code"
                              >
                                {copiedHtmlId === m.id ? (
                                  <Check size={13} className="text-emerald-400" />
                                ) : (
                                  <Copy size={13} />
                                )}
                                <span>{copiedHtmlId === m.id ? 'Copied' : 'Copy'}</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleDownloadHtml(m.layoutType || 'section', m.layoutTree!)
                                }
                                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                                title="Download HTML file"
                              >
                                <Download size={13} />
                                <span className="hidden sm:inline">Download</span>
                              </button>
                            </div>
                          </div>

                          <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-xs leading-relaxed text-neutral-200 selection:bg-orange-500/30 selection:text-white">
                            <pre className="whitespace-pre">
                              <code>{treeToHtml(m.layoutTree)}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Action Bar Below the Code: Save Option & JSON Tree */}
                      <div
                        className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border mt-2 ${
                          isDark
                            ? 'bg-neutral-800/60 border-neutral-700/80 text-neutral-300'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {/* Left: Save Status */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="flex items-center gap-1.5 font-medium">
                            {isSaving ? (
                              <Loader2 size={13} className="animate-spin text-orange-500" />
                            ) : activeChat?.saveStatus === 'unsaved' ? (
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            ) : (
                              <CheckCircle2 size={13} className="text-emerald-500" />
                            )}
                            <span className="opacity-80">
                              {isSaving
                                ? 'Saving to backend...'
                                : activeChat?.saveStatus === 'unsaved'
                                ? 'Unsaved changes (edited inline)'
                                : activeChat?.lastSavedTime
                                ? `Saved at ${activeChat.lastSavedTime}`
                                : 'All changes saved'}
                            </span>
                          </span>
                        </div>

                        {/* Right: JSON Inspector & Save Button */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsJsonModalOpen(true)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                              isDark
                                ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200'
                                : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                            }`}
                            title="Inspect Nested JSON Tree"
                          >
                            <Code2 size={13} style={{ color: '#E8823C' }} />
                            <span>JSON Tree</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-200 dark:bg-neutral-800 font-mono">
                              {totalNodes}
                            </span>
                          </button>

                          {/* Save Option */}
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer ${
                              activeChat?.saveStatus === 'unsaved'
                                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse shadow-amber-200'
                                : 'bg-[#E8823C] hover:bg-[#d6722d] text-white hover:brightness-110'
                            }`}
                            title="Save section tree to backend"
                          >
                            {isSaving ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                            <span>{isSaving ? 'Saving...' : 'Save Section'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Generating Animation Indicator */}
              {isGenerating && (
                <div className="flex flex-col items-start space-y-2">
                  <div
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${
                      isDark
                        ? 'bg-neutral-800/80 border-neutral-700 text-neutral-200'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    <Sparkles
                      className="w-5 h-5 animate-spin"
                      style={{ color: '#E8823C' }}
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold">Synthesizing UI Tree...</p>
                      <p className="text-[11px] opacity-60">
                        Analyzing prompt and building recursive element hierarchy.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Pinned ChatInputBar */}
            <div
              className={`px-6 pb-6 pt-3 flex justify-center border-t ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900'
                  : 'border-neutral-200/80 bg-white'
              }`}
            >
              <ChatInputBar
                input={input}
                setInput={setInput}
                onSend={handleSend}
                isDark={isDark}
                disabled={isGenerating}
              />
            </div>
          </div>
        )}
      </main>

      {/* JSON Inspector Modal */}
      <JsonInspectorModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        layoutTree={currentLayoutTree}
      />
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

function ChatInputBar({
  input,
  setInput,
  onSend,
  isDark,
  disabled = false,
}: ChatInputBarProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div
      className={`w-full max-w-2xl flex items-center gap-2 rounded-2xl border px-3 py-2 transition-all ${
        isDark
          ? 'bg-neutral-800 border-neutral-700 focus-within:border-neutral-500'
          : 'bg-white border-neutral-200 shadow-sm focus-within:border-neutral-400'
      }`}
    >
      <button
        type="button"
        className="btn btn-ghost btn-circle btn-sm shrink-0 opacity-60 hover:opacity-100"
        aria-label="Attach file"
      >
        <FileText size={18} />
      </button>
      <textarea
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message (Shift+Enter for new line)"
        disabled={disabled}
        className="grow resize-none bg-transparent outline-none text-sm py-2 max-h-32 leading-relaxed"
      />
      <button
        type="button"
        className="btn btn-ghost btn-circle btn-sm shrink-0 opacity-60 hover:opacity-100"
        aria-label="Voice input"
      >
        <Mic size={18} />
      </button>
      <button
        type="button"
        onClick={() => onSend()}
        disabled={disabled || !input.trim()}
        className="btn btn-circle btn-sm shrink-0 border-none text-white disabled:opacity-40 hover:brightness-110 cursor-pointer"
        style={{ backgroundColor: '#E8823C' }}
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </div>
  );
}

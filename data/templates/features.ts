import { UIElementNode } from '@/types/section';

export const featuresTemplate: UIElementNode = {
  id: 'features-section',
  type: 'section',
  tag: 'section',
  className: 'py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-300',
  children: [
    {
      id: 'features-header-container',
      type: 'container',
      tag: 'div',
      className: 'text-center max-w-3xl mx-auto mb-16 space-y-4',
      children: [
        {
          id: 'features-badge',
          type: 'badge',
          tag: 'span',
          content: 'Engineered for Performance',
          className: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 uppercase tracking-wide',
        },
        {
          id: 'features-main-heading',
          type: 'heading',
          tag: 'h2',
          content: 'Everything You Need To Build Faster',
          className: 'text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight',
        },
        {
          id: 'features-sub-heading',
          type: 'paragraph',
          tag: 'p',
          content: 'A powerful full-stack architecture combining mock AI prompt matching, dynamic recursive rendering, and inline editing state management.',
          className: 'text-lg text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto',
        },
      ],
    },
    {
      id: 'features-cards-grid',
      type: 'grid',
      tag: 'div',
      className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
      children: [
        {
          id: 'feat-card-1',
          type: 'card',
          tag: 'div',
          className: 'p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shadow-xs hover:shadow-md hover:border-orange-300 dark:hover:border-neutral-600 transition-all group',
          children: [
            {
              id: 'feat-icon-1',
              type: 'badge',
              tag: 'span',
              content: '⚡',
              className: 'w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform',
            },
            {
              id: 'feat-title-1',
              type: 'heading',
              tag: 'h3',
              content: 'Instant Keyword Matching',
              className: 'text-lg font-bold text-slate-900 dark:text-white mb-2',
            },
            {
              id: 'feat-desc-1',
              type: 'paragraph',
              tag: 'p',
              content: 'Type natural prompts like "pricing with 3 tiers" or "hero section" and receive structured UI responses instantly.',
              className: 'text-sm text-slate-600 dark:text-neutral-300 leading-relaxed',
            },
          ],
        },
        {
          id: 'feat-card-2',
          type: 'card',
          tag: 'div',
          className: 'p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shadow-xs hover:shadow-md hover:border-orange-300 dark:hover:border-neutral-600 transition-all group',
          children: [
            {
              id: 'feat-icon-2',
              type: 'badge',
              tag: 'span',
              content: '🌳',
              className: 'w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform',
            },
            {
              id: 'feat-title-2',
              type: 'heading',
              tag: 'h3',
              content: 'Recursive JSON Tree',
              className: 'text-lg font-bold text-slate-900 dark:text-white mb-2',
            },
            {
              id: 'feat-desc-2',
              type: 'paragraph',
              tag: 'p',
              content: 'Strict separation of concerns: Zero raw HTML strings. Pure nested data structures rendered dynamically into DOM.',
              className: 'text-sm text-slate-600 dark:text-neutral-300 leading-relaxed',
            },
          ],
        },
        {
          id: 'feat-card-3',
          type: 'card',
          tag: 'div',
          className: 'p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shadow-xs hover:shadow-md hover:border-orange-300 dark:hover:border-neutral-600 transition-all group',
          children: [
            {
              id: 'feat-icon-3',
              type: 'badge',
              tag: 'span',
              content: '✏️',
              className: 'w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform',
            },
            {
              id: 'feat-title-3',
              type: 'heading',
              tag: 'h3',
              content: 'Direct Inline Editing',
              className: 'text-lg font-bold text-slate-900 dark:text-white mb-2',
            },
            {
              id: 'feat-desc-3',
              type: 'paragraph',
              tag: 'p',
              content: 'Click anywhere on text to edit immediately. Changes automatically propagate into the internal state tree without flicker.',
              className: 'text-sm text-slate-600 dark:text-neutral-300 leading-relaxed',
            },
          ],
        },
        {
          id: 'feat-card-4',
          type: 'card',
          tag: 'div',
          className: 'p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shadow-xs hover:shadow-md hover:border-orange-300 dark:hover:border-neutral-600 transition-all group',
          children: [
            {
              id: 'feat-icon-4',
              type: 'badge',
              tag: 'span',
              content: '💾',
              className: 'w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform',
            },
            {
              id: 'feat-title-4',
              type: 'heading',
              tag: 'h3',
              content: 'State Persistence',
              className: 'text-lg font-bold text-slate-900 dark:text-white mb-2',
            },
            {
              id: 'feat-desc-4',
              type: 'paragraph',
              tag: 'p',
              content: 'Send your customized layouts directly back to the mock database backend with instant verification and history tracking.',
              className: 'text-sm text-slate-600 dark:text-neutral-300 leading-relaxed',
            },
          ],
        },
      ],
    },
  ],
};

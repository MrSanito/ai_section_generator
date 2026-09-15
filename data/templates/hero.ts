import { UIElementNode } from '@/types/section';

export const heroTemplate: UIElementNode = {
  id: 'hero-section',
  type: 'section',
  tag: 'section',
  className: 'relative overflow-hidden py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center transition-all duration-300',
  children: [
    {
      id: 'hero-badge-container',
      type: 'container',
      tag: 'div',
      className: 'mb-6 sm:mb-8 inline-flex items-center justify-center max-w-full',
      children: [
        {
          id: 'hero-badge',
          type: 'badge',
          tag: 'span',
          content: '✨ Next-Gen AI Section Builder is Live',
          className: 'inline-flex items-center px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 shadow-xs hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors cursor-pointer text-center max-w-full',
        },
      ],
    },
    {
      id: 'hero-heading-container',
      type: 'container',
      tag: 'div',
      className: 'max-w-4xl mx-auto space-y-4 sm:space-y-6',
      children: [
        {
          id: 'hero-title',
          type: 'heading',
          tag: 'h1',
          content: 'Generate Beautiful Website Sections in Milliseconds',
          className: 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance',
        },
        {
          id: 'hero-description',
          type: 'paragraph',
          tag: 'p',
          content: 'Turn raw text prompts into production-grade, recursively-rendered web components. Click any heading or text to edit inline, inspect the JSON tree live, and export directly.',
          className: 'text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed',
        },
      ],
    },
    {
      id: 'hero-cta-group',
      type: 'flex',
      tag: 'div',
      className: 'mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto w-full px-2 sm:px-0',
      children: [
        {
          id: 'hero-primary-btn',
          type: 'button',
          tag: 'button',
          content: 'Start Generating Free 🚀',
          className: 'w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-[#E8823C] hover:bg-[#d9732d] shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 cursor-pointer text-center justify-center',
        },
        {
          id: 'hero-secondary-btn',
          type: 'button',
          tag: 'button',
          content: 'Watch 2-Min Demo 🎬',
          className: 'w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 border border-slate-300 dark:border-neutral-600 shadow-xs transition-all cursor-pointer text-center justify-center',
        },
      ],
    },
    {
      id: 'hero-social-proof',
      type: 'container',
      tag: 'div',
      className: 'mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-200/80 dark:border-neutral-800 max-w-3xl mx-auto w-full',
      children: [
        {
          id: 'hero-proof-title',
          type: 'paragraph',
          tag: 'p',
          content: 'TRUSTED BY OVER 15,000+ CREATORS AND DESIGNERS WORLDWIDE',
          className: 'text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 dark:text-neutral-500 uppercase mb-6 sm:mb-8 px-2',
        },
        {
          id: 'hero-stats-grid',
          type: 'grid',
          tag: 'div',
          className: 'grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center',
          children: [
            {
              id: 'stat-item-1',
              type: 'container',
              tag: 'div',
              className: 'p-3 sm:p-0 rounded-xl bg-slate-50/50 dark:bg-neutral-800/30 sm:bg-transparent sm:dark:bg-transparent space-y-1',
              children: [
                {
                  id: 'stat-num-1',
                  type: 'heading',
                  tag: 'h3',
                  content: '99.9%',
                  className: 'text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white',
                },
                {
                  id: 'stat-label-1',
                  type: 'paragraph',
                  tag: 'p',
                  content: 'Client Satisfaction',
                  className: 'text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium',
                },
              ],
            },
            {
              id: 'stat-item-2',
              type: 'container',
              tag: 'div',
              className: 'p-3 sm:p-0 rounded-xl bg-slate-50/50 dark:bg-neutral-800/30 sm:bg-transparent sm:dark:bg-transparent space-y-1',
              children: [
                {
                  id: 'stat-num-2',
                  type: 'heading',
                  tag: 'h3',
                  content: '< 200ms',
                  className: 'text-2xl sm:text-3xl font-extrabold text-[#E8823C]',
                },
                {
                  id: 'stat-label-2',
                  type: 'paragraph',
                  tag: 'p',
                  content: 'Render Speed',
                  className: 'text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium',
                },
              ],
            },
            {
              id: 'stat-item-3',
              type: 'container',
              tag: 'div',
              className: 'p-3 sm:p-0 rounded-xl bg-slate-50/50 dark:bg-neutral-800/30 sm:bg-transparent sm:dark:bg-transparent space-y-1',
              children: [
                {
                  id: 'stat-num-3',
                  type: 'heading',
                  tag: 'h3',
                  content: '4.9 / 5',
                  className: 'text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white',
                },
                {
                  id: 'stat-label-3',
                  type: 'paragraph',
                  tag: 'p',
                  content: 'ProductHunt Rating',
                  className: 'text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

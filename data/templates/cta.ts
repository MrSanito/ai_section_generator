import { UIElementNode } from '@/types/section';

export const ctaTemplate: UIElementNode = {
  id: 'cta-section',
  type: 'section',
  tag: 'section',
  className: 'py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full transition-all duration-300',
  children: [
    {
      id: 'cta-banner-card',
      type: 'card',
      tag: 'div',
      className: 'relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6 sm:p-12 md:p-16 text-center text-white shadow-2xl border border-orange-500/30',
      children: [
        {
          id: 'cta-badge',
          type: 'badge',
          tag: 'span',
          content: '🚀 Start Building Today',
          className: 'inline-flex items-center px-3 sm:px-4 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-4 sm:mb-6 uppercase tracking-wider max-w-full text-center',
        },
        {
          id: 'cta-title',
          type: 'heading',
          tag: 'h2',
          content: 'Ready to Revolutionize Your Web Workflow?',
          className: 'text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 sm:mb-6 max-w-3xl mx-auto text-balance leading-tight',
        },
        {
          id: 'cta-desc',
          type: 'paragraph',
          tag: 'p',
          content: 'Join thousands of designers, developers, and product builders generating responsive sections with natural language. No credit card required.',
          className: 'text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2',
        },
        {
          id: 'cta-action-row',
          type: 'flex',
          tag: 'div',
          className: 'flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto w-full px-2 sm:px-0',
          children: [
            {
              id: 'cta-main-btn',
              type: 'button',
              tag: 'button',
              content: 'Get Started for Free',
              className: 'w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base bg-[#E8823C] hover:bg-[#d9732d] text-white shadow-lg shadow-orange-500/30 transition-all cursor-pointer text-center justify-center',
            },
            {
              id: 'cta-secondary-btn',
              type: 'button',
              tag: 'button',
              content: 'Talk to Sales',
              className: 'w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer text-center justify-center',
            },
          ],
        },
        {
          id: 'cta-guarantee',
          type: 'paragraph',
          tag: 'p',
          content: 'Free 14-day trial • Cancel anytime • Setup takes under 2 minutes',
          className: 'mt-6 sm:mt-8 text-[11px] sm:text-xs text-neutral-400 font-medium px-2 leading-normal',
        },
      ],
    },
  ],
};

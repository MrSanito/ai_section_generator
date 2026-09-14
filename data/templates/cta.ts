import { UIElementNode } from '@/types/section';

export const ctaTemplate: UIElementNode = {
  id: 'cta-section',
  type: 'section',
  tag: 'section',
  className: 'py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full transition-all duration-300',
  children: [
    {
      id: 'cta-banner-card',
      type: 'card',
      tag: 'div',
      className: 'relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-8 sm:p-16 text-center text-white shadow-2xl border border-orange-500/30',
      children: [
        {
          id: 'cta-badge',
          type: 'badge',
          tag: 'span',
          content: '🚀 Start Building Today',
          className: 'inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-6 uppercase tracking-wider',
        },
        {
          id: 'cta-title',
          type: 'heading',
          tag: 'h2',
          content: 'Ready to Revolutionize Your Web Workflow?',
          className: 'text-3xl sm:text-5xl font-black tracking-tight text-white mb-6 max-w-3xl mx-auto',
        },
        {
          id: 'cta-desc',
          type: 'paragraph',
          tag: 'p',
          content: 'Join thousands of designers, developers, and product builders generating responsive sections with natural language. No credit card required.',
          className: 'text-lg text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed',
        },
        {
          id: 'cta-action-row',
          type: 'flex',
          tag: 'div',
          className: 'flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto',
          children: [
            {
              id: 'cta-main-btn',
              type: 'button',
              tag: 'button',
              content: 'Get Started for Free',
              className: 'w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-[#E8823C] hover:bg-[#d9732d] text-white shadow-lg shadow-orange-500/30 transition-all cursor-pointer',
            },
            {
              id: 'cta-secondary-btn',
              type: 'button',
              tag: 'button',
              content: 'Talk to Sales',
              className: 'w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer',
            },
          ],
        },
        {
          id: 'cta-guarantee',
          type: 'paragraph',
          tag: 'p',
          content: 'Free 14-day trial • Cancel anytime • Setup takes under 2 minutes',
          className: 'mt-8 text-xs text-neutral-400 font-medium',
        },
      ],
    },
  ],
};

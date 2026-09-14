import { UIElementNode } from '@/types/section';

export const pricingTemplate: UIElementNode = {
  id: 'pricing-section',
  type: 'section',
  tag: 'section',
  className: 'py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-300',
  children: [
    {
      id: 'pricing-header-container',
      type: 'container',
      tag: 'div',
      className: 'text-center max-w-3xl mx-auto mb-16 space-y-4',
      children: [
        {
          id: 'pricing-badge',
          type: 'badge',
          tag: 'span',
          content: 'Flexible Pricing Plans',
          className: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 tracking-wide uppercase',
        },
        {
          id: 'pricing-main-heading',
          type: 'heading',
          tag: 'h2',
          content: 'Simple, Transparent Pricing For Everyone',
          className: 'text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight',
        },
        {
          id: 'pricing-sub-heading',
          type: 'paragraph',
          tag: 'p',
          content: 'Start free and scale as you grow. No hidden fees, no credit card required to begin your 14-day trial.',
          className: 'text-lg text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto',
        },
      ],
    },
    {
      id: 'pricing-cards-grid',
      type: 'grid',
      tag: 'div',
      className: 'grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch',
      children: [
        // Card 1: Starter
        {
          id: 'card-starter',
          type: 'card',
          tag: 'div',
          className: 'flex flex-col justify-between p-8 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300 dark:hover:border-neutral-600',
          children: [
            {
              id: 'starter-header-group',
              type: 'container',
              tag: 'div',
              className: 'space-y-4',
              children: [
                {
                  id: 'starter-plan-name',
                  type: 'heading',
                  tag: 'h3',
                  content: 'Starter',
                  className: 'text-xl font-bold text-slate-900 dark:text-white',
                },
                {
                  id: 'starter-plan-desc',
                  type: 'paragraph',
                  tag: 'p',
                  content: 'Ideal for indie creators, side projects, and early stage experiments.',
                  className: 'text-sm text-slate-500 dark:text-neutral-400 min-h-[40px]',
                },
                {
                  id: 'starter-price-container',
                  type: 'flex',
                  tag: 'div',
                  className: 'flex items-baseline gap-1 my-4',
                  children: [
                    {
                      id: 'starter-price',
                      type: 'heading',
                      tag: 'span',
                      content: '$10',
                      className: 'text-4xl font-extrabold text-slate-900 dark:text-white',
                    },
                    {
                      id: 'starter-period',
                      type: 'paragraph',
                      tag: 'span',
                      content: '/month',
                      className: 'text-sm font-medium text-slate-500 dark:text-neutral-400',
                    },
                  ],
                },
                {
                  id: 'starter-features-list',
                  type: 'list',
                  tag: 'ul',
                  className: 'space-y-3 py-4 border-t border-slate-100 dark:border-neutral-700 text-sm text-slate-600 dark:text-neutral-300',
                  children: [
                    {
                      id: 'starter-feat-1',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ 10 Generated Sections / month',
                      className: 'flex items-center gap-2',
                    },
                    {
                      id: 'starter-feat-2',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Standard JSON tree export',
                      className: 'flex items-center gap-2',
                    },
                    {
                      id: 'starter-feat-3',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Unlimited inline text editing',
                      className: 'flex items-center gap-2',
                    },
                    {
                      id: 'starter-feat-4',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Community Discord support',
                      className: 'flex items-center gap-2',
                    },
                  ],
                },
              ],
            },
            {
              id: 'starter-btn-container',
              type: 'container',
              tag: 'div',
              className: 'pt-6',
              children: [
                {
                  id: 'starter-button',
                  type: 'button',
                  tag: 'button',
                  content: 'Choose Starter',
                  className: 'w-full py-3 px-4 rounded-xl font-semibold text-sm border border-slate-300 dark:border-neutral-600 text-slate-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors shadow-xs cursor-pointer text-center',
                },
              ],
            },
          ],
        },

        // Card 2: Pro (Featured)
        {
          id: 'card-pro',
          type: 'card',
          tag: 'div',
          className: 'relative flex flex-col justify-between p-8 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-[#E8823C] shadow-xl shadow-orange-500/10 scale-105 z-10',
          children: [
            {
              id: 'pro-header-group',
              type: 'container',
              tag: 'div',
              className: 'space-y-4',
              children: [
                {
                  id: 'pro-badge-container',
                  type: 'flex',
                  tag: 'div',
                  className: 'flex items-center justify-between',
                  children: [
                    {
                      id: 'pro-plan-name',
                      type: 'heading',
                      tag: 'h3',
                      content: 'Pro',
                      className: 'text-xl font-bold text-slate-900 dark:text-white',
                    },
                    {
                      id: 'pro-popular-badge',
                      type: 'badge',
                      tag: 'span',
                      content: 'Most Popular',
                      className: 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8823C] text-white shadow-xs',
                    },
                  ],
                },
                {
                  id: 'pro-plan-desc',
                  type: 'paragraph',
                  tag: 'p',
                  content: 'Perfect for scaling businesses, design agencies, and fast-moving teams.',
                  className: 'text-sm text-slate-500 dark:text-neutral-400 min-h-[40px]',
                },
                {
                  id: 'pro-price-container',
                  type: 'flex',
                  tag: 'div',
                  className: 'flex items-baseline gap-1 my-4',
                  children: [
                    {
                      id: 'pro-price',
                      type: 'heading',
                      tag: 'span',
                      content: '$29',
                      className: 'text-4xl font-extrabold text-slate-900 dark:text-white',
                    },
                    {
                      id: 'pro-period',
                      type: 'paragraph',
                      tag: 'span',
                      content: '/month',
                      className: 'text-sm font-medium text-slate-500 dark:text-neutral-400',
                    },
                  ],
                },
                {
                  id: 'pro-features-list',
                  type: 'list',
                  tag: 'ul',
                  className: 'space-y-3 py-4 border-t border-slate-100 dark:border-neutral-700 text-sm text-slate-700 dark:text-neutral-200',
                  children: [
                    {
                      id: 'pro-feat-1',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Unlimited section generation',
                      className: 'flex items-center gap-2 font-medium',
                    },
                    {
                      id: 'pro-feat-2',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Full React & Tailwind source code',
                      className: 'flex items-center gap-2 font-medium',
                    },
                    {
                      id: 'pro-feat-3',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Custom theme & font styles',
                      className: 'flex items-center gap-2 font-medium',
                    },
                    {
                      id: 'pro-feat-4',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Priority 24/7 technical support',
                      className: 'flex items-center gap-2 font-medium',
                    },
                    {
                      id: 'pro-feat-5',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Team workspace sharing (up to 5)',
                      className: 'flex items-center gap-2 font-medium',
                    },
                  ],
                },
              ],
            },
            {
              id: 'pro-btn-container',
              type: 'container',
              tag: 'div',
              className: 'pt-6',
              children: [
                {
                  id: 'pro-button',
                  type: 'button',
                  tag: 'button',
                  content: 'Get Started with Pro',
                  className: 'w-full py-3 px-4 rounded-xl font-semibold text-sm bg-[#E8823C] hover:bg-[#d9732d] text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer text-center',
                },
              ],
            },
          ],
        },

        // Card 3: Enterprise
        {
          id: 'card-enterprise',
          type: 'card',
          tag: 'div',
          className: 'flex flex-col justify-between p-8 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300 dark:hover:border-neutral-600',
          children: [
            {
              id: 'enterprise-header-group',
              type: 'container',
              tag: 'div',
              className: 'space-y-4',
              children: [
                {
                  id: 'enterprise-plan-name',
                  type: 'heading',
                  tag: 'h3',
                  content: 'Enterprise',
                  className: 'text-xl font-bold text-slate-900 dark:text-white',
                },
                {
                  id: 'enterprise-plan-desc',
                  type: 'paragraph',
                  tag: 'p',
                  content: 'Dedicated infrastructure, custom security controls, and enterprise SLA.',
                  className: 'text-sm text-slate-500 dark:text-neutral-400 min-h-[40px]',
                },
                {
                  id: 'enterprise-price-container',
                  type: 'flex',
                  tag: 'div',
                  className: 'flex items-baseline gap-1 my-4',
                  children: [
                    {
                      id: 'enterprise-price',
                      type: 'heading',
                      tag: 'span',
                      content: '$50',
                      className: 'text-4xl font-extrabold text-slate-900 dark:text-white',
                    },
                    {
                      id: 'enterprise-period',
                      type: 'paragraph',
                      tag: 'span',
                      content: '/month',
                      className: 'text-sm font-medium text-slate-500 dark:text-neutral-400',
                    },
                  ],
                },
                {
                  id: 'enterprise-features-list',
                  type: 'list',
                  tag: 'ul',
                  className: 'space-y-3 py-4 border-t border-slate-100 dark:border-neutral-700 text-sm text-slate-600 dark:text-neutral-300',
                  children: [
                    {
                      id: 'enterprise-feat-1',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Everything in Pro included',
                      className: 'flex items-center gap-2',
                    },
                    {
                      id: 'enterprise-feat-2',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Custom AI design fine-tuning',
                      className: 'flex items-center gap-2',
                    },
                    {
                      id: 'enterprise-feat-3',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ Dedicated account manager',
                      className: 'flex items-center gap-2',
                    },
                    {
                      id: 'enterprise-feat-4',
                      type: 'list-item',
                      tag: 'li',
                      content: '✓ 99.99% uptime SLA guarantee',
                      className: 'flex items-center gap-2',
                    },
                  ],
                },
              ],
            },
            {
              id: 'enterprise-btn-container',
              type: 'container',
              tag: 'div',
              className: 'pt-6',
              children: [
                {
                  id: 'enterprise-button',
                  type: 'button',
                  tag: 'button',
                  content: 'Contact Enterprise',
                  className: 'w-full py-3 px-4 rounded-xl font-semibold text-sm border border-slate-300 dark:border-neutral-600 text-slate-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors shadow-xs cursor-pointer text-center',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'pricing-footer-note',
      type: 'container',
      tag: 'div',
      className: 'mt-12 text-center',
      children: [
        {
          id: 'pricing-guarantee-text',
          type: 'paragraph',
          tag: 'p',
          content: '🛡️ 30-Day Money Back Guarantee • No contract lock-in • Switch or cancel anytime',
          className: 'text-sm font-medium text-slate-500 dark:text-neutral-400',
        },
      ],
    },
  ],
};

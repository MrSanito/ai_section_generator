import { UIElementNode } from '@/types/section';
import { pricingTemplate } from './pricing';
import { heroTemplate } from './hero';
import { featuresTemplate } from './features';
import { ctaTemplate } from './cta';

export interface LayoutMatchResult {
  layoutType: 'pricing' | 'hero' | 'features' | 'cta';
  matchedKeyword: string;
  template: UIElementNode;
}

/**
 * Inspects the prompt for keywords and selects the appropriate UI JSON template.
 */
export function matchLayoutFromPrompt(prompt: string): LayoutMatchResult {
  const normalized = (prompt || '').toLowerCase().trim();

  // 1. Pricing keywords
  const pricingKeywords = ['pricing', 'price', 'tier', 'plan', 'cost', 'subscription', 'starter', 'pro'];
  for (const kw of pricingKeywords) {
    if (normalized.includes(kw)) {
      return {
        layoutType: 'pricing',
        matchedKeyword: kw,
        template: pricingTemplate,
      };
    }
  }

  // 2. Hero keywords
  const heroKeywords = ['hero', 'header', 'landing', 'banner', 'intro', 'welcome', 'headline'];
  for (const kw of heroKeywords) {
    if (normalized.includes(kw)) {
      return {
        layoutType: 'hero',
        matchedKeyword: kw,
        template: heroTemplate,
      };
    }
  }

  // 3. Features keywords
  const featuresKeywords = ['feature', 'benefit', 'service', 'grid', 'card', 'capability', 'showcase'];
  for (const kw of featuresKeywords) {
    if (normalized.includes(kw)) {
      return {
        layoutType: 'features',
        matchedKeyword: kw,
        template: featuresTemplate,
      };
    }
  }

  // 4. CTA keywords
  const ctaKeywords = ['cta', 'call to action', 'signup', 'newsletter', 'contact', 'join', 'start'];
  for (const kw of ctaKeywords) {
    if (normalized.includes(kw)) {
      return {
        layoutType: 'cta',
        matchedKeyword: kw,
        template: ctaTemplate,
      };
    }
  }

  // Fallback default to Pricing template (matching the prompt assignment default)
  return {
    layoutType: 'pricing',
    matchedKeyword: 'default (pricing)',
    template: pricingTemplate,
  };
}

export { pricingTemplate, heroTemplate, featuresTemplate, ctaTemplate };

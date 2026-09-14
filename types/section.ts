export type UIElementType =
  | 'section'
  | 'container'
  | 'grid'
  | 'flex'
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'badge'
  | 'card'
  | 'list'
  | 'list-item'
  | 'divider'
  | 'icon'
  | 'image'
  | 'link';

export type HTMLTagType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div'
  | 'section'
  | 'button'
  | 'a'
  | 'ul'
  | 'ol'
  | 'li'
  | 'hr';

export interface UIElementNode {
  id: string;
  type: UIElementType;
  tag?: HTMLTagType;
  content?: string;
  className?: string;
  styles?: Record<string, string | number>;
  attributes?: {
    href?: string;
    src?: string;
    alt?: string;
    target?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    highlight?: boolean;
    iconName?: string;
    [key: string]: any;
  };
  children?: UIElementNode[];
}

export interface ChatSectionItem {
  id: string;
  timestamp: string;
  userPrompt: string;
  aiResponse: string;
  layoutType: string;
  matchedKeyword: string;
  layoutTree: UIElementNode;
}

export interface GenerateRequestBody {
  prompt: string;
}

export interface GenerateResponseBody {
  success: boolean;
  layoutType: string;
  matchedKeyword: string;
  data: UIElementNode;
  message?: string;
}

export interface SaveRequestBody {
  layout: UIElementNode | ChatSectionItem[];
  prompt?: string;
}

export interface SaveResponseBody {
  success: boolean;
  message: string;
  savedAt: string;
  nodeCount: number;
}

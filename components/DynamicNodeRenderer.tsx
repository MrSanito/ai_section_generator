'use client';

import React from 'react';
import { UIElementNode, HTMLTagType } from '@/types/section';
import { EditableText } from './EditableText';
import { cn } from '@/lib/utils';

interface DynamicNodeRendererProps {
  node: UIElementNode;
  onUpdateText: (id: string, newContent: string) => void;
  isEditable?: boolean;
}

export const DynamicNodeRenderer: React.FC<DynamicNodeRendererProps> = ({
  node,
  onUpdateText,
  isEditable = true,
}) => {
  if (!node) return null;

  // Determine standard HTML tag based on node.tag or node.type
  const getHtmlTag = (): HTMLTagType => {
    if (node.tag) return node.tag;

    switch (node.type) {
      case 'section':
        return 'section';
      case 'heading':
        return 'h2';
      case 'paragraph':
        return 'p';
      case 'button':
        return 'button';
      case 'badge':
        return 'span';
      case 'list':
        return 'ul';
      case 'list-item':
        return 'li';
      case 'divider':
        return 'hr';
      case 'link':
        return 'a';
      case 'card':
      case 'container':
      case 'grid':
      case 'flex':
      default:
        return 'div';
    }
  };

  const tag = getHtmlTag();
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const hasContent = node.content !== undefined;

  // 1. Leaf editable text nodes (heading, paragraph, badge, list-item without children)
  if (hasContent && !hasChildren) {
    // If it's inside a button, render button wrapper with editable text inside
    if (node.type === 'button') {
      return (
        <button
          type="button"
          id={node.id}
          className={cn(node.className)}
          style={node.styles}
          onClick={(e) => e.preventDefault()}
        >
          <EditableText
            id={node.id}
            initialContent={node.content || ''}
            tag="span"
            className="inline-block"
            isEditable={isEditable}
            onUpdate={onUpdateText}
          />
        </button>
      );
    }

    return (
      <EditableText
        id={node.id}
        initialContent={node.content || ''}
        tag={tag}
        className={node.className}
        isEditable={isEditable}
        onUpdate={onUpdateText}
      />
    );
  }

  // 2. Container / Structured nodes with both content and children or just children
  const commonProps = {
    id: node.id,
    className: node.className,
    style: node.styles,
    ...(node.attributes || {}),
  };

  // Special element handlers
  if (tag === 'hr') {
    return <hr {...commonProps} />;
  }

  // Render container with children recursively
  return React.createElement(
    tag as keyof React.JSX.IntrinsicElements,
    commonProps,
    <>
      {/* If this node has both content and children */}
      {hasContent && (
        <EditableText
          id={`${node.id}-content`}
          initialContent={node.content || ''}
          tag="span"
          isEditable={isEditable}
          onUpdate={(id, newText) => onUpdateText(node.id, newText)}
        />
      )}

      {/* Recursive traversal of children */}
      {node.children?.map((child) => (
        <DynamicNodeRenderer
          key={child.id}
          node={child}
          onUpdateText={onUpdateText}
          isEditable={isEditable}
        />
      ))}
    </>
  );
};

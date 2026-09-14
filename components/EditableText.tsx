'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HTMLTagType } from '@/types/section';

interface EditableTextProps {
  id: string;
  initialContent: string;
  tag?: HTMLTagType;
  className?: string;
  isEditable?: boolean;
  onUpdate: (id: string, newContent: string) => void;
  placeholder?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  initialContent,
  tag = 'span',
  className = '',
  isEditable = true,
  onUpdate,
  placeholder = 'Type here...',
}) => {
  const [content, setContent] = useState(initialContent);
  const [isFocused, setIsFocused] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  // Sync state if initialContent changes externally (e.g. new generation or undo)
  useEffect(() => {
    setContent(initialContent);
    if (elementRef.current && elementRef.current.innerText !== initialContent) {
      elementRef.current.innerText = initialContent;
    }
  }, [initialContent]);

  const handleBlur = () => {
    setIsFocused(false);
    if (elementRef.current) {
      const updatedText = elementRef.current.innerText.trim();
      setContent(updatedText);
      if (updatedText !== initialContent) {
        onUpdate(id, updatedText);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // If it's a heading or button, pressing Enter saves and blurs
    if (e.key === 'Enter' && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'span'].includes(tag)) {
      e.preventDefault();
      elementRef.current?.blur();
    }
    // Escape cancels/blurs
    if (e.key === 'Escape') {
      if (elementRef.current) {
        elementRef.current.innerText = initialContent;
      }
      elementRef.current?.blur();
    }
  };

  const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'li'].includes(tag)
    ? tag
    : 'span') as keyof React.JSX.IntrinsicElements;

  if (!isEditable) {
    return React.createElement(
      Tag,
      { className, id },
      content || placeholder
    );
  }

  return (
    <span className="relative inline-block group/editable">
      {React.createElement(
        Tag,
        {
          ref: elementRef,
          id,
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: handleBlur,
          onFocus: () => setIsFocused(true),
          onKeyDown: handleKeyDown,
          className: cn(
            className,
            'outline-none transition-all duration-150',
            // Interactive visual indicator for editable items
            'cursor-text hover:bg-indigo-50/60 hover:outline-dashed hover:outline-1 hover:outline-indigo-400 rounded px-1 -mx-1',
            isFocused && 'bg-white ring-2 ring-indigo-500 ring-offset-2 outline-none rounded shadow-sm z-20 relative'
          ),
          role: 'textbox',
          'aria-label': `Editable ${tag}`,
        },
        content || placeholder
      )}

      {/* Subtle indicator badge on hover */}
      {!isFocused && (
        <span className="opacity-0 group-hover/editable:opacity-100 transition-opacity absolute -top-5 left-0 pointer-events-none text-[10px] font-medium bg-slate-800 text-white px-1.5 py-0.5 rounded shadow-xs z-30 whitespace-nowrap">
          Click to edit
        </span>
      )}
    </span>
  );
};

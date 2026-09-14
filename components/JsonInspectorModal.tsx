'use client';

import React, { useState } from 'react';
import { UIElementNode } from '@/types/section';
import { countNodes } from '@/lib/treeUtils';
import { Copy, Check, Download, X, Code2 } from 'lucide-react';

interface JsonInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  layoutTree: UIElementNode | null;
}

export const JsonInspectorModal: React.FC<JsonInspectorModalProps> = ({
  isOpen,
  onClose,
  layoutTree,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !layoutTree) return null;

  const jsonString = JSON.stringify(layoutTree, null, 2);
  const totalNodes = countNodes(layoutTree);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `section-tree-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                Live Nested JSON Tree Inspector
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono font-normal">
                  {totalNodes} Total Nodes
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pure nested UI data structure returned by backend and updated in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#E8823C] hover:bg-[#d6722d] text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal JSON Body */}
        <div className="flex-1 overflow-auto p-6 bg-slate-950 font-mono text-xs text-emerald-400/90 leading-relaxed selection:bg-orange-500/30">
          <pre className="whitespace-pre">{jsonString}</pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Root ID: <code className="text-orange-300">{layoutTree.id}</code></span>
          <span>Root Type: <code className="text-amber-300">{layoutTree.type}</code></span>
          <span>HTML Tag: <code className="text-cyan-300">&lt;{layoutTree.tag || 'div'}&gt;</code></span>
        </div>
      </div>
    </div>
  );
};

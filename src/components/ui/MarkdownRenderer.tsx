"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isUser?: boolean;
}

export function MarkdownRenderer({ content, className, isUser = false }: MarkdownRendererProps) {
  return (
    <div className={cn(
      "markdown-container text-[13px] leading-relaxed",
      isUser ? "text-white" : "text-[#121212]",
      className
    )}>
      <ReactMarkdown
        components={{
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-4 mt-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 mt-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-md font-bold mb-2 mt-2" {...props} />,
        h4: ({ node, ...props }) => <h4 className="text-[14px] font-black uppercase tracking-wider mb-2 mt-3" {...props} />,
        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
        ul: ({ node, ...props }) => <ul className="space-y-1.5 mb-3 mt-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1.5 mb-3 mt-1" {...props} />,
        li: ({ node, ...props }) => (
          <li className="flex items-start gap-2 pl-1">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
              isUser ? "bg-white/40" : "bg-[#02022C]/20"
            )} />
            <span className="flex-1 text-inherit">{props.children}</span>
          </li>
        ),
        strong: ({ node, ...props }) => <strong className="font-black text-inherit" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-inherit" {...props} />,
        code: ({ node, ...props }) => (
          <code className="bg-black/5 px-1.5 py-0.5 rounded text-[12px] font-mono" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}

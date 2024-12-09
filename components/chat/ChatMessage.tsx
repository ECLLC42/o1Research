'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import type { Message } from 'ai';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  
  const MessageContent = ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        className="prose prose-invert max-w-none whitespace-pre-wrap"
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-4 whitespace-pre-wrap">{children}</p>,
          h2: ({ children }) => <h2 className="mt-8 mb-4">{children}</h2>,
          blockquote: ({ children }) => <blockquote className="my-4">{children}</blockquote>,
          ul: ({ children }) => <ul className="my-4">{children}</ul>
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div
      className={`flex flex-col gap-4 p-6 text-white ${
        isAssistant ? 'bg-gray-900' : 'bg-transparent'
      }`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {isAssistant ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
          ) : (
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>

        <div className="flex-1 prose prose-invert max-w-none prose-white">
          <MessageContent content={message.content} />
        </div>
      </div>
    </div>
  );
} 
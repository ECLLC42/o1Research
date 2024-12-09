'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatInputProps {
  onSend: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export default function ChatInput({ 
  onSend, 
  input, 
  handleInputChange, 
  disabled 
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="relative flex items-end bg-gray-900 rounded-lg shadow-lg">
        <textarea
          ref={textareaRef}
          name="message"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask a research question..."
          className="flex-1 max-h-32 p-4 pr-12 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none text-gray-200 placeholder-gray-500"
          rows={1}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className={`absolute right-2 bottom-3 p-1.5 rounded-lg 
            ${disabled || !input.trim()
              ? 'bg-gray-800 text-gray-500'
              : 'bg-blue-600 text-white hover:bg-blue-500'
            } transition-colors duration-200`}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
} 
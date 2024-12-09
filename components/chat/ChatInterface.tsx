'use client';

import { useChat } from '@/lib/hooks/useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-4xl mx-auto py-4">
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              Start a conversation...
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <div className="relative p-4">
        {isLoading && (
          <div className="absolute right-8 bottom-20">
            <LoadingSpinner />
          </div>
        )}
        <ChatInput
          onSend={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
'use client';

import { useChat as useVercelChat } from 'ai/react';
import { useState } from 'react';

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);

  const chatHelpers = useVercelChat({
    api: '/api/chat',
    streamProtocol: 'text',
    onFinish: () => {
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    chatHelpers.setMessages([
      ...chatHelpers.messages,
      {
        id: Math.random().toString(),
        role: 'user',
        content: chatHelpers.input,
      }
    ]);
    
    chatHelpers.reload();
    chatHelpers.setInput('');
  };

  return {
    ...chatHelpers,
    handleSubmit,
    isLoading
  };
}
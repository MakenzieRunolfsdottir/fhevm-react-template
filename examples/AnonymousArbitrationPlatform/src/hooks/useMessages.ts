import { useState, useCallback } from 'react';
import { Message, MessageType } from '../types';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const showMessage = useCallback((text: string, type: MessageType) => {
    const id = Date.now().toString() + Math.random().toString(36);
    const message: Message = { id, text, type };

    setMessages((prev) => [...prev, message]);

    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 8000);
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return {
    messages,
    showMessage,
    removeMessage,
  };
};

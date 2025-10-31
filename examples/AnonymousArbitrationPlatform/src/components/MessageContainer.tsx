import React from 'react';
import { Message } from '../types';
import '../styles/MessageContainer.css';

interface MessageContainerProps {
  messages: Message[];
  onRemove: (id: string) => void;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ messages, onRemove }) => {
  return (
    <div className="message-container">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.type}`}
          onClick={() => onRemove(message.id)}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

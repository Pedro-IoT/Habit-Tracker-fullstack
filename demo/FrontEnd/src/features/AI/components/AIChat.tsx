import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Spinner } from '@radix-ui/themes';
import { BsArrowUpCircleFill } from 'react-icons/bs';
import { getAIResponse } from '../api/AIservice';
import styles from './AIChat.module.css';

interface Message {
  id: string | number;
  role: 'user' | 'ai';
  content: string;
}

export default function AIChat() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mutation = useMutation({
    mutationKey: ['getAIResponse'],
    mutationFn: getAIResponse,
    onSuccess: data => {
      const aiMessage: Message = {
        id: data.id,
        role: 'ai',
        content: data.response,
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: () => {
      toast.error('Failed to get AI response, please try again.');

      const errorMessage: Message = {
        id: Date.now(),
        role: 'ai',
        content: 'Sorry, I encountered an error connecting to the server.',
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleSubmit = (e: React.SubmitEvent | React.KeyboardEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || mutation.isPending) return;

    const userText = inputValue.trim();

    setInputValue('');

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: userText,
    };
    setMessages(prev => [...prev, userMessage]);

    mutation.mutate({ prompt: userText });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.aiChatContainer}>
      <div className={styles.aiChatHeader}>
        <h2>Ask the AI for Habit Suggestions</h2>
      </div>

      <div className={styles.chatWindow}>
        {messages.length === 0 && (
          <p className={styles.emptyChat}>
            No messages yet. Ask for a suggestion!
          </p>
        )}

        <ul className={styles.messageList}>
          {messages.map(msg => (
            <li
              key={msg.id}
              className={`${styles.messageItem} ${styles[msg.role]}`}
            >
              <div className={styles.messageContent}>{msg.content}</div>
            </li>
          ))}

          {mutation.isPending && (
            <li className={`${styles.messageItem} ${styles.ai}`}>
              <div className={`${styles.messageContent} ${styles.loading}`}>
                <Spinner size="1" />
                AI is thinking...
              </div>
            </li>
          )}

          <div ref={messagesEndRef} />
        </ul>
      </div>

      <form className={styles.aiChatForm} onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          placeholder="Enter your question or request..."
          className={styles.aiChatInput}
          required
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={mutation.isPending}
          rows={1}
        />
        <button
          type="submit"
          className={styles.aiChatButton}
          disabled={mutation.isPending || !inputValue.trim()}
        >
          <BsArrowUpCircleFill />
        </button>
      </form>
    </div>
  );
}

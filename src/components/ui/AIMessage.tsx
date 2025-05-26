import { FC } from 'react';
import { cn } from '../../lib/utils';

/**
 * @interface AIMessageProps
 * @description Interfejs dla właściwości komponentu AIMessage
 */
interface AIMessageProps {
  /** Treść wiadomości */
  content: string;
  /** Czy wiadomość jest od AI */
  isAI: boolean;
  /** Timestamp wiadomości */
  timestamp: Date;
  /** Opcjonalna klasa CSS */
  className?: string;
}

/**
 * @component AIMessage
 * @description Komponent wyświetlający wiadomość AI z animacją i stylowaniem
 * @test-case AIMessage.test.tsx
 */
export const AIMessage: FC<AIMessageProps> = ({
  content,
  isAI,
  timestamp,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex w-full items-start gap-4 rounded-lg p-4 transition-all',
        isAI ? 'bg-muted/50' : 'bg-primary/10',
        className
      )}
      data-testid="ai-message"
    >
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground">
        {isAI ? '🤖' : '👤'}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          {isAI ? 'AI Assistant' : 'You'}
        </p>
        <p className="text-sm text-muted-foreground">{content}</p>
        <time className="text-xs text-muted-foreground">
          {timestamp.toLocaleTimeString()}
        </time>
      </div>
    </div>
  );
}; 
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * @component ComponentName
 * @description Krótki opis komponentu i jego głównego celu
 * 
 * @test-case
 * ```tsx
 * <ComponentName
 *   title="Test Title"
 *   description="Test Description"
 *   onAction={() => {}}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <ComponentName
 *   title="Example Title"
 *   description="Example Description"
 *   onAction={handleAction}
 * />
 * ```
 */
interface ComponentNameProps {
  /** Tytuł komponentu */
  title: string;
  /** Opis komponentu */
  description: string;
  /** Funkcja wywoływana po akcji */
  onAction: () => void;
  /** Opcjonalne klasy CSS */
  className?: string;
  /** Opcjonalne dzieci komponentu */
  children?: ReactNode;
}

/**
 * @error-boundary
 * ```tsx
 * <ErrorBoundary
 *   fallback={<div>Wystąpił błąd</div>}
 * >
 *   <ComponentName {...props} />
 * </ErrorBoundary>
 * ```
 */
export function ComponentName({
  title,
  description,
  onAction,
  className,
  children,
}: ComponentNameProps) {
  const { theme } = useTheme();

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-destructive">
          Wystąpił błąd w komponencie ComponentName
        </div>
      }
    >
      <Card
        className={cn(
          'p-6 transition-colors duration-200',
          theme === 'dark' ? 'bg-card-dark' : 'bg-card',
          className
        )}
      >
        <div className="space-y-4">
          <h2
            className={cn(
              'text-2xl font-bold',
              theme === 'dark' ? 'text-foreground-dark' : 'text-foreground'
            )}
          >
            {title}
          </h2>
          
          <p
            className={cn(
              'text-muted-foreground',
              theme === 'dark' ? 'text-muted-foreground-dark' : 'text-muted-foreground'
            )}
          >
            {description}
          </p>

          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}

          <Button
            onClick={onAction}
            className="mt-4"
            aria-label={`Wykonaj akcję dla ${title}`}
          >
            Wykonaj akcję
          </Button>
        </div>
      </Card>
    </ErrorBoundary>
  );
}

// Eksport typów dla użycia w innych komponentach
export type { ComponentNameProps }; 
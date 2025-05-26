import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  title: string;
  description: string;
  onRetry?: () => void;
  onBack?: () => void;
}

/**
 * @test-case
 * - Renders error message
 * - Shows retry button
 * - Shows back button
 * - Handles retry action
 */
export function Error({
  title,
  description,
  onRetry,
  onBack,
}: ErrorProps) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>

        <div className="flex justify-end gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Wstecz
            </Button>
          )}
          {onRetry && (
            <Button onClick={onRetry}>
              Spróbuj ponownie
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 
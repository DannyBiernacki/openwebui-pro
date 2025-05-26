import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SuccessProps {
  title: string;
  description: string;
  onContinue?: () => void;
  onBack?: () => void;
}

/**
 * @test-case
 * - Renders success message
 * - Shows continue button
 * - Shows back button
 * - Handles continue action
 */
export function Success({
  title,
  description,
  onContinue,
  onBack,
}: SuccessProps) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4 p-6">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <h3 className="mt-4 text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Wstecz
            </Button>
          )}
          {onContinue && (
            <Button onClick={onContinue}>
              Kontynuuj
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
} 
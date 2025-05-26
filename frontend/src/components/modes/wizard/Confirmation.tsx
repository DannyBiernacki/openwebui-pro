import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ConfirmationProps {
  title: string;
  description: string;
  warning?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

/**
 * @test-case
 * - Renders confirmation message
 * - Shows warning
 * - Handles confirm action
 * - Handles cancel action
 */
export function Confirmation({
  title,
  description,
  warning,
  onConfirm,
  onCancel,
  confirmText = 'Potwierdź',
  cancelText = 'Anuluj',
  variant = 'default',
}: ConfirmationProps) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4 p-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          {warning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Uwaga</AlertTitle>
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
} 
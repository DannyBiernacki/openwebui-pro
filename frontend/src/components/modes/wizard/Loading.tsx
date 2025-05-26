import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LoadingProps {
  title: string;
  description: string;
}

/**
 * @test-case
 * - Renders loading message
 * - Shows spinner
 * - Updates on progress
 */
export function Loading({ title, description }: LoadingProps) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4 p-6">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="mt-4 text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </Card>
    </div>
  );
} 
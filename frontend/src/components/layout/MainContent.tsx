import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAppStore } from '@/lib/stores/app-store';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkspaceView } from '@/components/modes/workspace/WorkspaceView';
import { CanvasView } from '@/components/modes/canvas/CanvasView';
import { WizardView } from '@/components/modes/wizard/WizardView';

/**
 * @test-case
 * - Switches between different modes
 * - Shows loading states
 * - Handles errors gracefully
 * - Maintains responsive layout
 * - Monitors performance
 */
export function MainContent() {
  const { currentMode } = useAppStore();

  const renderContent = () => {
    switch (currentMode) {
      case 'workspace':
        return <WorkspaceView />;
      case 'canvas':
        return <CanvasView />;
      case 'wizard':
        return <WizardView />;
      default:
        return <WorkspaceView />;
    }
  };

  return (
    <main className="flex-1 overflow-hidden">
      <ErrorBoundary
        fallback={
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold">Ups! Coś poszło nie tak</h2>
              <p className="text-muted-foreground">
                Spróbuj odświeżyć stronę lub skontaktuj się z supportem
              </p>
            </div>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="grid h-full gap-4 p-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-64" />
              <Skeleton className="h-32" />
            </div>
          }
        >
          {renderContent()}
        </Suspense>
      </ErrorBoundary>
    </main>
  );
} 
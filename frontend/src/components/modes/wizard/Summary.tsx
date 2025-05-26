import { useWizardStore } from '@/lib/stores/wizard-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X } from 'lucide-react';
import type { Step } from '@/lib/stores/wizard-store';

interface SummaryProps {
  steps: Step[];
  formData: Record<string, any>;
}

/**
 * @test-case
 * - Renders step summary
 * - Shows form data
 * - Handles step navigation
 * - Updates on data change
 */
export function Summary({ steps, formData }: SummaryProps) {
  const { setCurrentStep } = useWizardStore();

  const getStepStatus = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center text-green-500">
            <Check className="mr-2 h-4 w-4" />
            <span>Ukończono</span>
          </div>
        );
      case 'current':
        return (
          <div className="flex items-center text-primary">
            <span>W trakcie</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-muted-foreground">
            <span>Oczekujący</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-500">
            <X className="mr-2 h-4 w-4" />
            <span>Błąd</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepData = (step: Step) => {
    const data = formData[step.id] || {};
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="text-sm">
        <span className="font-medium">{key}:</span>{' '}
        <span className="text-muted-foreground">
          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
        </span>
      </div>
    ));
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Podsumowanie</h3>
          <p className="text-sm text-muted-foreground">
            Sprawdź wprowadzone dane przed zakończeniem
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  {getStepStatus(step.status)}
                </div>

                <div className="mt-4 space-y-2">
                  {getStepData(step)}
                </div>

                <div className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(index)}
                  >
                    Edytuj
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
} 
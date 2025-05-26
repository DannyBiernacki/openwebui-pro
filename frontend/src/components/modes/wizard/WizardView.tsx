import { useState } from 'react';
import { useAppStore } from '@/lib/stores/app-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Step } from './steps/Step';
import { useWizardStore } from '@/lib/stores/wizard-store';

/**
 * @test-case
 * - Renders multi-step navigation
 * - Shows progress indicator
 * - Manages form state
 * - Handles step validation
 * - Tracks completion
 */
export function WizardView() {
  const [currentStep, setCurrentStep] = useState(0);
  const { steps, formState } = useWizardStore();
  const { currentMode } = useAppStore();

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Progress */}
      <div className="border-b p-4">
        <Progress value={progress} className="h-2" />
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>Krok {currentStep + 1} z {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <Card className="mx-auto max-w-2xl">
          <div className="p-6">
            <Step
              step={steps[currentStep]}
              formState={formState}
              onComplete={handleNext}
            />
          </div>
        </Card>
      </div>

      {/* Navigation */}
      <div className="border-t p-4">
        <div className="mx-auto flex max-w-2xl justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
          >
            Wstecz
          </Button>
          <Button
            onClick={handleNext}
            disabled={!steps[currentStep].isValid}
          >
            {isLastStep ? 'Zakończ' : 'Dalej'}
          </Button>
        </div>
      </div>
    </div>
  );
} 
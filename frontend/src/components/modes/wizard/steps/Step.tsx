import { useState } from 'react';
import { useWizardStore } from '@/lib/stores/wizard-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { StepType, StepStatus } from '@/lib/stores/wizard-store';

interface StepProps {
  id: string;
  type: StepType;
  title: string;
  description: string;
  status: StepStatus;
  isActive: boolean;
  isCompleted: boolean;
  data: Record<string, any>;
  validation?: (data: Record<string, any>) => boolean;
}

/**
 * @test-case
 * - Renders step with correct type
 * - Handles form state
 * - Validates input
 * - Shows validation errors
 * - Updates step status
 */
export function Step({
  id,
  type,
  title,
  description,
  status,
  isActive,
  isCompleted,
  data,
  validation,
}: StepProps) {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updateStep, validateStep } = useWizardStore();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (validation) {
      const isValid = validation(formData);
      if (!isValid) {
        setErrors({
          form: 'Proszę wypełnić wszystkie wymagane pola',
        });
        return;
      }
    }

    updateStep(id, {
      data: formData,
      status: 'completed',
    });
  };

  return (
    <Card
      className={cn(
        'p-4 transition-all',
        isActive && 'border-primary',
        isCompleted && 'border-green-500'
      )}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-4">
          {type === 'prompt' && (
            <>
              <div>
                <label className="text-sm font-medium">Prompt</label>
                <Textarea
                  value={formData.prompt || ''}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  placeholder="Wpisz prompt..."
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Model</label>
                <Select
                  value={formData.model || ''}
                  onValueChange={(value) => handleInputChange('model', value)}
                >
                  <option value="">Wybierz model...</option>
                  <option value="ollama">Ollama</option>
                  <option value="openai">OpenAI</option>
                </Select>
              </div>
            </>
          )}

          {type === 'document' && (
            <>
              <div>
                <label className="text-sm font-medium">Nazwa dokumentu</label>
                <Input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Wpisz nazwę dokumentu..."
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Zawartość</label>
                <Textarea
                  value={formData.content || ''}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Wpisz zawartość dokumentu..."
                  className="mt-1"
                />
              </div>
            </>
          )}

          {type === 'settings' && (
            <>
              <div>
                <label className="text-sm font-medium">Temperatura</label>
                <Input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature || 0.7}
                  onChange={(e) =>
                    handleInputChange('temperature', parseFloat(e.target.value))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Maksymalna długość</label>
                <Input
                  type="number"
                  min="1"
                  max="4096"
                  value={formData.maxLength || 2048}
                  onChange={(e) =>
                    handleInputChange('maxLength', parseInt(e.target.value))
                  }
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>

        {errors.form && (
          <div className="text-sm text-red-500">{errors.form}</div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!isActive}>
            {isCompleted ? 'Zaktualizuj' : 'Zapisz'}
          </Button>
        </div>
      </div>
    </Card>
  );
} 
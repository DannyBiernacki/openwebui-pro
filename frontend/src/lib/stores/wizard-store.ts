import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StepType = 'input' | 'select' | 'upload' | 'confirm';
export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'error';

interface Step {
  id: string;
  title: string;
  description: string;
  type: StepType;
  status: StepStatus;
  isValid: boolean;
  validation?: (data: any) => boolean;
  data: Record<string, any>;
}

interface FormState {
  [key: string]: any;
}

interface WizardState {
  // Steps
  steps: Step[];
  addStep: (step: Omit<Step, 'id'>) => void;
  removeStep: (id: string) => void;
  updateStep: (id: string, step: Partial<Step>) => void;
  reorderSteps: (steps: Step[]) => void;

  // Form State
  formState: FormState;
  updateFormState: (key: string, value: any) => void;
  resetFormState: () => void;

  // Progress
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isComplete: boolean;
  setIsComplete: (isComplete: boolean) => void;

  // Validation
  validateStep: (stepId: string) => boolean;
  validateAll: () => boolean;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      // Steps
      steps: [],
      addStep: (step) =>
        set((state) => ({
          steps: [...state.steps, { ...step, id: crypto.randomUUID() }],
        })),
      removeStep: (id) =>
        set((state) => ({
          steps: state.steps.filter((s) => s.id !== id),
        })),
      updateStep: (id, step) =>
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === id ? { ...s, ...step } : s
          ),
        })),
      reorderSteps: (steps) => set({ steps }),

      // Form State
      formState: {},
      updateFormState: (key, value) =>
        set((state) => ({
          formState: { ...state.formState, [key]: value },
        })),
      resetFormState: () => set({ formState: {} }),

      // Progress
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),
      isComplete: false,
      setIsComplete: (isComplete) => set({ isComplete }),

      // Validation
      validateStep: (stepId) => {
        const step = get().steps.find((s) => s.id === stepId);
        if (!step?.validation) return true;
        return step.validation(get().formState);
      },
      validateAll: () => {
        return get().steps.every((step) => {
          if (!step.validation) return true;
          return step.validation(get().formState);
        });
      },
    }),
    {
      name: 'wizard-storage',
    }
  )
); 
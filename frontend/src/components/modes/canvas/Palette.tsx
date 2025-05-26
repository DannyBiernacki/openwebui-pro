import { useCanvasStore } from '@/lib/stores/canvas-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  FileText,
  Cpu,
  BarChart,
  Plus,
} from 'lucide-react';
import type { WidgetType } from '@/lib/stores/canvas-store';

interface WidgetTemplate {
  type: WidgetType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const widgetTemplates: WidgetTemplate[] = [
  {
    type: 'prompt',
    name: 'Prompt',
    description: 'Dodaj prompt do modelu AI',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    type: 'document',
    name: 'Dokument',
    description: 'Dodaj dokument do przetworzenia',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    type: 'model',
    name: 'Model',
    description: 'Wybierz model AI',
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    type: 'result',
    name: 'Wynik',
    description: 'Wyświetl wyniki',
    icon: <BarChart className="h-4 w-4" />,
  },
];

/**
 * @test-case
 * - Renders all widget templates
 * - Handles drag and drop
 * - Shows widget descriptions
 * - Updates on widget add
 */
export function Palette() {
  const { addWidget } = useCanvasStore();

  const handleDragStart = (
    e: React.DragEvent,
    template: WidgetTemplate
  ) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(template));
  };

  const handleAddWidget = (template: WidgetTemplate) => {
    addWidget({
      type: template.type,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
      data: {},
    });
  };

  return (
    <div className="w-64 border-r bg-background">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Widgety</h2>
        <p className="text-sm text-muted-foreground">
          Przeciągnij widget na płótno
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-2 p-4">
          {widgetTemplates.map((template) => (
            <div
              key={template.type}
              className="group relative"
              draggable
              onDragStart={(e) => handleDragStart(e, template)}
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => handleAddWidget(template)}
              >
                {template.icon}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {template.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {template.description}
                  </span>
                </div>
                <Plus className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 
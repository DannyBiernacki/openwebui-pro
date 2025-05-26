import { useRef, useState } from 'react';
import { useCanvasStore } from '@/lib/stores/canvas-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { WidgetType, WidgetPosition } from '@/lib/stores/canvas-store';

interface WidgetProps {
  id: string;
  type: WidgetType;
  position: WidgetPosition;
  size: { width: number; height: number };
  data: Record<string, any>;
  isDragging: boolean;
  connections: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    path: string;
  }>;
}

/**
 * @test-case
 * - Renders widget with correct type
 * - Handles drag and drop
 * - Shows connection points
 * - Updates position
 * - Manages connections
 */
export function Widget({
  id,
  type,
  position,
  size,
  data,
  isDragging,
  connections,
}: WidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);
  const { moveWidget, removeWidget } = useCanvasStore();

  const handleDragStart = (e: React.DragEvent) => {
    setIsDraggingLocal(true);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragEnd = () => {
    setIsDraggingLocal(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId !== id) {
      // Handle connection
    }
  };

  return (
    <Card
      ref={widgetRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'absolute cursor-move select-none',
        isDraggingLocal && 'opacity-50'
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-2">
        <h3 className="text-sm font-semibold">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => removeWidget(id)}
        >
          ×
        </Button>
      </div>

      {/* Content */}
      <div className="p-2">
        {type === 'prompt' && (
          <div className="space-y-2">
            <textarea
              className="w-full rounded border p-2 text-sm"
              placeholder="Wpisz prompt..."
              value={data.prompt || ''}
              onChange={(e) => {
                // Handle prompt change
              }}
            />
          </div>
        )}

        {type === 'document' && (
          <div className="space-y-2">
            <div className="rounded border p-2 text-sm">
              {data.name || 'Wybierz dokument...'}
            </div>
          </div>
        )}

        {type === 'model' && (
          <div className="space-y-2">
            <select
              className="w-full rounded border p-2 text-sm"
              value={data.model || ''}
              onChange={(e) => {
                // Handle model change
              }}
            >
              <option value="">Wybierz model...</option>
              <option value="ollama">Ollama</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>
        )}

        {type === 'result' && (
          <div className="space-y-2">
            <div className="rounded border p-2 text-sm">
              {data.result || 'Brak wyników...'}
            </div>
          </div>
        )}
      </div>

      {/* Connection Points */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-background" />
        <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-background" />
        <div className="absolute top-1/2 -left-2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-background" />
        <div className="absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-background" />
      </div>
    </Card>
  );
} 
import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/stores/app-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Widget } from './widgets/Widget';
import { useCanvasStore } from '@/lib/stores/canvas-store';

/**
 * @test-case
 * - Renders draggable widget system
 * - Manages canvas layout
 * - Handles widget connections
 * - Saves/loads configurations
 * - Supports collaboration
 */
export function CanvasView() {
  const [isDragging, setIsDragging] = useState(false);
  const { widgets, connections } = useCanvasStore();
  const { currentMode } = useAppStore();

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Toolbar */}
      <div className="absolute left-4 top-4 z-10 flex space-x-2">
        <Button variant="outline" size="sm">
          Zapisz
        </Button>
        <Button variant="outline" size="sm">
          Wczytaj
        </Button>
        <Button variant="outline" size="sm">
          Eksportuj
        </Button>
      </div>

      {/* Canvas */}
      <ScrollArea className="h-full w-full">
        <div
          className="relative min-h-full min-w-full p-8"
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Widgets */}
          {widgets.map((widget) => (
            <Widget
              key={widget.id}
              {...widget}
              isDragging={isDragging}
              connections={connections.filter(
                (conn) =>
                  conn.sourceId === widget.id || conn.targetId === widget.id
              )}
            />
          ))}

          {/* Connections */}
          <svg className="absolute inset-0 h-full w-full">
            {connections.map((connection) => (
              <path
                key={connection.id}
                d={connection.path}
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                className="text-muted-foreground"
              />
            ))}
          </svg>
        </div>
      </ScrollArea>

      {/* Widget Palette */}
      <Card className="absolute right-4 top-4 z-10 w-48">
        <div className="p-2">
          <h3 className="mb-2 text-sm font-semibold">Widgety</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              Prompt
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Dokument
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Model
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Wynik
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 
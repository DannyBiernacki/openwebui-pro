import { useRef, useState } from 'react';
import { useCanvasStore } from '@/lib/stores/canvas-store';
import { Widget } from './widgets/Widget';
import { Connection } from './Connection';
import { Toolbar } from './Toolbar';
import { Palette } from './Palette';
import type { WidgetType } from '@/lib/stores/canvas-store';

/**
 * @test-case
 * - Renders canvas with widgets
 * - Handles drag and drop
 * - Shows connections
 * - Updates on zoom/pan
 * - Manages widget positions
 */
export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    widgets,
    connections,
    zoom,
    pan,
    setPan,
    addWidget,
    addConnection,
  } = useCanvasStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const template = JSON.parse(e.dataTransfer.getData('text/plain')) as {
      type: WidgetType;
    };

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    addWidget({
      type: template.type,
      position: { x, y },
      size: { width: 200, height: 150 },
      data: {},
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: pan.x + e.movementX,
        y: pan.y + e.movementY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex h-screen">
      <Palette />
      <div className="flex flex-1 flex-col">
        <Toolbar />
        <div
          ref={canvasRef}
          className="relative flex-1 overflow-hidden bg-muted/20"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: '0 0',
            }}
          >
            {widgets.map((widget) => (
              <Widget
                key={widget.id}
                {...widget}
                isDragging={isDragging}
                connections={connections.filter(
                  (conn) =>
                    conn.sourceId === widget.id ||
                    conn.targetId === widget.id
                )}
              />
            ))}

            {connections.map((connection) => {
              const source = widgets.find((w) => w.id === connection.sourceId);
              const target = widgets.find((w) => w.id === connection.targetId);
              if (!source || !target) return null;

              return (
                <Connection
                  key={connection.id}
                  connection={connection}
                  sourcePosition={{
                    x: source.position.x + source.size.width,
                    y: source.position.y + source.size.height / 2,
                  }}
                  targetPosition={{
                    x: target.position.x,
                    y: target.position.y + target.size.height / 2,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 
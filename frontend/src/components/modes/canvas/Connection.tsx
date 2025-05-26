import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/lib/stores/canvas-store';
import type { Connection } from '@/lib/stores/canvas-store';

interface ConnectionProps {
  connection: Connection;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
}

/**
 * @test-case
 * - Renders connection with correct path
 * - Updates on position change
 * - Handles mouse events
 * - Shows connection status
 */
export function Connection({
  connection,
  sourcePosition,
  targetPosition,
}: ConnectionProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const { removeConnection } = useCanvasStore();

  useEffect(() => {
    if (!pathRef.current) return;

    const path = calculatePath(sourcePosition, targetPosition);
    pathRef.current.setAttribute('d', path);
  }, [sourcePosition, targetPosition]);

  const calculatePath = (
    source: { x: number; y: number },
    target: { x: number; y: number }
  ) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const midX = source.x + dx / 2;

    return `M ${source.x} ${source.y} 
            C ${midX} ${source.y},
              ${midX} ${target.y},
              ${target.x} ${target.y}`;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeConnection(connection.id);
  };

  return (
    <g
      className="cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => {
        if (pathRef.current) {
          pathRef.current.style.strokeWidth = '3';
        }
      }}
      onMouseLeave={() => {
        if (pathRef.current) {
          pathRef.current.style.strokeWidth = '2';
        }
      }}
    >
      <path
        ref={pathRef}
        className="stroke-primary fill-none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={sourcePosition.x}
        cy={sourcePosition.y}
        r={4}
        className="fill-primary"
      />
      <circle
        cx={targetPosition.x}
        cy={targetPosition.y}
        r={4}
        className="fill-primary"
      />
    </g>
  );
} 
import { useCanvasStore } from '@/lib/stores/canvas-store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Save,
  Load,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trash2,
  Share2,
} from 'lucide-react';

/**
 * @test-case
 * - Renders all buttons
 * - Handles zoom actions
 * - Handles save/load
 * - Handles export
 * - Handles reset
 */
export function Toolbar() {
  const {
    zoom,
    setZoom,
    resetCanvas,
    saveCanvas,
    loadCanvas,
    exportCanvas,
    clearCanvas,
  } = useCanvasStore();

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };

  const handleReset = () => {
    resetCanvas();
  };

  const handleSave = () => {
    saveCanvas();
  };

  const handleLoad = () => {
    loadCanvas();
  };

  const handleExport = () => {
    exportCanvas();
  };

  const handleClear = () => {
    clearCanvas();
  };

  return (
    <div className="flex items-center gap-2 border-b p-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          title="Przybliż"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          title="Oddal"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <Separator orientation="vertical" className="mx-2 h-6" />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          title="Zapisz"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLoad}
          title="Wczytaj"
        >
          <Load className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExport}
          title="Eksportuj"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-2 h-6" />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          title="Resetuj"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          title="Wyczyść"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {}}
          title="Udostępnij"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 
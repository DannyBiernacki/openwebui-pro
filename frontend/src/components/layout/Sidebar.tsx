import { useState } from 'react';
import { useAppStore } from '@/lib/stores/app-store';
import { useAIStore } from '@/lib/stores/ai-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * @test-case
 * - Collapses/expands sidebar
 * - Shows project navigation with search
 * - Displays document list with upload status
 * - Shows data sources section
 * - Displays AI model status cards
 * - Shows quick actions
 */
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { documents, dataSources } = useAppStore();
  const { modelMetrics } = useAIStore();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <aside
      className={cn(
        'border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="self-end"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </Button>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4">
            <Input
              placeholder="Szukaj..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Project navigation */}
        <ScrollArea className="flex-1">
          <nav className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">Projekty</h3>
            {/* Project list */}
          </nav>

          {/* Document list */}
          <div className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">Dokumenty</h3>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <span className="truncate">{doc.name}</span>
                <Badge variant={doc.status === 'uploaded' ? 'success' : 'warning'}>
                  {doc.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Data sources */}
          <div className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">Źródła danych</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                PDF
              </Button>
              <Button variant="outline" size="sm">
                YouTube
              </Button>
              <Button variant="outline" size="sm">
                Web
              </Button>
            </div>
          </div>

          {/* AI model status */}
          <div className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">Status AI</h3>
            <Card className="p-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Ollama</span>
                  <Badge variant="success">Online</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {modelMetrics.ollama?.responseTime}ms
                </div>
              </div>
            </Card>
            <Card className="p-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>OpenAI</span>
                  <Badge variant="success">Online</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {modelMetrics.openai?.responseTime}ms
                </div>
              </div>
            </Card>
          </div>

          {/* Quick actions */}
          <div className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">Szybkie akcje</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm">
                Nowy projekt
              </Button>
              <Button variant="secondary" size="sm">
                Import
              </Button>
              <Button variant="secondary" size="sm">
                Eksport
              </Button>
              <Button variant="secondary" size="sm">
                Ustawienia
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
} 
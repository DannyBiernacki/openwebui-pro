import { useState } from 'react';
import { useAppStore } from '@/lib/stores/app-store';
import { useAIStore } from '@/lib/stores/ai-store';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentPanel } from './panels/DocumentPanel';
import { PromptBuilder } from './panels/PromptBuilder';
import { PipelineCanvas } from './panels/PipelineCanvas';
import { ResultsPanel } from './panels/ResultsPanel';

/**
 * @test-case
 * - Renders 4-panel layout
 * - Handles document uploads
 * - Manages prompt building
 * - Shows pipeline canvas
 * - Displays AI results
 */
export function WorkspaceView() {
  const [activeTab, setActiveTab] = useState('documents');
  const { documents } = useAppStore();
  const { responseHistory } = useAIStore();

  return (
    <div className="grid h-full grid-cols-2 gap-4 p-4">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Document Panel */}
        <Card className="h-[calc(50%-0.5rem)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="documents" className="flex-1">
                Dokumenty
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex-1">
                Szablony
              </TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="h-[calc(100%-2.5rem)]">
              <DocumentPanel documents={documents} />
            </TabsContent>
            <TabsContent value="templates" className="h-[calc(100%-2.5rem)]">
              {/* Template list */}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Prompt Builder */}
        <Card className="h-[calc(50%-0.5rem)]">
          <PromptBuilder />
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Pipeline Canvas */}
        <Card className="h-[calc(50%-0.5rem)]">
          <PipelineCanvas />
        </Card>

        {/* Results Panel */}
        <Card className="h-[calc(50%-0.5rem)]">
          <ResultsPanel history={responseHistory} />
        </Card>
      </div>
    </div>
  );
} 
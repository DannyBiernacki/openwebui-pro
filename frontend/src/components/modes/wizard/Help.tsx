import { HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface HelpItem {
  title: string;
  content: string;
}

interface HelpProps {
  title: string;
  description: string;
  items: HelpItem[];
  onClose: () => void;
}

/**
 * @test-case
 * - Renders help content
 * - Shows accordion items
 * - Handles close action
 * - Updates on content change
 */
export function Help({
  title,
  description,
  items,
  onClose,
}: HelpProps) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-2xl space-y-4 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ×
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm max-w-none">
                    {item.content}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </Card>
    </div>
  );
} 
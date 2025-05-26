import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { 
  CheckCircle, 
  Copy, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface ProcessingStage {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
}

interface StreamingResponseCardProps {
  response: string;
  isStreaming: boolean;
  processingStages: ProcessingStage[];
  estimatedTimeRemaining?: number;
  qualityScore?: number;
  onRegenerate?: () => void;
  onImprove?: () => void;
  onRate?: (rating: 'positive' | 'negative') => void;
  className?: string;
}

export const StreamingResponseCard: React.FC<StreamingResponseCardProps> = ({
  response,
  isStreaming,
  processingStages,
  estimatedTimeRemaining,
  qualityScore,
  onRegenerate,
  onImprove,
  onRate,
  className
}) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [displayedText, setDisplayedText] = useState('');
  const [typewriterSpeed] = useState(30); // ms per character
  const [copied, setCopied] = useState(false);
  const [codeBlocks, setCodeBlocks] = useState<{ language: string; code: string }[]>([]);

  // Typewriter effect
  useEffect(() => {
    if (!isStreaming) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < response.length) {
        setDisplayedText(prev => prev + response[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, typewriterSpeed);

    return () => clearInterval(interval);
  }, [response, isStreaming, typewriterSpeed]);

  // Extract code blocks
  useEffect(() => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: { language: string; code: string }[] = [];
    let match;

    while ((match = codeBlockRegex.exec(response)) !== null) {
      blocks.push({
        language: match[1] || 'plaintext',
        code: match[2].trim()
      });
    }

    setCodeBlocks(blocks);
  }, [response]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: 'Skopiowano!',
        description: 'Tekst został skopiowany do schowka.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Błąd!',
        description: 'Nie udało się skopiować tekstu.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const renderProcessingStages = () => (
    <div className="space-y-2">
      {processingStages.map((stage, index) => (
        <motion.div
          key={stage.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-2"
        >
          <Badge
            variant={
              stage.status === 'completed' ? 'success' :
              stage.status === 'error' ? 'destructive' :
              stage.status === 'processing' ? 'default' : 'secondary'
            }
          >
            {stage.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> :
             stage.status === 'error' ? <AlertCircle className="w-3 h-3 mr-1" /> :
             stage.status === 'processing' ? <Clock className="w-3 h-3 mr-1" /> :
             <Clock className="w-3 h-3 mr-1" />}
            {stage.name}
          </Badge>
          {stage.progress !== undefined && (
            <Progress value={stage.progress} className="w-24" />
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm p-4',
        className
      )}
    >
      {/* Processing Stages */}
      <div className="mb-4">
        {renderProcessingStages()}
      </div>

      {/* Response Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {displayedText.split('```').map((part, index) => {
          if (index % 2 === 1) {
            const [language, ...codeParts] = part.split('\n');
            const code = codeParts.join('\n');
            return (
              <div key={index} className="relative group">
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  className="rounded-md"
                >
                  {code}
                </SyntaxHighlighter>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(code)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            );
          }
          return <p key={index}>{part}</p>;
        })}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Tooltip content="Kopiuj odpowiedź">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(response)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Kopiuj
            </Button>
          </Tooltip>
          {onRegenerate && (
            <Tooltip content="Wygeneruj ponownie">
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Ponów
              </Button>
            </Tooltip>
          )}
          {onImprove && (
            <Tooltip content="Popraw odpowiedź">
              <Button
                variant="ghost"
                size="sm"
                onClick={onImprove}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Popraw
              </Button>
            </Tooltip>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {qualityScore !== undefined && (
            <Badge variant="outline" className="flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              {qualityScore}%
            </Badge>
          )}
          {estimatedTimeRemaining && (
            <Badge variant="outline" className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {Math.ceil(estimatedTimeRemaining / 1000)}s
            </Badge>
          )}
          {onRate && (
            <div className="flex items-center space-x-1">
              <Tooltip content="Oceń pozytywnie">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRate('positive')}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Oceń negatywnie">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRate('negative')}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 
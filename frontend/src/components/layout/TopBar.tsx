import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/stores/app-store';
import { useAIStore } from '@/lib/stores/ai-store';
import { cn } from '@/lib/utils';

/**
 * @test-case
 * - Renders logo with gradient animation
 * - Switches between dark/light theme
 * - Shows AI model health status
 * - Displays user avatar and menu
 * - Updates status in real-time
 */
export function TopBar() {
  const { theme, setTheme } = useTheme();
  const { user } = useAppStore();
  const { ollamaStatus, openAIStatus } = useAIStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo z gradient animation */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent animate-gradient">
            OpenWebUI Pro
          </h1>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            Workspace
          </Button>
          <Button variant="ghost" size="sm">
            Canvas
          </Button>
          <Button variant="ghost" size="sm">
            Wizard
          </Button>
        </div>

        {/* AI model health indicators */}
        <div className="flex items-center space-x-4">
          <Badge
            variant={ollamaStatus === 'healthy' ? 'success' : 'destructive'}
            className="flex items-center space-x-1"
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            <span>Ollama</span>
          </Badge>
          <Badge
            variant={openAIStatus === 'healthy' ? 'success' : 'destructive'}
            className="flex items-center space-x-1"
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            <span>OpenAI</span>
          </Badge>
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </Button>

        {/* User avatar menu */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {currentTime.toLocaleTimeString()}
          </span>
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
} 
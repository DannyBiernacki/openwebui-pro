# Component Development Guidelines

## Component Creation Process
1. **Research Phase**
   - Check shadcn/ui documentation
   - Identify existing components
   - Plan composition strategy

2. **Implementation Phase**
   - Import shadcn/ui base
   - Extend with TypeScript interface
   - Apply design tokens
   - Add accessibility features

3. **Quality Phase**
   - Write tests
   - Document usage
   - Add to Storybook
   - Code review

## Professional Examples

### AI Streaming Component
```typescript
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp } from "lucide-react"

interface StreamingResponseProps {
  content: string
  isStreaming: boolean
  model: string
  onCopy: () => void
  onLike: () => void
}

export const StreamingResponse = ({
  content,
  isStreaming,
  model,
  onCopy,
  onLike
}: StreamingResponseProps) => (
  <Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center space-x-2">
        <Badge variant={isStreaming ? "default" : "secondary"}>
          {model}
        </Badge>
        {isStreaming && (
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        )}
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onLike}>
          <ThumbsUp className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="prose dark:prose-invert max-w-none">
        {content}
      </div>
    </CardContent>
  </Card>
)
```

## Common Patterns
- **Loading States**: Use shadcn/ui Skeleton
- **Form Controls**: Use shadcn/ui Input, Select, Textarea
- **Layouts**: Use shadcn/ui Card, Sheet, Dialog
- **Navigation**: Use shadcn/ui Tabs, Breadcrumb
- **Feedback**: Use shadcn/ui Toast, Alert 
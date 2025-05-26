# shadcn/ui - Component Library Documentation

## Version: Latest (2025)
## Installation: Copy-paste approach

## Overview
shadcn/ui is our primary component library, providing enterprise-grade components used by OpenAI, Vercel, and other industry leaders.

## Key Features
- **Accessibility First**: Built on Radix UI primitives
- **Full Code Ownership**: Components copied to your project
- **TypeScript Native**: Complete type safety
- **Themeable**: CSS Variables for dark/light mode

## Installation Commands
```bash
# Core UI components
npx shadcn-ui@latest add button card dialog input textarea
npx shadcn-ui@latest add dropdown-menu select tabs badge
npx shadcn-ui@latest add sheet tooltip popover table
npx shadcn-ui@latest add accordion alert-dialog command
npx shadcn-ui@latest add navigation-menu scroll-area toggle
npx shadcn-ui@latest add progress separator slider
npx shadcn-ui@latest add avatar calendar checkbox
```

## Usage Examples
### Basic Button
```typescript
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">
  Click me
</Button>
```

### Custom AI Button
```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AIButtonProps extends React.ComponentProps<typeof Button> {
  isProcessing?: boolean
}

export const AIButton = ({ isProcessing, className, ...props }: AIButtonProps) => (
  <Button 
    className={cn(
      isProcessing && "opacity-70 cursor-wait",
      className
    )}
    disabled={isProcessing}
    {...props}
  />
)
```

## Links
- Documentation: https://ui.shadcn.com/docs
- Components: https://ui.shadcn.com/docs/components
- GitHub: https://github.com/shadcn-ui/ui 
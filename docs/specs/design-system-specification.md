# Design System Specification - OpenWebUI Pro 2025

## Industry Standards Compliance
- **Base**: shadcn/ui (used by OpenAI, Vercel, GitHub)
- **Foundation**: Radix UI + Tailwind CSS
- **Typography**: Inter (UI) + JetBrains Mono (code)
- **Theming**: CSS Variables with dark/light mode

## Component Library Structure
```
src/components/
├── ui/                    # shadcn/ui components (auto-generated)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── ai/                    # AI-specific components (extend shadcn/ui)
│   ├── streaming-card.tsx
│   ├── model-badge.tsx
│   └── voice-input.tsx
├── layout/                # Layout components (use shadcn/ui)
│   ├── top-bar.tsx
│   ├── sidebar.tsx
│   └── main-content.tsx
└── modes/                 # UI mode components
    ├── workspace/
    ├── canvas/
    └── wizard/
```

## Design Token System
### Colors (CSS Variables)
```css
:root {
  /* Base Colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  
  /* AI-Specific */
  --ai-primary: 199 89% 48%;
  --ai-processing: 38 92% 50%;
  --ai-success: 142 76% 36%;
  --ai-error: 0 84% 60%;
}
```

### Typography Scale
```typescript
export const typography = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
}
```

## Component Creation Standards
### ✅ DO (Professional)
```typescript
// Extend shadcn/ui with composition
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AIStatusButtonProps extends React.ComponentProps<typeof Button> {
  modelStatus: 'ready' | 'processing' | 'error'
}

export const AIStatusButton = ({ modelStatus, className, children, ...props }: AIStatusButtonProps) => (
  <Button 
    className={cn(
      "relative",
      modelStatus === 'processing' && "animate-pulse",
      className
    )}
    {...props}
  >
    <Badge variant={modelStatus === 'ready' ? 'default' : 'secondary'} className="mr-2">
      {modelStatus}
    </Badge>
    {children}
  </Button>
)
```

### ❌ DON'T (Amateur)
```typescript
// Never create custom components from scratch
const CustomButton = ({ status }) => (
  <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white">
    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
      status === 'ready' ? 'bg-green-400' : 'bg-yellow-400'
    }`} />
    Custom Button
  </button>
)
```

## Quality Checklist
Before any component PR:
- [ ] Uses shadcn/ui base component
- [ ] Applies design tokens only
- [ ] Has TypeScript interface
- [ ] Includes accessibility features
- [ ] Works in dark/light mode
- [ ] Responsive design
- [ ] @test-case annotation 
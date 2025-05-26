# OpenWebUI Pro - Konfiguracja Środowiska M4 Pro

## Wymagania Systemowe

### Sprzęt
- MacBook Pro z procesorem M4 Pro
- 48GB RAM
- 14 rdzeni (10 wydajnościowych + 4 energooszczędne)
- SSD NVMe

### System Operacyjny
- macOS 14.5 lub nowszy
- ARM64 (Apple Silicon)

## Instalacja Podstawowych Narzędzi

### Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Node.js i pnpm
```bash
brew install node@20
brew install pnpm
```

### Git
```bash
brew install git
```

## Konfiguracja Środowiska

### Zmienne Środowiskowe
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/openwebui
OLLAMA_API_URL=http://localhost:11434
OPENAI_API_KEY=your-api-key
```

### Optymalizacje M4 Pro

#### Node.js
```bash
# ~/.zshrc
export NODE_OPTIONS="--max-old-space-size=12288" # 12GB dla Node.js
export NODE_ENV=development
```

#### Docker
```bash
# ~/.docker/config.json
{
  "builder": {
    "gc": {
      "enabled": true,
      "defaultKeepStorage": "20GB"
    }
  },
  "experimental": true,
  "features": {
    "buildkit": true
  }
}
```

## Instalacja Projektu

### Klonowanie Repozytorium
```bash
git clone https://github.com/your-org/openwebui-pro.git
cd openwebui-pro
```

### Instalacja Zależności
```bash
pnpm install
```

### Konfiguracja Bazy Danych
```bash
# Instalacja PostgreSQL
brew install postgresql@15

# Uruchomienie PostgreSQL
brew services start postgresql@15

# Utworzenie bazy danych
createdb openwebui
```

### Konfiguracja Ollama
```bash
# Instalacja Ollama
brew install ollama

# Uruchomienie Ollama
ollama serve

# Pobranie modeli
ollama pull llama2:70b
ollama pull mistral:7b
```

## Optymalizacje Wydajności

### Next.js
```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons'],
    turbo: {
      rules: {
        '*.{ts,tsx}': ['eslint'],
        '*.{css,scss}': ['stylelint']
      }
    }
  },
  webpack: (config, { dev, isServer }) => {
    // Optymalizacje dla M4 Pro
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000
      }
    }
    return config
  }
}
```

### TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind CSS
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
```

## Skrypty Uruchomieniowe

### Development
```bash
# Uruchomienie w trybie deweloperskim
pnpm dev

# Uruchomienie testów
pnpm test

# Uruchomienie lintera
pnpm lint

# Uruchomienie type-checkera
pnpm type-check
```

### Production
```bash
# Budowanie aplikacji
pnpm build

# Uruchomienie w trybie produkcyjnym
pnpm start
```

## Monitorowanie i Debugowanie

### Narzędzia
- Chrome DevTools
- React Developer Tools
- Redux DevTools
- Network Inspector

### Metryki Wydajności
- Lighthouse
- Web Vitals
- Performance Monitor

## Rozwiązywanie Problemów

### Typowe Problemy

#### Wysokie Zużycie CPU
```bash
# Sprawdzenie procesów
top -o cpu

# Optymalizacja Node.js
export NODE_OPTIONS="--max-old-space-size=12288"
```

#### Problemy z Bazą Danych
```bash
# Sprawdzenie statusu PostgreSQL
brew services list

# Restart PostgreSQL
brew services restart postgresql@15
```

#### Problemy z Ollama
```bash
# Sprawdzenie statusu Ollama
ollama list

# Restart Ollama
brew services restart ollama
```

## Aktualizacje

### System
```bash
# Aktualizacja Homebrew
brew update && brew upgrade

# Aktualizacja Node.js
brew upgrade node@20
```

### Projekt
```bash
# Aktualizacja zależności
pnpm update

# Aktualizacja Ollama
ollama pull --latest
```

## Bezpieczeństwo

### SSL/TLS
```bash
# Generowanie certyfikatu lokalnego
mkcert -install
mkcert localhost
```

### Firewall
```bash
# Konfiguracja firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw
```

## Backup

### Baza Danych
```bash
# Backup PostgreSQL
pg_dump openwebui > backup.sql

# Restore PostgreSQL
psql openwebui < backup.sql
```

### Konfiguracja
```bash
# Backup zmiennych środowiskowych
cp .env.local .env.local.backup

# Backup konfiguracji
cp next.config.js next.config.js.backup
``` 
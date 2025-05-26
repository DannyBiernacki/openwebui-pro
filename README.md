# OpenWebUI Pro

Nowoczesna platforma AI z optymalizacjami dla M4 Pro, wykorzystująca lokalne modele Ollama i OpenAI jako fallback.

## 🚀 Funkcje

- 🤖 Integracja z Ollama (lokalne modele 70B)
- ☁️ Fallback do OpenAI
- 🔍 Wyszukiwanie semantyczne z pgvector
- 💾 PostgreSQL + Drizzle ORM
- ⚡ Fastify (70% szybszy niż Express)
- 🎨 Next.js 14 + Tailwind + shadcn/ui
- 🔒 Lucia Auth (TypeScript-first)
- 📊 Zustand + TanStack Query v5

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query v5

### Backend
- Fastify
- PostgreSQL
- Drizzle ORM
- pgvector
- Ollama
- OpenAI

### DevOps
- Docker
- GitHub Actions
- Sentry
- Vercel

## 🚀 Szybki Start

### Wymagania
- Node.js 18+
- PostgreSQL 15+
- Ollama (opcjonalnie)
- OpenAI API Key (opcjonalnie)

### Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/DannyBiernacki/openwebui-pro.git
cd openwebui-pro
```

2. Zainstaluj zależności:
```bash
pnpm install
```

3. Skonfiguruj zmienne środowiskowe:
```bash
cp .env.example .env.local
```

4. Uruchom bazę danych:
```bash
docker-compose up -d
```

5. Uruchom migracje:
```bash
pnpm migrate
```

6. Uruchom aplikację:
```bash
pnpm dev
```

## 🎯 Optymalizacje M4 Pro

- Wykorzystanie 14 rdzeni
- 48GB RAM dla modeli 70B
- GPU acceleration
- ARM64 native packages
- Parallel processing
- SSD caching

## 📚 Dokumentacja

- [Architektura](docs/specs/technical-architecture.md)
- [UI/UX](docs/specs/ui-ux-specification.md)
- [Setup](docs/setup/environment-setup.md)
- [Development](docs/development/cursor-workflow.md)

## 🤝 Contributing

1. Fork repozytorium
2. Stwórz branch (`git checkout -b feature/amazing-feature`)
3. Commit zmian (`git commit -m 'feat: add amazing feature'`)
4. Push do brancha (`git push origin feature/amazing-feature`)
5. Otwórz Pull Request

## 📝 License

MIT License - zobacz [LICENSE](LICENSE) dla szczegółów.

## 👥 Autorzy

- **Danny Biernacki** - [@DannyBiernacki](https://github.com/DannyBiernacki)

## 🙏 Podziękowania

- [Ollama](https://ollama.ai)
- [OpenAI](https://openai.com)
- [Vercel](https://vercel.com)
- [shadcn/ui](https://ui.shadcn.com) 
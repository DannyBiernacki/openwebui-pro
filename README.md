# OpenWebUI Pro

Nowoczesny interfejs użytkownika dla lokalnych modeli AI, zoptymalizowany dla M4 Pro.

## 🚀 Funkcje

- 🤖 Integracja z Ollama i OpenAI
- 🔒 Lokalne przetwarzanie AI
- 🎨 Nowoczesny interfejs Next.js 14
- 📊 Zaawansowana analityka
- 🔍 Wyszukiwanie semantyczne
- 🎯 Optymalizacja dla M4 Pro

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind + shadcn/ui
- **Backend**: Fastify + Drizzle ORM
- **Baza danych**: PostgreSQL + pgvector
- **AI**: Ollama (lokalne) + OpenAI (fallback)
- **Auth**: Lucia
- **State**: Zustand + TanStack Query v5

## 📋 Wymagania

- Node.js 18+
- pnpm 8+
- PostgreSQL 15+
- Docker (opcjonalnie)
- M4 Pro (zalecane)

## 🚀 Szybki Start

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
cp .env.example .env
```

4. Uruchom bazę danych:
```bash
docker-compose up -d
```

5. Uruchom migracje:
```bash
pnpm migrate
```

6. Uruchom serwer deweloperski:
```bash
pnpm dev
```

## 🏗️ Struktura Projektu

```
openwebui-pro/
├── frontend/              # Next.js app
├── backend/               # Fastify API
├── shared/                # Wspólne typy
├── docs/                  # Dokumentacja
└── deployment/            # Docker/Coolify
```

## 📚 Dokumentacja

- [Przewodnik Instalacji](docs/installation.md)
- [Architektura](docs/architecture.md)
- [API Reference](docs/api.md)
- [Optymalizacja M4 Pro](docs/m4-optimization.md)

## 🤝 Contributing

Zapraszamy do współpracy! Proszę przeczytać [CONTRIBUTING.md](CONTRIBUTING.md) przed rozpoczęciem.

## 📝 Licencja

MIT License - zobacz [LICENSE](LICENSE) dla szczegółów.

## 👥 Autorzy

- Danny Biernacki ([@DannyBiernacki](https://github.com/DannyBiernacki))

## 🙏 Podziękowania

- Ollama za świetne narzędzia AI
- Vercel za Next.js
- Wszystkim kontrybutorom

## 📞 Kontakt

- Email: dev@danielbiernacki.pl
- GitHub: [@DannyBiernacki](https://github.com/DannyBiernacki)
- Twitter: [@DannyBiernacki](https://twitter.com/DannyBiernacki)

## 🔄 Status Projektu

🚧 W trakcie rozwoju - wersja alpha 
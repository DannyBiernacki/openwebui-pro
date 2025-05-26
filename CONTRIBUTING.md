# Contributing do OpenWebUI Pro

Dziękujemy za zainteresowanie projektem OpenWebUI Pro! Ten dokument zawiera wytyczne dotyczące procesu rozwoju i współpracy.

## 🎯 Wymagania

### Język
- Wszystkie komentarze i dokumentacja muszą być w języku polskim
- Nazwy zmiennych i funkcji w języku angielskim
- Komunikaty commitów w języku angielskim (Conventional Commits)

### Development
- Cursor IDE z AI assistance
- Node.js 18+
- pnpm 8.15.4+
- PostgreSQL 15+
- Docker

## 🚀 Proces Developmentu

### 1. Setup Środowiska
```bash
# Klonowanie repozytorium
git clone https://github.com/DannyBiernacki/openwebui-pro.git
cd openwebui-pro

# Instalacja zależności
pnpm install

# Konfiguracja środowiska
cp .env.example .env.local
```

### 2. Workflow z Cursor AI
1. Użyj Cursor AI do generowania kodu
2. Przejrzyj i zmodyfikuj wygenerowany kod
3. Dodaj testy jednostkowe
4. Uruchom testy i linting
5. Commit i push zmian

### 3. Test-Driven Development (TDD)
1. Napisz testy przed implementacją
2. Upewnij się, że testy failują
3. Zaimplementuj funkcjonalność
4. Upewnij się, że testy przechodzą
5. Refaktoruj kod

### 4. Conventional Commits
```
feat: dodano nową funkcję
fix: naprawiono błąd w komponencie
docs: zaktualizowano dokumentację
style: poprawiono formatowanie
refactor: zrefaktorowano kod
test: dodano testy
chore: zaktualizowano zależności
```

## 📝 Pull Request Process

### 1. Przygotowanie PR
- Stwórz branch z prefiksem `feature/`, `fix/`, `docs/` itp.
- Upewnij się, że wszystkie testy przechodzą
- Zaktualizuj dokumentację
- Dodaj screenshots dla zmian UI
- Wypełnij szablon PR

### 2. Wymagania PR
- ✅ Testy jednostkowe (min. 80% coverage)
- ✅ Testy integracyjne
- ✅ Dokumentacja
- ✅ Screenshots (dla UI)
- ✅ Changelog
- ✅ Breaking changes (jeśli są)

### 3. Code Review
- PR musi być zaakceptowane przez code owner
- Wszystkie komentarze muszą być rozwiązane
- CI/CD musi przejść pomyślnie

## 🧪 Standardy Testowania

### 1. Testy Jednostkowe
- Min. 80% coverage
- Używaj Jest + Testing Library
- Mockuj zewnętrzne zależności
- Testuj edge cases

### 2. Testy Integracyjne
- Testuj API endpoints
- Testuj integrację z bazą danych
- Testuj integrację z AI services

### 3. E2E Tests
- Używaj Playwright
- Testuj krytyczne ścieżki
- Testuj responsywność

## 📚 Standardy Kodu

### 1. SOLID Principles
- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

### 2. DRY & KISS
- Don't Repeat Yourself
- Keep It Simple, Stupid

### 3. TypeScript
- Strict mode enabled
- No `any` type
- Proper interfaces
- Generics where needed

### 4. Styling
- Tailwind CSS
- shadcn/ui components
- Mobile-first approach
- Dark mode support

## 🔍 Code Review Checklist

### 1. Funkcjonalność
- ✅ Kod spełnia wymagania
- ✅ Obsługuje edge cases
- ✅ Jest zoptymalizowany

### 2. Jakość
- ✅ Testy są wystarczające
- ✅ Dokumentacja jest kompletna
- ✅ Kod jest czytelny

### 3. Bezpieczeństwo
- ✅ Brak wrażliwych danych
- ✅ Walidacja inputów
- ✅ Obsługa błędów

## 📊 Metryki Jakości

### 1. Test Coverage
- Statements: 80%+
- Branches: 80%+
- Functions: 80%+
- Lines: 80%+

### 2. Performance
- First load: < 2s
- API response: < 150ms
- Bundle size: < 200KB

### 3. Accessibility
- WCAG 2.1 AA
- Keyboard navigation
- Screen reader support

## 🎨 UI/UX Guidelines

### 1. Design System
- Używaj shadcn/ui
- Zachowaj spójność
- Mobile-first

### 2. Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation

### 3. Performance
- Lazy loading
- Image optimization
- Code splitting

## 📈 Continuous Improvement

### 1. Code Quality
- Regular refactoring
- Performance monitoring
- Security audits

### 2. Documentation
- Keep docs up to date
- Add examples
- Update changelog

### 3. Feedback
- Gather user feedback
- Monitor metrics
- Iterate quickly 
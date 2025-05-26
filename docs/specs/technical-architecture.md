# OpenWebUI Pro - Technical Architecture

## System Overview

OpenWebUI Pro to nowoczesna aplikacja webowa zoptymalizowana dla M4 Pro, wykorzystująca najnowsze technologie i wzorce architektoniczne.

## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + TanStack Query v5
- **Testing**: Jest + Testing Library
- **Build Tool**: Turbopack (M4 Pro optimized)

### Backend
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL 15 + pgvector
- **ORM**: Drizzle
- **Authentication**: Lucia
- **API**: REST + WebSocket

### AI & Search
- **Local AI**: Ollama (70B models)
- **Cloud AI**: OpenAI (fallback)
- **Vector DB**: Qdrant
- **RAG**: Custom implementation
- **Streaming**: Server-Sent Events

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id),
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Authentication
```typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/session
```

### Documents
```typescript
GET /api/documents
POST /api/documents
GET /api/documents/:id
PUT /api/documents/:id
DELETE /api/documents/:id
POST /api/documents/:id/embed
```

### Conversations
```typescript
GET /api/conversations
POST /api/conversations
GET /api/conversations/:id
DELETE /api/conversations/:id
POST /api/conversations/:id/messages
GET /api/conversations/:id/messages
```

### AI
```typescript
POST /api/ai/chat
POST /api/ai/stream
POST /api/ai/embed
GET /api/ai/models
```

### Search
```typescript
POST /api/search/vector
POST /api/search/semantic
GET /api/search/history
```

## System Architecture

### Components
1. **Frontend Application**
   - Next.js App Router
   - Server Components
   - Client Components
   - API Routes

2. **Backend Services**
   - Fastify Server
   - WebSocket Server
   - Authentication Service
   - Document Service
   - AI Service
   - Search Service

3. **Database Layer**
   - PostgreSQL
   - pgvector
   - Drizzle ORM
   - Migrations

4. **AI Layer**
   - Ollama Integration
   - OpenAI Integration
   - Vector Search
   - RAG Pipeline

### Data Flow
1. User Request → Next.js API Route
2. API Route → Fastify Backend
3. Backend → Database/AI Services
4. AI Services → Vector Search
5. Response → User Interface

## Security Architecture

### Authentication
- Lucia (TypeScript-first)
- JWT tokens
- Session management
- Role-based access

### Data Protection
- End-to-end encryption
- Secure file storage
- Input validation
- Rate limiting

### API Security
- CORS configuration
- Request validation
- Error handling
- Logging

## Performance Optimizations

### M4 Pro Specific
- ARM64 native builds
- GPU acceleration
- Parallel processing
- Memory optimization

### Frontend
- Code splitting
- Image optimization
- Caching strategy
- Bundle optimization

### Backend
- Connection pooling
- Query optimization
- Caching layers
- Load balancing

## Monitoring & Logging

### Metrics
- Performance metrics
- Error rates
- User analytics
- Resource usage

### Logging
- Application logs
- Error tracking
- Audit logs
- AI model logs

## Deployment

### Development
- Local development
- Docker containers
- Hot reloading
- Debug tools

### Production
- Docker deployment
- CI/CD pipeline
- Monitoring
- Backup strategy 
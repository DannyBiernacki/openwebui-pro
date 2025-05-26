import { AIMessage } from '../src/components/ui/AIMessage';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-8 text-4xl font-bold">OpenWebUI Pro</h1>
      <div className="space-y-4">
        <AIMessage
          content="Witaj! Jestem asystentem AI zoptymalizowanym dla M4 Pro."
          isAI={true}
          timestamp={new Date()}
        />
        <AIMessage
          content="To jest przykładowa wiadomość użytkownika."
          isAI={false}
          timestamp={new Date()}
        />
      </div>
    </main>
  );
} 
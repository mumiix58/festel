import { Container } from '@/components/ui/Container';
import { useLegal } from '@/hooks/useLegal';
import ReactMarkdown from 'react-markdown';

export function AGB() {
  const { content, loading } = useLegal();

  if (loading || !content) {
    return (
      <div className="py-24">
        <Container>
          <div className="text-center">Laden...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-24">
      <Container>
        <div className="prose prose-lg mx-auto max-w-3xl">
          <ReactMarkdown>{content.agb}</ReactMarkdown>
        </div>
      </Container>
    </div>
  );
}
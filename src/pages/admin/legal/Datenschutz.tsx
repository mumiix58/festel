import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Save } from 'lucide-react';
import { useLegal } from '@/hooks/useLegal';

export function DatenschutzAdmin() {
  const { content, loading, error, updateContent } = useLegal();
  const [localContent, setLocalContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Initialize local content when content is loaded
  useEffect(() => {
    if (content) {
      setLocalContent(content.datenschutz);
    }
  }, [content]);

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const success = await updateContent({
        ...content,
        datenschutz: localContent
      });

      if (success) {
        setSaveMessage({
          type: 'success',
          text: 'Datenschutzerklärung erfolgreich gespeichert'
        });
      }
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Speichern der Datenschutzerklärung'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center">Laden...</div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <Container>
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        </Container>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="py-8">
        <Container>
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            Keine Inhalte verfügbar
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Datenschutzerklärung bearbeiten</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
          </button>
        </div>

        {saveMessage && (
          <div
            className={`mt-4 rounded-lg p-4 ${
              saveMessage.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <div className="mt-8">
          <textarea
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            className="min-h-[600px] w-full rounded-lg border border-gray-300 p-4 font-mono text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
            placeholder="# Datenschutzerklärung Inhalt (Markdown)"
          />
        </div>
      </Container>
    </div>
  );
}

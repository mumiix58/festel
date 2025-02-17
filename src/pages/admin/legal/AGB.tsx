import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Save } from 'lucide-react';
import { useLegal } from '@/hooks/useLegal';
import ReactMarkdown from 'react-markdown';

export function AGBAdmin() {
  const { content, loading, error, updateContent, saveContent, hasUnsavedChanges } = useLegal();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setSaving(true);
    setSaveMessage(null);

    try {
      if (!content) return;
      
      const success = await saveContent();
      if (success) {
        setSaveMessage({
          type: 'success',
          text: 'AGB erfolgreich gespeichert'
        });
      }
    } catch (error) {
      console.error('Error saving terms:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Speichern der AGB'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center">Laden...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">AGB bearbeiten</h1>
          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors ${
              hasUnsavedChanges ? 'bg-accent hover:bg-accent-dark' : 'bg-gray-400'
            } disabled:opacity-50`}
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
            value={content.agb}
            onChange={(e) => updateContent({
              ...content,
              agb: e.target.value
            })}
            className="min-h-[600px] w-full rounded-lg border border-gray-300 p-4 font-mono text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
            placeholder="# AGB Inhalt (Markdown)"
          />
        </div>

        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold">Vorschau</h2>
          <div className="prose prose-lg mt-4 max-w-none rounded-lg bg-white p-6 shadow-lg">
            <ReactMarkdown>{content.agb}</ReactMarkdown>
          </div>
        </div>
      </Container>
    </div>
  );
}
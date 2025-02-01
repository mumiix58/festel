import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Save } from 'lucide-react';
import { useLegal } from '@/hooks/useLegal';

export function Legal() {
  const { content, loading, error, updateContent } = useLegal();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      await updateContent(content);
      setSaveMessage({
        type: 'success',
        text: 'Rechtliche Inhalte erfolgreich gespeichert'
      });
    } catch (error) {
      console.error('Error saving legal content:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Speichern der rechtlichen Inhalte'
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
          <h1 className="font-display text-3xl font-bold">Rechtliche Seiten</h1>
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

        <div className="mt-8 space-y-8">
          {/* Impressum */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Impressum</h2>
            <div className="mt-4">
              <textarea
                value={content.impressum}
                onChange={(e) =>
                  updateContent({
                    ...content,
                    impressum: e.target.value
                  })
                }
                rows={20}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
              />
            </div>
          </section>

          {/* Datenschutz */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Datenschutzerklärung</h2>
            <div className="mt-4">
              <textarea
                value={content.datenschutz}
                onChange={(e) =>
                  updateContent({
                    ...content,
                    datenschutz: e.target.value
                  })
                }
                rows={20}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
              />
            </div>
          </section>

          {/* AGB */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">AGB</h2>
            <div className="mt-4">
              <textarea
                value={content.agb}
                onChange={(e) =>
                  updateContent({
                    ...content,
                    agb: e.target.value
                  })
                }
                rows={20}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
              />
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { PageEditor } from '@/components/admin/PageEditor';
import { PageContent } from '@/types';

const pages = [
  { id: 'home', name: 'Startseite' },
  { id: 'about', name: 'Über Uns' },
  { id: 'services', name: 'Dienstleistungen' },
  { id: 'faq', name: 'SSS' },
  { id: 'references', name: 'Referenzen' },
  { id: 'contact', name: 'Kontakt' }
];

export function Pages() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadContent();
  }, [selectedPage]);

  const loadContent = async () => {
    // Placeholder for future implementation
    setPageContent({
      sections: []
    });
  };

  const handleSave = async (content: PageContent) => {
    setSaving(true);
    setSaveMessage(null);

    try {
      setPageContent(content);
      setSaveMessage({
        type: 'success',
        text: 'Änderungen wurden erfolgreich gespeichert'
      });
    } catch (error) {
      console.error('Error saving page content:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Speichern der Änderungen'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!pageContent) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center">Laden...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <Container>
          <div className="flex items-center justify-between py-4">
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>

            {saveMessage && (
              <div
                className={`rounded-lg px-4 py-2 text-sm ${
                  saveMessage.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {saveMessage.text}
              </div>
            )}
          </div>
        </Container>
      </div>

      <PageEditor
        pageId={selectedPage}
        content={pageContent}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
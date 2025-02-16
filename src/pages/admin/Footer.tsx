import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useFooter } from '@/hooks/useFooter';
import { useSettings } from '@/hooks/useSettings';
import { FooterContent } from '@/types';

export function Footer() {
  const { settings, updateSettings } = useSettings();
  const { content, updateContent } = useFooter();
  const [localContent, setLocalContent] = useState<FooterContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Initialize local content when content is loaded
  useEffect(() => {
    if (content) {
      setLocalContent(content);
    }
  }, [content]);

  const handleSave = async () => {
    if (!content || !settings || !localContent) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      await updateContent(localContent);
      await updateSettings(settings);
      setSaveMessage({
        type: 'success',
        text: 'Footer-Inhalte erfolgreich gespeichert'
      });
    } catch (error) {
      console.error('Error saving footer content:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Speichern der Footer-Inhalte'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddOpeningHour = () => {
    if (!localContent) return;
    setLocalContent({
      ...localContent,
      openingHours: [
        ...localContent.openingHours,
        { day: 'Neuer Tag', hours: 'Öffnungszeiten' }
      ]
    });
  };

  const handleRemoveOpeningHour = (index: number) => {
    if (!localContent) return;
    const newHours = [...localContent.openingHours];
    newHours.splice(index, 1);
    setLocalContent({
      ...localContent,
      openingHours: newHours
    });
  };

  const handleAddQuickLink = () => {
    if (!localContent) return;
    setLocalContent({
      ...localContent,
      quickLinks: [
        ...localContent.quickLinks,
        { text: 'Neuer Link', url: '/', isExternal: false }
      ]
    });
  };

  const handleRemoveQuickLink = (index: number) => {
    if (!localContent) return;
    const newLinks = [...localContent.quickLinks];
    newLinks.splice(index, 1);
    setLocalContent({
      ...localContent,
      quickLinks: newLinks
    });
  };

  if (!content || !settings || !localContent) {
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
          <h1 className="font-display text-3xl font-bold">Footer verwalten</h1>
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
          {/* Footer Description */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Footer Beschreibung</h2>
            <div className="mt-4">
              <textarea
                value={localContent.description}
                onChange={(e) =>
                  setLocalContent({
                    ...localContent,
                    description: e.target.value
                  })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                placeholder="Footer Beschreibung"
              />
            </div>
          </section>

          {/* Opening Hours */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Öffnungszeiten</h2>
              <button
                onClick={handleAddOpeningHour}
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent-dark"
              >
                <Plus className="h-4 w-4" />
                Öffnungszeit hinzufügen
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {localContent.openingHours.map((hour, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={hour.day}
                      onChange={(e) => {
                        const newHours = [...localContent.openingHours];
                        newHours[index] = { ...hour, day: e.target.value };
                        setLocalContent({ ...localContent, openingHours: newHours });
                      }}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      placeholder="Tag"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={hour.hours}
                      onChange={(e) => {
                        const newHours = [...localContent.openingHours];
                        newHours[index] = { ...hour, hours: e.target.value };
                        setLocalContent({ ...localContent, openingHours: newHours });
                      }}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      placeholder="Öffnungszeiten"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveOpeningHour(index)}
                    className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Quick Links</h2>
              <button
                onClick={handleAddQuickLink}
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent-dark"
              >
                <Plus className="h-4 w-4" />
                Link hinzufügen
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {localContent.quickLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.text}
                      onChange={(e) => {
                        const newLinks = [...localContent.quickLinks];
                        newLinks[index] = { ...link, text: e.target.value };
                        setLocalContent({ ...localContent, quickLinks: newLinks });
                      }}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      placeholder="Link Text"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...localContent.quickLinks];
                        newLinks[index] = { ...link, url: e.target.value };
                        setLocalContent({ ...localContent, quickLinks: newLinks });
                      }}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      placeholder="Link URL"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={link.isExternal}
                        onChange={(e) => {
                          const newLinks = [...localContent.quickLinks];
                          newLinks[index] = { ...link, isExternal: e.target.checked };
                          setLocalContent({ ...localContent, quickLinks: newLinks });
                        }}
                        className="rounded border-gray-300 text-accent focus:ring-accent"
                      />
                      <span className="text-sm">Extern</span>
                    </label>
                    <button
                      onClick={() => handleRemoveQuickLink(index)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
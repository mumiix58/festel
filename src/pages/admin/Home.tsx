import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { HomeContent, StatContent } from '@/types';
import { getHomeContent, updateHomeContent } from '@/lib/home';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const homeContent = await getHomeContent();
      setContent(homeContent);
    } catch (error) {
      console.error('Error loading content:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Laden der Inhalte'
      });
    }
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      await updateHomeContent(content);
      setSaveMessage({
        type: 'success',
        text: 'Änderungen erfolgreich gespeichert'
      });
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Speichern der Änderungen'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddStat = () => {
    if (!content) return;

    const newStat: StatContent = {
      id: uuidv4(),
      value: '0+',
      label: 'Neue Statistik',
      order: content.stats.length,
      isActive: true
    };

    setContent({
      ...content,
      stats: [...content.stats, newStat]
    });
  };

  const handleRemoveStat = (statId: string) => {
    if (!content) return;

    if (window.confirm('Möchten Sie diese Statistik wirklich entfernen?')) {
      const updatedStats = content.stats
        .filter(stat => stat.id !== statId)
        .map((stat, index) => ({ ...stat, order: index }));

      setContent({
        ...content,
        stats: updatedStats
      });
    }
  };

  const handleMoveStat = (statId: string, direction: 'up' | 'down') => {
    if (!content) return;

    const currentIndex = content.stats.findIndex(s => s.id === statId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= content.stats.length) return;

    const updatedStats = [...content.stats];
    const [movedStat] = updatedStats.splice(currentIndex, 1);
    updatedStats.splice(newIndex, 0, movedStat);

    // Update order values
    const reorderedStats = updatedStats.map((stat, index) => ({
      ...stat,
      order: index
    }));

    setContent({
      ...content,
      stats: reorderedStats
    });
  };

  if (!content) {
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
          <h1 className="font-display text-3xl font-bold">Startseite verwalten</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddStat}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark"
            >
              <Plus className="h-4 w-4" />
              Statistik hinzufügen
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
            </button>
          </div>
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
          {/* Stats Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Statistiken</h2>
            <div className="mt-4 space-y-4">
              {content.stats
                .sort((a, b) => a.order - b.order)
                .map((stat) => (
                  <div
                    key={stat.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Wert
                          </label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const updatedStats = content.stats.map(s =>
                                s.id === stat.id ? { ...s, value: e.target.value } : s
                              );
                              setContent({
                                ...content,
                                stats: updatedStats
                              });
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Beschriftung
                          </label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const updatedStats = content.stats.map(s =>
                                s.id === stat.id ? { ...s, label: e.target.value } : s
                              );
                              setContent({
                                ...content,
                                stats: updatedStats
                              });
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={stat.isActive}
                            onChange={(e) => {
                              const updatedStats = content.stats.map(s =>
                                s.id === stat.id ? { ...s, isActive: e.target.checked } : s
                              );
                              setContent({
                                ...content,
                                stats: updatedStats
                              });
                            }}
                            className="rounded border-gray-300 text-accent focus:ring-accent"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Aktiv
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMoveStat(stat.id, 'up')}
                        disabled={stat.order === 0}
                        className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveStat(stat.id, 'down')}
                        disabled={stat.order === content.stats.length - 1}
                        className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveStat(stat.id)}
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* SEO Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">SEO Einstellungen</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={content.seo.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, title: e.target.value }
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  value={content.seo.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, description: e.target.value }
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={content.seo.keywords}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, keywords: e.target.value }
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}

export { Home }
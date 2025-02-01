import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFAQ } from '@/hooks/useFAQ';
import { v4 as uuidv4 } from 'uuid';

export function FAQ() {
  const { content, loading, error, updateContent } = useFAQ();
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

  const handleAddFAQ = () => {
    if (!content) return;

    const newFAQ = {
      id: uuidv4(),
      question: 'Neue Frage',
      answer: 'Ihre Antwort hier',
      order: content.faqs.length,
      isActive: true
    };

    updateContent({
      ...content,
      faqs: [...content.faqs, newFAQ]
    });
  };

  const handleRemoveFAQ = (faqId: string) => {
    if (!content) return;

    if (window.confirm('Möchten Sie diese FAQ wirklich entfernen?')) {
      const updatedFAQs = content.faqs
        .filter(faq => faq.id !== faqId)
        .map((faq, index) => ({ ...faq, order: index }));

      updateContent({
        ...content,
        faqs: updatedFAQs
      });
    }
  };

  const handleMoveFAQ = (faqId: string, direction: 'up' | 'down') => {
    if (!content) return;

    const currentIndex = content.faqs.findIndex(f => f.id === faqId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= content.faqs.length) return;

    const updatedFAQs = [...content.faqs];
    const [movedFAQ] = updatedFAQs.splice(currentIndex, 1);
    updatedFAQs.splice(newIndex, 0, movedFAQ);

    // Update order values
    const reorderedFAQs = updatedFAQs.map((faq, index) => ({
      ...faq,
      order: index
    }));

    updateContent({
      ...content,
      faqs: reorderedFAQs
    });
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

  if (error) {
    return (
      <div className="py-8">
        <Container>
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">FAQ verwalten</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddFAQ}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark"
            >
              <Plus className="h-4 w-4" />
              FAQ hinzufügen
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
          {/* Hero Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Hero Bereich</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) =>
                    updateContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value }
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Untertitel
                </label>
                <input
                  type="text"
                  value={content.hero.subtitle}
                  onChange={(e) =>
                    updateContent({
                      ...content,
                      hero: { ...content.hero, subtitle: e.target.value }
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <div className="space-y-6">
            {content.faqs
              .sort((a, b) => a.order - b.order)
              .map((faq) => (
                <motion.section
                  key={faq.id}
                  layout
                  className="rounded-lg bg-white p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-xl font-semibold">
                      FAQ #{faq.order + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMoveFAQ(faq.id, 'up')}
                        disabled={faq.order === 0}
                        className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveFAQ(faq.id, 'down')}
                        disabled={faq.order === content.faqs.length - 1}
                        className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveFAQ(faq.id)}
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Frage
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const updatedFAQs = content.faqs.map(f =>
                            f.id === faq.id
                              ? { ...f, question: e.target.value }
                              : f
                          );
                          updateContent({
                            ...content,
                            faqs: updatedFAQs
                          });
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Antwort
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => {
                          const updatedFAQs = content.faqs.map(f =>
                            f.id === faq.id
                              ? { ...f, answer: e.target.value }
                              : f
                          );
                          updateContent({
                            ...content,
                            faqs: updatedFAQs
                          });
                        }}
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={faq.isActive}
                          onChange={(e) => {
                            const updatedFAQs = content.faqs.map(f =>
                              f.id === faq.id
                                ? { ...f, isActive: e.target.checked }
                                : f
                            );
                            updateContent({
                              ...content,
                              faqs: updatedFAQs
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
                </motion.section>
              ))}
          </div>

          {/* CTA Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Call-to-Action</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.cta.title}
                  onChange={(e) =>
                    updateContent({
                      ...content,
                      cta: { ...content.cta, title: e.target.value }
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Beschreibung
                </label>
                <textarea
                  value={content.cta.description}
                  onChange={(e) =>
                    updateContent({
                      ...content,
                      cta: { ...content.cta, description: e.target.value }
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={content.cta.buttonText}
                    onChange={(e) =>
                      updateContent({
                        ...content,
                        cta: { ...content.cta, buttonText: e.target.value }
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={content.cta.buttonLink}
                    onChange={(e) =>
                      updateContent({
                        ...content,
                        cta: { ...content.cta, buttonLink: e.target.value }
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>
              </div>
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
                    updateContent({
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
                    updateContent({
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
                    updateContent({
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
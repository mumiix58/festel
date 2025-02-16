import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Save, Upload, Plus, Trash2, ArrowUp, ArrowDown, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReferences } from '@/hooks/useReferences';
import { ReferencesContent } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function References() {
  const { content, loading, error, updateContent } = useReferences();
  const [localContent, setLocalContent] = useState<ReferencesContent | null>(null);
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
    if (!localContent) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      await updateContent(localContent);
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

  const handleImageUpload = async (testimonialId: string, file: File) => {
    if (!localContent) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const updatedTestimonials = localContent.testimonials.map(testimonial =>
          testimonial.id === testimonialId ? { ...testimonial, image: imageUrl } : testimonial
        );

        setLocalContent({
          ...localContent,
          testimonials: updatedTestimonials
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Hochladen des Bildes'
      });
    }
  };

  const handleAddTestimonial = () => {
    if (!localContent) return;

    const newTestimonial = {
      id: uuidv4(),
      name: 'Neuer Kunde',
      event: 'Veranstaltung',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
      quote: 'Kundenbewertung hier eingeben',
      rating: 5,
      order: localContent.testimonials.length,
      isActive: true
    };

    setLocalContent({
      ...localContent,
      testimonials: [...localContent.testimonials, newTestimonial]
    });
  };

  const handleRemoveTestimonial = (testimonialId: string) => {
    if (!localContent) return;

    if (window.confirm('Möchten Sie diese Referenz wirklich entfernen?')) {
      const updatedTestimonials = localContent.testimonials
        .filter(testimonial => testimonial.id !== testimonialId)
        .map((testimonial, index) => ({ ...testimonial, order: index }));

      setLocalContent({
        ...localContent,
        testimonials: updatedTestimonials
      });
    }
  };

  const handleMoveTestimonial = (testimonialId: string, direction: 'up' | 'down') => {
    if (!localContent) return;

    const currentIndex = localContent.testimonials.findIndex(t => t.id === testimonialId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= localContent.testimonials.length) return;

    const updatedTestimonials = [...localContent.testimonials];
    const [movedTestimonial] = updatedTestimonials.splice(currentIndex, 1);
    updatedTestimonials.splice(newIndex, 0, movedTestimonial);

    // Update order values
    const reorderedTestimonials = updatedTestimonials.map((testimonial, index) => ({
      ...testimonial,
      order: index
    }));

    setLocalContent({
      ...localContent,
      testimonials: reorderedTestimonials
    });
  };

  if (loading || !localContent) {
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
          <h1 className="font-display text-3xl font-bold">Referenzen verwalten</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddTestimonial}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark"
            >
              <Plus className="h-4 w-4" />
              Referenz hinzufügen
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
                  value={localContent.hero.title}
                  onChange={(e) =>
                    setLocalContent({
                      ...localContent,
                      hero: { ...localContent.hero, title: e.target.value }
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
                  value={localContent.hero.subtitle}
                  onChange={(e) =>
                    setLocalContent({
                      ...localContent,
                      hero: { ...localContent.hero, subtitle: e.target.value }
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <div className="space-y-6">
            {localContent.testimonials
              .sort((a, b) => a.order - b.order)
              .map((testimonial) => (
                <motion.section
                  key={testimonial.id}
                  layout
                  className="rounded-lg bg-white p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-xl font-semibold">
                      Referenz #{testimonial.order + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMoveTestimonial(testimonial.id, 'up')}
                        disabled={testimonial.order === 0}
                        className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveTestimonial(testimonial.id, 'down')}
                        disabled={testimonial.order === localContent.testimonials.length - 1}
                        className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveTestimonial(testimonial.id)}
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => {
                            const updatedTestimonials = localContent.testimonials.map(t =>
                              t.id === testimonial.id
                                ? { ...t, name: e.target.value }
                                : t
                            );
                            setLocalContent({
                              ...localContent,
                              testimonials: updatedTestimonials
                            });
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Veranstaltung
                        </label>
                        <input
                          type="text"
                          value={testimonial.event}
                          onChange={(e) => {
                            const updatedTestimonials = localContent.testimonials.map(t =>
                              t.id === testimonial.id
                                ? { ...t, event: e.target.value }
                                : t
                            );
                            setLocalContent({
                              ...localContent,
                              testimonials: updatedTestimonials
                            });
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bewertung
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => {
                              const updatedTestimonials = localContent.testimonials.map(t =>
                                t.id === testimonial.id
                                  ? { ...t, rating }
                                  : t
                              );
                              setLocalContent({
                                ...localContent,
                                testimonials: updatedTestimonials
                              });
                            }}
                            className={`rounded-full p-1 ${
                              rating <= testimonial.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            <Star className="h-6 w-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bewertungstext
                      </label>
                      <textarea
                        value={testimonial.quote}
                        onChange={(e) => {
                          const updatedTestimonials = localContent.testimonials.map(t =>
                            t.id === testimonial.id
                              ? { ...t, quote: e.target.value }
                              : t
                          );
                          setLocalContent({
                            ...localContent,
                            testimonials: updatedTestimonials
                          });
                        }}
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bild
                      </label>
                      <div className="mt-2 flex items-center gap-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-32 w-48 rounded-lg object-cover"
                        />
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
                          <Upload className="h-4 w-4" />
                          <span>Bild ändern</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(testimonial.id, file);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={testimonial.isActive}
                          onChange={(e) => {
                            const updatedTestimonials = localContent.testimonials.map(t =>
                              t.id === testimonial.id
                                ? { ...t, isActive: e.target.checked }
                                : t
                            );
                            setLocalContent({
                              ...localContent,
                              testimonials: updatedTestimonials
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
                  value={localContent.cta.title}
                  onChange={(e) =>
                    setLocalContent({
                      ...localContent,
                      cta: { ...localContent.cta, title: e.target.value }
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
                  value={localContent.cta.description}
                  onChange={(e) =>
                    setLocalContent({
                      ...localContent,
                      cta: { ...localContent.cta, description: e.target.value }
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
                    value={localContent.cta.buttonText}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        cta: { ...localContent.cta, buttonText: e.target.value }
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
                    value={localContent.cta.buttonLink}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        cta: { ...localContent.cta, buttonLink: e.target.value }
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
                  value={localContent.seo.title}
                  onChange={(e) =>
                    setLocalContent({
                      ...localContent,
                      seo: { ...localContent.seo, title: e.target.value }
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
                  value={localContent.seo.description}
                  onChange={(e) =>
                    setLocalContent({
                      ...localContent,
                      seo: { ...localContent.seo, description: e.target.value }
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full rounde d-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={localContent.seo.keywords}
                  onChange={(e) =>
                    setLocalContent({
                      ...localContent,
                      seo: { ...localContent.seo, keywords: e.target.value }
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
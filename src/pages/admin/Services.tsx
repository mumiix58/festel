import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Save, Upload, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useServices } from '@/hooks/useServices';
import { optimizeImage } from '@/lib/imageUtils';
import { ServiceContent, ServicesPageContent } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function Services() {
  const { content, loading, error, updateContent } = useServices();
  const [localContent, setLocalContent] = useState<ServicesPageContent | null>(null);
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
      const success = await updateContent(localContent);
      if (success) {
        setSaveMessage({
          type: 'success',
          text: 'Änderungen erfolgreich gespeichert'
        });
      }
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

  const handleImageUpload = async (serviceId: string, file: File) => {
    if (!localContent) return;

    try {
      const optimizedFile = await optimizeImage(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const updatedServices = localContent.services.map(service =>
          service.id === serviceId ? { ...service, image: imageUrl } : service
        );

        setLocalContent({
          ...localContent,
          services: updatedServices
        });
      };

      reader.readAsDataURL(optimizedFile);
    } catch (error) {
      console.error('Error uploading image:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Hochladen des Bildes'
      });
    }
  };

  const handleAddService = () => {
    if (!localContent) return;

    const newService: ServiceContent = {
      id: `service-${uuidv4()}`,
      title: 'Neue Dienstleistung',
      description: 'Beschreibung der Dienstleistung',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
      order: localContent.services.length,
      buttonText: 'Jetzt anfragen',
      buttonLink: '/termin',
      isActive: true,
      seo: {
        title: 'Neue Dienstleistung | FEST\'LMACHER',
        description: 'Beschreibung für Suchmaschinen',
        keywords: 'catering wien, dienstleistung'
      }
    };

    setLocalContent({
      ...localContent,
      services: [...localContent.services, newService]
    });
  };

  const handleRemoveService = (serviceId: string) => {
    if (!localContent) return;

    if (window.confirm('Möchten Sie diese Dienstleistung wirklich entfernen?')) {
      const updatedServices = localContent.services
        .filter(service => service.id !== serviceId)
        .map((service, index) => ({ ...service, order: index }));

      setLocalContent({
        ...localContent,
        services: updatedServices
      });
    }
  };

  const handleMoveService = (serviceId: string, direction: 'up' | 'down') => {
    if (!localContent) return;

    const currentIndex = localContent.services.findIndex(s => s.id === serviceId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= localContent.services.length) return;

    const updatedServices = [...localContent.services];
    const [movedService] = updatedServices.splice(currentIndex, 1);
    updatedServices.splice(newIndex, 0, movedService);

    // Update order values
    const reorderedServices = updatedServices.map((service, index) => ({
      ...service,
      order: index
    }));

    setLocalContent({
      ...localContent,
      services: reorderedServices
    });
  };

  const handleAddFeature = (serviceId: string) => {
    if (!localContent) return;

    const updatedServices = localContent.services.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          features: [...service.features, 'Neues Feature']
        };
      }
      return service;
    });

    setLocalContent({
      ...localContent,
      services: updatedServices
    });
  };

  const handleRemoveFeature = (serviceId: string, featureIndex: number) => {
    if (!localContent) return;

    const updatedServices = localContent.services.map(service => {
      if (service.id === serviceId) {
        const updatedFeatures = service.features.filter((_, index) => index !== featureIndex);
        return {
          ...service,
          features: updatedFeatures
        };
      }
      return service;
    });

    setLocalContent({
      ...localContent,
      services: updatedServices
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
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Dienstleistungen verwalten</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddService}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark"
            >
              <Plus className="h-4 w-4" />
              Dienstleistung hinzufügen
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

          {/* Services Section */}
          <div className="space-y-6">
            {localContent.services
              .sort((a, b) => a.order - b.order)
              .map((service) => (
                <motion.section
                  key={service.id}
                  layout
                  className="rounded-lg bg-white p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Titel
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => {
                            const updatedServices = localContent.services.map(s =>
                              s.id === service.id
                                ? { ...s, title: e.target.value }
                                : s
                            );
                            setLocalContent({
                              ...localContent,
                              services: updatedServices
                            });
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Beschreibung
                        </label>
                        <textarea
                          value={service.description}
                          onChange={(e) => {
                            const updatedServices = localContent.services.map(s =>
                              s.id === service.id
                                ? { ...s, description: e.target.value }
                                : s
                            );
                            setLocalContent({
                              ...localContent,
                              services: updatedServices
                            });
                          }}
                          rows={3}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        />
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <button
                        onClick={() => handleMoveService(service.id, 'up')}
                        disabled={service.order === 0}
                        className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveService(service.id, 'down')}
                        disabled={service.order === localContent.services.length - 1}
                        className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveService(service.id)}
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Bild
                    </label>
                    <div className="mt-2 flex items-center gap-4">
                      <img
                        src={service.image}
                        alt={service.title}
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
                            if (file) handleImageUpload(service.id, file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Features
                      </label>
                      <button
                        onClick={() => handleAddFeature(service.id)}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                      >
                        <Plus className="h-4 w-4" />
                        Feature hinzufügen
                      </button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={`${service.id}-feature-${index}`} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const updatedServices = localContent.services.map(s => {
                                if (s.id === service.id) {
                                  const updatedFeatures = [...s.features];
                                  updatedFeatures[index] = e.target.value;
                                  return { ...s, features: updatedFeatures };
                                }
                                return s;
                              });
                              setLocalContent({
                                ...localContent,
                                services: updatedServices
                              });
                            }}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                          />
                          <button
                            onClick={() => handleRemoveFeature(service.id, index)}
                            className="rounded p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={service.buttonText}
                        onChange={(e) => {
                          const updatedServices = localContent.services.map(s =>
                            s.id === service.id
                              ? { ...s, buttonText: e.target.value }
                              : s
                          );
                          setLocalContent({
                            ...localContent,
                            services: updatedServices
                          });
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={service.buttonLink}
                        onChange={(e) => {
                          const updatedServices = localContent.services.map(s =>
                            s.id === service.id
                              ? { ...s, buttonLink: e.target.value }
                              : s
                          );
                          setLocalContent({
                            ...localContent,
                            services: updatedServices
                          });
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      SEO Einstellungen
                    </label>
                    <div className="mt-2 space-y-4">
                      <input
                        type="text"
                        value={service.seo.title}
                        onChange={(e) => {
                          const updatedServices = localContent.services.map(s =>
                            s.id === service.id
                              ? {
                                  ...s,
                                  seo: { ...s.seo, title: e.target.value }
                                }
                              : s
                          );
                          setLocalContent({
                            ...localContent,
                            services: updatedServices
                          });
                        }}
                        placeholder="Meta Title"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      />
                      <textarea
                        value={service.seo.description}
                        onChange={(e) => {
                          const updatedServices = localContent.services.map(s =>
                            s.id === service.id
                              ? {
                                  ...s,
                                  seo: {
                                    ...s.seo,
                                    description: e.target.value
                                  }
                                }
                              : s
                          );
                          setLocalContent({
                            ...localContent,
                            services: updatedServices
                          });
                        }}
                        placeholder="Meta Description"
                        rows={2}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      />
                      <input
                        type="text"
                        value={service.seo.keywords}
                        onChange={(e) => {
                          const updatedServices = localContent.services.map(s =>
                            s.id === service.id
                              ? {
                                  ...s,
                                  seo: { ...s.seo, keywords: e.target.value }
                                }
                              : s
                          );
                          setLocalContent({
                            ...localContent,
                            services: updatedServices
                          });
                        }}
                        placeholder="Meta Keywords"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      />
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
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
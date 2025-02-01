import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';

interface Initiative {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Certification {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface SustainabilityContent {
  hero: {
    title: string;
    subtitle: string;
  };
  initiatives: Initiative[];
  certifications: Certification[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

const defaultContent: SustainabilityContent = {
  hero: {
    title: 'Bio & Nachhaltigkeit',
    subtitle: 'Unser Engagement für eine nachhaltige Zukunft'
  },
  initiatives: [],
  certifications: [],
  cta: {
    title: 'Gemeinsam für eine nachhaltige Zukunft',
    description: 'Lassen Sie uns gemeinsam Ihre Veranstaltung nachhaltig gestalten.',
    buttonText: 'Jetzt anfragen',
    buttonLink: '/kontakt'
  }
};

export function Sustainability() {
  const [content, setContent] = useState<SustainabilityContent>(defaultContent);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      // Save content to backend/storage
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

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Bio & Nachhaltigkeit verwalten</h1>
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
                    setContent({
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
                    setContent({
                      ...content,
                      hero: { ...content.hero, subtitle: e.target.value }
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
            </div>
          </section>

          {/* Initiatives Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Initiativen</h2>
              <button
                onClick={() => {
                  const newInitiative: Initiative = {
                    id: Date.now().toString(),
                    title: 'Neue Initiative',
                    description: 'Beschreibung der Initiative',
                    icon: 'Leaf'
                  };
                  setContent({
                    ...content,
                    initiatives: [...content.initiatives, newInitiative]
                  });
                }}
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent-dark"
              >
                <Plus className="h-4 w-4" />
                Initiative hinzufügen
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {content.initiatives.map((initiative, index) => (
                <div
                  key={initiative.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <input
                        type="text"
                        value={initiative.title}
                        onChange={(e) => {
                          const updatedInitiatives = [...content.initiatives];
                          updatedInitiatives[index] = {
                            ...initiative,
                            title: e.target.value
                          };
                          setContent({
                            ...content,
                            initiatives: updatedInitiatives
                          });
                        }}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        placeholder="Titel der Initiative"
                      />
                      <textarea
                        value={initiative.description}
                        onChange={(e) => {
                          const updatedInitiatives = [...content.initiatives];
                          updatedInitiatives[index] = {
                            ...initiative,
                            description: e.target.value
                          };
                          setContent({
                            ...content,
                            initiatives: updatedInitiatives
                          });
                        }}
                        rows={3}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        placeholder="Beschreibung der Initiative"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const updatedInitiatives = content.initiatives.filter(
                          (_, i) => i !== index
                        );
                        setContent({
                          ...content,
                          initiatives: updatedInitiatives
                        });
                      }}
                      className="ml-4 rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Zertifizierungen</h2>
              <button
                onClick={() => {
                  const newCertification: Certification = {
                    id: Date.now().toString(),
                    name: 'Neue Zertifizierung',
                    description: 'Beschreibung der Zertifizierung',
                    image: 'https://images.unsplash.com/photo-1584283367830-7875dd4543a6?w=800'
                  };
                  setContent({
                    ...content,
                    certifications: [...content.certifications, newCertification]
                  });
                }}
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent-dark"
              >
                <Plus className="h-4 w-4" />
                Zertifizierung hinzufügen
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {content.certifications.map((cert, index) => (
                <div
                  key={cert.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={cert.image}
                        alt={cert.name}
                        className="h-full w-full object-cover"
                      />
                      <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                        <Upload className="h-4 w-4" />
                        <span>Bild ändern</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const updatedCertifications = [...content.certifications];
                                updatedCertifications[index] = {
                                  ...cert,
                                  image: reader.result as string
                                };
                                setContent({
                                  ...content,
                                  certifications: updatedCertifications
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex-1 space-y-4">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const updatedCertifications = [...content.certifications];
                          updatedCertifications[index] = {
                            ...cert,
                            name: e.target.value
                          };
                          setContent({
                            ...content,
                            certifications: updatedCertifications
                          });
                        }}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        placeholder="Name der Zertifizierung"
                      />
                      <textarea
                        value={cert.description}
                        onChange={(e) => {
                          const updatedCertifications = [...content.certifications];
                          updatedCertifications[index] = {
                            ...cert,
                            description: e.target.value
                          };
                          setContent({
                            ...content,
                            certifications: updatedCertifications
                          });
                        }}
                        rows={3}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        placeholder="Beschreibung der Zertifizierung"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const updatedCertifications = content.certifications.filter(
                          (_, i) => i !== index
                        );
                        setContent({
                          ...content,
                          certifications: updatedCertifications
                        });
                      }}
                      className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

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
                    setContent({
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
                    setContent({
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
                      setContent({
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
                      setContent({
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
        </div>
      </Container>
    </div>
  );
}
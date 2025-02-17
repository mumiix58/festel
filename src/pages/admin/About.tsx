import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Upload, Plus, Trash2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAbout } from '@/hooks/useAbout';
import { v4 as uuidv4 } from 'uuid';
import { SectionSaveButton } from '@/components/admin/SectionSaveButton';

export function About() {
  const { content, loading, error, updateContent, saveContent, hasUnsavedChanges } = useAbout();
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
      const success = await saveContent();
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

  const handleImageUpload = async (file: File, section: string, id?: string) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        
        if (!content) return;

        if (section === 'hero') {
          updateContent({
            ...content,
            hero: { ...content.hero, image: imageUrl }
          });
        } else if (section === 'story') {
          updateContent({
            ...content,
            story: { ...content.story, image: imageUrl }
          });
        } else if (section === 'team' && id) {
          const updatedTeam = content.team.map(member =>
            member.id === id ? { ...member, image: imageUrl } : member
          );
          updateContent({
            ...content,
            team: updatedTeam
          });
        }
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

  const handleAddTeamMember = () => {
    if (!content) return;

    const newMember = {
      id: uuidv4(),
      name: 'Neues Teammitglied',
      role: 'Position',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      description: 'Beschreibung hier eingeben'
    };

    updateContent({
      ...content,
      team: [...content.team, newMember]
    });
  };

  const handleRemoveTeamMember = (memberId: string) => {
    if (!content) return;

    if (window.confirm('Möchten Sie dieses Teammitglied wirklich entfernen?')) {
      updateContent({
        ...content,
        team: content.team.filter(member => member.id !== memberId)
      });
    }
  };

  const handleAddValue = () => {
    if (!content) return;

    const newValue = {
      id: uuidv4(),
      title: 'Neuer Wert',
      description: 'Beschreibung hier eingeben'
    };

    updateContent({
      ...content,
      values: [...content.values, newValue]
    });
  };

  const handleRemoveValue = (valueId: string) => {
    if (!content) return;

    if (window.confirm('Möchten Sie diesen Wert wirklich entfernen?')) {
      updateContent({
        ...content,
        values: content.values.filter(value => value.id !== valueId)
      });
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
          <h1 className="font-display text-3xl font-bold">Über Uns verwalten</h1>
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

        <div className="mt-8 space-y-8">
          {/* Hero Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Hero Bereich</h2>
              <SectionSaveButton
                endpoint="/api/content/about/hero"
                data={content.hero}
                sectionName="Hero"
              />
            </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hero Bild
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <img
                    src={content.hero.image}
                    alt="Hero"
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
                        if (file) handleImageUpload(file, 'hero');
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Geschichte</h2>
              <SectionSaveButton
                endpoint="/api/content/about/story"
                data={content.story}
                sectionName="Geschichte"
              />
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Titel
                </label>
                <input
                  type="text"
                  value={content.story.title}
                  onChange={(e) =>
                    updateContent({
                      ...content,
                      story: { ...content.story, title: e.target.value }
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Inhalt
                </label>
                <textarea
                  value={content.story.content}
                  onChange={(e) =>
                    updateContent({
                      ...content,
                      story: { ...content.story, content: e.target.value }
                    })
                  }
                  rows={6}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bild
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <img
                    src={content.story.image}
                    alt="Story"
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
                        if (file) handleImageUpload(file, 'story');
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Unsere Werte</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddValue}
                  className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent-dark"
                >
                  <Plus className="h-4 w-4" />
                  Wert hinzufügen
                </button>
                <SectionSaveButton
                  endpoint="/api/content/about/values"
                  data={content.values}
                  sectionName="Werte"
                />
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {content.values.map((value, index) => (
                <div
                  key={value.id}
                  className="relative rounded-lg border border-gray-200 p-4"
                >
                  <button
                    onClick={() => handleRemoveValue(value.id)}
                    className="absolute right-4 top-4 rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Titel
                      </label>
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) => {
                          const updatedValues = [...content.values];
                          updatedValues[index] = {
                            ...value,
                            title: e.target.value
                          };
                          updateContent({
                            ...content,
                            values: updatedValues
                          });
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Beschreibung
                      </label>
                      <textarea
                        value={value.description}
                        onChange={(e) => {
                          const updatedValues = [...content.values];
                          updatedValues[index] = {
                            ...value,
                            description: e.target.value
                          };
                          updateContent({
                            ...content,
                            values: updatedValues
                          });
                        }}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Team</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddTeamMember}
                  className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent-dark"
                >
                  <Plus className="h-4 w-4" />
                  Teammitglied hinzufügen
                </button>
                <SectionSaveButton
                  endpoint="/api/content/about/team"
                  data={content.team}
                  sectionName="Team"
                />
              </div>
            </div>
            <div className="mt-4 space-y-6">
              {content.team.map((member, index) => (
                <div
                  key={member.id}
                  className="relative rounded-lg border border-gray-200 p-4"
                >
                  <button
                    onClick={() => handleRemoveTeamMember(member.id)}
                    className="absolute right-4 top-4 rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => {
                            const updatedTeam = [...content.team];
                            updatedTeam[index] = {
                              ...member,
                              name: e.target.value
                            };
                            updateContent({
                              ...content,
                              team: updatedTeam
                            });
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Position
                        </label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => {
                            const updatedTeam = [...content.team];
                            updatedTeam[index] = {
                              ...member,
                              role: e.target.value
                            };
                            updateContent({
                              ...content,
                              team: updatedTeam
                            });
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Beschreibung
                        </label>
                        <textarea
                          value={member.description}
                          onChange={(e) => {
                            const updatedTeam = [...content.team];
                            updatedTeam[index] = {
                              ...member,
                              description: e.target.value
                            };
                            updateContent({
                              ...content,
                              team: updatedTeam
                            });
                          }}
                          rows={3}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Foto
                      </label>
                      <div className="mt-2">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-48 w-48 rounded-full object-cover"
                        />
                        <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
                          <Upload className="h-4 w-4" />
                          <span>Foto ändern</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'team', member.id);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SEO Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">SEO Einstellungen</h2>
              <SectionSaveButton
                endpoint="/api/content/about/seo"
                data={content.seo}
                sectionName="SEO"
              />
            </div>
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
import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Save, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function CateringAndMore() {
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      // Save to backend/storage
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
          <h1 className="font-display text-3xl font-bold">Catering AND MORE verwalten</h1>
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
          {/* Category Management Links */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              to="/admin/equipment"
              className="flex items-center justify-between rounded-lg bg-white p-6 shadow-lg transition-colors hover:bg-gray-50"
            >
              <div>
                <h3 className="font-display text-xl font-semibold">Equipment</h3>
                <p className="mt-1 text-gray-600">Verwalten Sie die Equipment-Kategorien und Artikel</p>
              </div>
              <ArrowRight className="h-5 w-5 text-accent" />
            </Link>

            <Link
              to="/admin/tischwasche"
              className="flex items-center justify-between rounded-lg bg-white p-6 shadow-lg transition-colors hover:bg-gray-50"
            >
              <div>
                <h3 className="font-display text-xl font-semibold">Tischwäsche</h3>
                <p className="mt-1 text-gray-600">Verwalten Sie die Tischwäsche-Kategorien und Artikel</p>
              </div>
              <ArrowRight className="h-5 w-5 text-accent" />
            </Link>
          </div>

          {/* Page Content Settings */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Seiteneinstellungen</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Seitentitel
                </label>
                <input
                  type="text"
                  defaultValue="Catering AND MORE"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Beschreibung
                </label>
                <textarea
                  defaultValue="Entdecken Sie unsere professionelle Ausstattung für Ihre Veranstaltung"
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
            </div>
          </section>

          {/* SEO Settings */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">SEO Einstellungen</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <input
                  type="text"
                  defaultValue="Catering AND MORE | FEST'LMACHER"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  defaultValue="Professionelle Ausstattung und Equipment für Ihre Veranstaltung. Entdecken Sie unser umfangreiches Angebot an Catering-Equipment und Tischwäsche."
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
                  defaultValue="catering equipment, tischwäsche, catering ausstattung, event equipment"
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
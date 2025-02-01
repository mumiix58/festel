import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TischwascheItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export function Tischwasche() {
  const [items, setItems] = useState<TischwascheItem[]>([]);
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

  const handleImageUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Handle image upload
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

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Tischwäsche verwalten</h1>
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
          {/* Tischwäsche items management will go here */}
          <div className="text-center text-gray-500">
            Tischwäsche-Verwaltung wird hier implementiert
          </div>
        </div>
      </Container>
    </div>
  );
}
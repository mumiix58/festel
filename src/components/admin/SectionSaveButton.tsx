import { Save } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { showToast } from '@/lib/toast';
import api from '@/lib/api';

interface SectionSaveButtonProps {
  endpoint: string;
  data: any;
  sectionName: string;
  onSaveSuccess?: () => void;
}

export function SectionSaveButton({ endpoint, data, sectionName, onSaveSuccess }: SectionSaveButtonProps) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(endpoint, data);
      showToast.success(`${sectionName} erfolgreich in MongoDB gespeichert`);
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      showToast.error(`Fehler beim Speichern von ${sectionName}`);
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.button
      onClick={handleSave}
      disabled={saving}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
    >
      <Save className="h-4 w-4" />
      {saving ? 'Wird gespeichert...' : `${sectionName} speichern`}
    </motion.button>
  );
}
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
  hasUnsavedChanges?: boolean;
}

export function SectionSaveButton({ 
  endpoint, 
  data, 
  sectionName, 
  onSaveSuccess,
  hasUnsavedChanges = false 
}: SectionSaveButtonProps) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving || !hasUnsavedChanges) return;
    
    setSaving(true);
    showToast.loading(`Saving ${sectionName}...`);

    try {
      // Remove /api prefix as it's handled by the proxy
      const cleanEndpoint = endpoint.replace('/api/', '/');
      
      // Add retry logic
      let retries = 3;
      let success = false;
      let lastError;

      while (retries > 0 && !success) {
        try {
          await api.put(cleanEndpoint, data);
          success = true;
          showToast.success(`${sectionName} erfolgreich gespeichert`);
          if (onSaveSuccess) {
            onSaveSuccess();
          }
        } catch (error) {
          lastError = error;
          retries--;
          if (retries > 0) {
            // Wait longer between each retry
            await new Promise(resolve => setTimeout(resolve, 2000 * (3 - retries)));
          }
        }
      }

      if (!success && lastError) {
        throw lastError;
      }
    } catch (error) {
      console.error('Save error:', error);
      showToast.error(`Fehler beim Speichern von ${sectionName}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.button
      onClick={handleSave}
      disabled={saving || !hasUnsavedChanges}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors ${
        hasUnsavedChanges ? 'bg-accent hover:bg-accent-dark' : 'bg-gray-400'
      } disabled:opacity-50`}
    >
      <Save className="h-4 w-4" />
      {saving ? 'Wird gespeichert...' : `${sectionName} speichern`}
    </motion.button>
  );
}
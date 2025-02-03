import { useState, useCallback } from 'react';
import { Save, Undo, Redo } from 'lucide-react';
import { PageContent } from '@/types';
import { PagePreview } from './PagePreview';

interface PageEditorProps {
  pageId: string;
  content: PageContent;
  onSave: (content: PageContent) => Promise<void>;
  saving: boolean;
  saveMessage?: {
    type: 'success' | 'error';
    text: string;
  } | null;
}

export function PageEditor({ pageId, content, onSave, saving, saveMessage }: PageEditorProps) {
  const [editingContent, setEditingContent] = useState(content);
  const [history, setHistory] = useState([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleContentUpdate = useCallback((updatedContent: PageContent) => {
    setEditingContent(updatedContent);
    // Add to history
    setHistory(prev => [...prev.slice(0, historyIndex + 1), updatedContent]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setEditingContent(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setEditingContent(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const handleSave = async () => {
    if (saving) return;
    await onSave(editingContent);
  };

  return (
    <div className="relative min-h-screen">
      {saveMessage && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-lg p-4 shadow-lg ${
            saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={handleUndo}
          disabled={historyIndex === 0}
          className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-white shadow-lg transition-colors hover:bg-gray-700 disabled:opacity-50"
        >
          <Undo className="h-4 w-4" />
          Rückgängig
        </button>
        <button
          onClick={handleRedo}
          disabled={historyIndex === history.length - 1}
          className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-white shadow-lg transition-colors hover:bg-gray-700 disabled:opacity-50"
        >
          <Redo className="h-4 w-4" />
          Wiederholen
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white shadow-lg transition-colors hover:bg-accent-dark disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
        </button>
      </div>
      <PagePreview content={editingContent} onUpdate={handleContentUpdate} />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Upload, Trash2, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { SlideContent } from '@/types';
import { getAllSlides, addSlide, updateSlide, deleteSlide, reorderSlides } from '@/lib/slider';

interface UploadProgress {
  total: number;
  current: number;
  status: string;
}

export function Slider() {
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const loadedSlides = await getAllSlides();
      setSlides(loadedSlides.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading slides:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Laden der Slides'
      });
    }
  };

  const handleAddSlide = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setUploading(true);
    setSaveMessage(null);
    setUploadProgress({
      total: files.length,
      current: 0,
      status: 'Initialisiere Upload...'
    });

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(prev => ({
          total: prev?.total || files.length,
          current: i + 1,
          status: `Lade Bild ${i + 1} von ${files.length} hoch...`
        }));

        await addSlide(file);
        
        // Simulate a slight delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      await loadSlides();
      setSaveMessage({
        type: 'success',
        text: `${files.length} Slide${files.length > 1 ? 's' : ''} erfolgreich hinzugefügt`
      });
    } catch (error) {
      console.error('Error adding slides:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Hinzufügen der Slides'
      });
    } finally {
      setUploading(false);
      setUploadProgress(null);
      event.target.value = '';
    }
  };

  const handleUpdateSlide = async (slideId: string, updates: Partial<SlideContent>) => {
    try {
      await updateSlide(slideId, updates);
      await loadSlides();
      setSaveMessage({
        type: 'success',
        text: 'Slide erfolgreich aktualisiert'
      });
    } catch (error) {
      console.error('Error updating slide:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Aktualisieren des Slides'
      });
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!window.confirm('Möchten Sie diesen Slide wirklich löschen?')) return;

    try {
      await deleteSlide(slideId);
      await loadSlides();
      setSaveMessage({
        type: 'success',
        text: 'Slide erfolgreich gelöscht'
      });
    } catch (error) {
      console.error('Error deleting slide:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Löschen des Slides'
      });
    }
  };

  const handleReorderSlide = async (slideId: string, direction: 'up' | 'down') => {
    try {
      await reorderSlides(slideId, direction);
      await loadSlides();
    } catch (error) {
      console.error('Error reordering slides:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Neuordnen der Slides'
      });
    }
  };

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Hero Slider verwalten</h1>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark disabled:opacity-50">
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Wird hochgeladen...' : 'Slide hinzufügen'}</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleAddSlide}
              disabled={uploading}
            />
          </label>
        </div>

        {uploadProgress && (
          <div className="mt-4 rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {uploadProgress.status}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {uploadProgress.current} von {uploadProgress.total}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{
                  width: `${(uploadProgress.current / uploadProgress.total) * 100}%`
                }}
              />
            </div>
          </div>
        )}

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

        <div className="mt-8 space-y-6">
          {slides.map((slide) => (
            <motion.div
              key={slide.id}
              layout
              className="rounded-lg bg-white p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingSlide === slide.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Titel
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) =>
                            handleUpdateSlide(slide.id, { title: e.target.value })
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
                          value={slide.subtitle}
                          onChange={(e) =>
                            handleUpdateSlide(slide.id, { subtitle: e.target.value })
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={slide.buttonText}
                          onChange={(e) =>
                            handleUpdateSlide(slide.id, { buttonText: e.target.value })
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
                          value={slide.buttonLink}
                          onChange={(e) =>
                            handleUpdateSlide(slide.id, { buttonLink: e.target.value })
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={slide.showLogo}
                            onChange={(e) =>
                              handleUpdateSlide(slide.id, { showLogo: e.target.checked })
                            }
                            className="rounded border-gray-300 text-accent focus:ring-accent"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Logo anzeigen
                          </span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-display text-xl font-semibold">
                        {slide.title}
                      </h3>
                      <p className="mt-2 text-gray-600">{slide.subtitle}</p>
                      {slide.showLogo && (
                        <p className="mt-2 text-sm text-accent">Logo wird angezeigt</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <button
                    onClick={() => handleReorderSlide(slide.id, 'up')}
                    disabled={slide.order === 0}
                    className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleReorderSlide(slide.id, 'down')}
                    disabled={slide.order === slides.length - 1}
                    className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setEditingSlide(editingSlide === slide.id ? null : slide.id)
                    }
                    className="rounded p-2 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="rounded p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-48 w-full rounded-lg object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Upload, Trash2, Edit, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageContent } from '@/types';
import { getAllGalleryImages, addGalleryImage, deleteGalleryImage, updateImageMetadata } from '@/lib/gallery';

export function Gallery() {
  const [images, setImages] = useState<ImageContent[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; alt: string }>({ title: '', alt: '' });
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      console.log('Loading gallery images...');
      const allImages = await getAllGalleryImages();
      console.log(`Loaded ${allImages.length} images`);
      setImages(allImages);
    } catch (error) {
      console.error('Error loading images:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Laden der Bilder'
      });
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setUploading(true);
    setSaveMessage(null);

    try {
      console.log(`Uploading ${files.length} images...`);
      const results = await Promise.allSettled(
        Array.from(files).map(file => addGalleryImage(file))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      setSaveMessage({
        type: successful > 0 ? 'success' : 'error',
        text: `${successful} von ${files.length} Bildern erfolgreich hochgeladen${
          failed > 0 ? `, ${failed} fehlgeschlagen` : ''
        }`
      });

      await loadImages();
    } catch (error) {
      console.error('Upload failed:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Hochladen der Bilder'
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!window.confirm('Möchten Sie dieses Bild wirklich löschen?')) return;

    try {
      await deleteGalleryImage(imageId);
      await loadImages();
      setSaveMessage({
        type: 'success',
        text: 'Bild erfolgreich gelöscht'
      });
    } catch (error) {
      console.error('Delete failed:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Löschen des Bildes'
      });
    }
  };

  const handleEdit = (image: ImageContent) => {
    setEditingImage(image.id);
    setEditForm({
      title: image.title || '',
      alt: image.alt
    });
  };

  const handleSaveEdit = async () => {
    if (!editingImage) return;

    try {
      await updateImageMetadata(editingImage, {
        title: editForm.title,
        alt: editForm.alt
      });
      
      await loadImages();
      setEditingImage(null);
      setSaveMessage({
        type: 'success',
        text: 'Änderungen gespeichert'
      });
    } catch (error) {
      console.error('Update failed:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Speichern der Änderungen'
      });
    }
  };

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Galerie verwalten</h1>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark disabled:opacity-50">
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Wird hochgeladen...' : 'Bilder hochladen'}</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
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

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image) => (
            <motion.div
              key={image.id}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-transparent"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover"
              />
              
              {editingImage === image.id ? (
                <div className="absolute inset-0 bg-white p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Titel
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={editForm.alt}
                        onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="rounded-md bg-accent p-2 text-white hover:bg-accent-dark"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingImage(null)}
                        className="rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(image)}
                    className="rounded-full bg-white p-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
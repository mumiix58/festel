import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Upload, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageContent } from '@/types';
import { getAllGalleryImages, addGalleryImage, deleteGalleryImage } from '@/lib/gallery';
import { showToast } from '@/lib/toast';

export function Gallery() {
  const [images, setImages] = useState<ImageContent[]>([]);
  const [uploading, setUploading] = useState(false);
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
      showToast.error('Fehler beim Laden der Bilder');
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
      showToast.error('Fehler beim Hochladen der Bilder');
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
      showToast.success('Bild erfolgreich gelöscht');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast.error('Fehler beim Löschen des Bildes');
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
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
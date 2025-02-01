import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Upload, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageContent } from '@/types';

export function Images() {
  const [images, setImages] = useState<ImageContent[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Placeholder for future implementation
    setImages([]);
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Placeholder for future implementation
    console.log('Upload:', event.target.files);
  };

  const handleDelete = async (imageId: string) => {
    // Placeholder for future implementation
    console.log('Delete:', imageId);
  };

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Bilder verwalten</h1>
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark">
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
        </div>

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
                className="h-full w-full cursor-pointer object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
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

        {images.length === 0 && (
          <div className="mt-8 text-center text-gray-500">
            Keine Bilder vorhanden
          </div>
        )}
      </Container>
    </div>
  );
}
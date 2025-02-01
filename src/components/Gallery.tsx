import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gallery as PhotoSwipeGallery } from 'react-photoswipe-gallery';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllGalleryImages } from '@/lib/gallery';
import { ImageContent } from '@/types';
import 'photoswipe/dist/photoswipe.css';

export function Gallery() {
  const [currentImage, setCurrentImage] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [galleryImages, setGalleryImages] = useState<ImageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imagesPerPage = {
    mobile: 3,
    tablet: 4,
    desktop: 6
  };

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const images = await getAllGalleryImages();
      setGalleryImages(images);
    } catch (error) {
      console.error('Error loading gallery images:', error);
      setError('Fehler beim Laden der Bilder');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Calculate pagination based on screen size
  const getImagesPerPage = () => {
    if (typeof window === 'undefined') return imagesPerPage.desktop;
    if (window.innerWidth < 640) return imagesPerPage.mobile;
    if (window.innerWidth < 1024) return imagesPerPage.tablet;
    return imagesPerPage.desktop;
  };

  const currentImagesPerPage = getImagesPerPage();
  const totalPages = Math.ceil(galleryImages.length / currentImagesPerPage);
  const startIndex = (currentPage - 1) * currentImagesPerPage;
  const endIndex = startIndex + currentImagesPerPage;
  const currentImages = galleryImages.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="text-center">
        <p>Laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-800">
        <p>{error}</p>
        <button
          onClick={loadImages}
          className="mt-2 rounded-md bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <PhotoSwipeGallery>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div
          variants={containerVariants}
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
        >
          {currentImages.map((image, index) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setCurrentImage(startIndex + index)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-full items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    Vergrößern
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="hidden items-center gap-2 sm:flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-full transition-colors ${
                    currentPage === page
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              <span className="text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </motion.div>

      {currentImage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            onClick={() => setCurrentImage(null)}
            className="absolute right-4 top-4 text-white hover:text-gray-300"
          >
            ✕
          </button>
          <button
            onClick={() => setCurrentImage(Math.max(0, currentImage - 1))}
            className="absolute left-4 text-white hover:text-gray-300"
            disabled={currentImage === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <img
            src={galleryImages[currentImage].url}
            alt={galleryImages[currentImage].alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <button
            onClick={() =>
              setCurrentImage(
                Math.min(galleryImages.length - 1, currentImage + 1)
              )
            }
            className="absolute right-4 text-white hover:text-gray-300"
            disabled={currentImage === galleryImages.length - 1}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </PhotoSwipeGallery>
  );
}
import { useState, useCallback } from 'react';
import { Container } from '@/components/ui/Container';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Plus, Trash2, GripVertical, ArrowRight } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { PageContent, PageSection } from '@/types';
import { optimizeImage } from '@/lib/imageUtils';
import { Link } from 'react-router-dom';

interface PagePreviewProps {
  content: PageContent;
  onUpdate: (content: PageContent) => void;
}

export function PagePreview({ content, onUpdate }: PagePreviewProps) {
  const [draggingSection, setDraggingSection] = useState<string | null>(null);

  const handleSectionUpdate = useCallback((sectionId: string, updates: Partial<PageSection>) => {
    onUpdate({
      ...content,
      sections: content.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    });
  }, [content, onUpdate]);

  const handleImageUpload = useCallback(async (sectionId: string, file: File) => {
    try {
      const optimizedImage = await optimizeImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const section = content.sections.find(s => s.id === sectionId);
        
        if (section) {
          const newImage = {
            id: Date.now().toString(),
            url: imageUrl,
            alt: file.name,
            title: file.name
          };

          handleSectionUpdate(sectionId, {
            images: [...(section.images || []), newImage]
          });
        }
      };
      reader.readAsDataURL(optimizedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [content.sections, handleSectionUpdate]);

  const handleSectionReorder = useCallback((reorderedSections: PageSection[]) => {
    onUpdate({
      ...content,
      sections: reorderedSections
    });
  }, [content, onUpdate]);

  const handleDeleteImage = useCallback((sectionId: string, imageId: string) => {
    const section = content.sections.find(s => s.id === sectionId);
    if (section && section.images) {
      handleSectionUpdate(sectionId, {
        images: section.images.filter(img => img.id !== imageId)
      });
    }
  }, [content.sections, handleSectionUpdate]);

  const handleAddItem = useCallback((sectionId: string, type: 'service' | 'stat' | 'gallery' | 'testimonial') => {
    const section = content.sections.find(s => s.id === sectionId);
    if (section) {
      const newItem = {
        id: Date.now().toString(),
        title: type === 'service' ? 'Neue Dienstleistung' : 
              type === 'stat' ? '0' : 
              type === 'gallery' ? 'Neues Bild' : 'Neues Testimonial',
        description: 'Beschreibung hier eingeben'
      };

      handleSectionUpdate(sectionId, {
        items: [...(section.items || []), newItem]
      });
    }
  }, [content.sections, handleSectionUpdate]);

  const handleDeleteItem = useCallback((sectionId: string, itemId: string) => {
    const section = content.sections.find(s => s.id === sectionId);
    if (section && section.items) {
      handleSectionUpdate(sectionId, {
        items: section.items.filter(item => item.id !== itemId)
      });
    }
  }, [content.sections, handleSectionUpdate]);

  const renderSectionControls = (sectionId: string) => (
    <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
      <button
        className="cursor-move rounded-full bg-white/80 p-2 text-gray-700 backdrop-blur-sm hover:bg-white"
        onMouseDown={() => setDraggingSection(sectionId)}
        onMouseUp={() => setDraggingSection(null)}
      >
        <GripVertical className="h-4 w-4" />
      </button>
    </div>
  );

  const renderHeroSection = (section: PageSection) => (
    <section className="relative">
      {renderSectionControls(section.id)}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className="hero-slider"
      >
        {section.images?.map((slide, slideIndex) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              <img
                src={slide.url}
                alt={slide.alt}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50">
                <Container className="flex h-full items-center">
                  <div className="hero-content max-w-2xl text-white">
                    <input
                      type="text"
                      value={slide.title || ''}
                      onChange={(e) => {
                        const updatedImages = [...(section.images || [])];
                        updatedImages[slideIndex] = {
                          ...slide,
                          title: e.target.value
                        };
                        handleSectionUpdate(section.id, { images: updatedImages });
                      }}
                      className="block w-full bg-transparent font-display text-4xl font-bold focus:outline-none sm:text-5xl"
                      placeholder="Slide Titel"
                    />
                    <input
                      type="text"
                      value={slide.description || ''}
                      onChange={(e) => {
                        const updatedImages = [...(section.images || [])];
                        updatedImages[slideIndex] = {
                          ...slide,
                          description: e.target.value
                        };
                        handleSectionUpdate(section.id, { images: updatedImages });
                      }}
                      className="mt-4 block w-full bg-transparent text-xl focus:outline-none"
                      placeholder="Slide Beschreibung"
                    />
                    <button
                      onClick={() => handleDeleteImage(section.id, slide.id)}
                      className="mt-4 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Slide löschen
                    </button>
                  </div>
                </Container>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute bottom-4 right-4 z-10">
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg hover:bg-gray-50">
          <Plus className="h-4 w-4" />
          Slide hinzufügen
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(section.id, file);
            }}
          />
        </label>
      </div>
    </section>
  );

  const renderStatsSection = (section: PageSection) => (
    <section className="relative bg-accent py-8 text-white sm:py-12">
      {renderSectionControls(section.id)}
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {section.items?.map((stat, statIndex) => (
            <div key={stat.id} className="relative text-center">
              <button
                onClick={() => handleDeleteItem(section.id, stat.id)}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={stat.value}
                onChange={(e) => {
                  const updatedItems = [...(section.items || [])];
                  updatedItems[statIndex] = { ...stat, value: e.target.value };
                  handleSectionUpdate(section.id, { items: updatedItems });
                }}
                className="block w-full bg-transparent text-center text-3xl font-bold focus:outline-none sm:text-4xl"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => {
                  const updatedItems = [...(section.items || [])];
                  updatedItems[statIndex] = { ...stat, label: e.target.value };
                  handleSectionUpdate(section.id, { items: updatedItems });
                }}
                className="mt-2 block w-full bg-transparent text-center text-sm font-medium focus:outline-none"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => handleAddItem(section.id, 'stat')}
          className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-accent shadow-lg hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          Statistik hinzufügen
        </button>
      </Container>
    </section>
  );

  const renderServicesSection = (section: PageSection) => (
    <section className="relative bg-gray-50 py-16 sm:py-24">
      {renderSectionControls(section.id)}
      <Container>
        <div className="text-center">
          <input
            type="text"
            value={section.title || ''}
            onChange={(e) => handleSectionUpdate(section.id, { title: e.target.value })}
            className="block w-full bg-transparent text-center font-display text-3xl font-bold focus:outline-none"
            placeholder="Sektionsüberschrift"
          />
          <input
            type="text"
            value={section.subtitle || ''}
            onChange={(e) => handleSectionUpdate(section.id, { subtitle: e.target.value })}
            className="mt-4 block w-full bg-transparent text-center text-lg text-gray-600 focus:outline-none"
            placeholder="Untertitel"
          />
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {section.items?.map((service, serviceIndex) => (
            <div key={service.id} className="relative">
              <button
                onClick={() => handleDeleteItem(section.id, service.id)}
                className="absolute -right-2 -top-2 z-10 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                <div className="relative aspect-[4/3]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                  <label className="absolute bottom-4 right-4 flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg hover:bg-gray-50">
                    <Plus className="h-4 w-4" />
                    Bild ändern
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const optimizedImage = await optimizeImage(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const updatedItems = [...(section.items || [])];
                            updatedItems[serviceIndex] = {
                              ...service,
                              image: reader.result as string
                            };
                            handleSectionUpdate(section.id, { items: updatedItems });
                          };
                          reader.readAsDataURL(optimizedImage);
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="p-6">
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => {
                      const updatedItems = [...(section.items || [])];
                      updatedItems[serviceIndex] = {
                        ...service,
                        title: e.target.value
                      };
                      handleSectionUpdate(section.id, { items: updatedItems });
                    }}
                    className="block w-full font-display text-xl font-semibold focus:outline-none"
                    placeholder="Dienstleistungstitel"
                  />
                  <input
                    type="text"
                    value={service.description}
                    onChange={(e) => {
                      const updatedItems = [...(section.items || [])];
                      updatedItems[serviceIndex] = {
                        ...service,
                        description: e.target.value
                      };
                      handleSectionUpdate(section.id, { items: updatedItems });
                    }}
                    className="mt-2 block w-full text-gray-600 focus:outline-none"
                    placeholder="Beschreibung"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleAddItem(section.id, 'service')}
          className="mx-auto mt-8 flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-accent-dark"
        >
          <Plus className="h-4 w-4" />
          Dienstleistung hinzufügen
        </button>
      </Container>
    </section>
  );

  const renderGallerySection = (section: PageSection) => (
    <section className="relative py-16 sm:py-24">
      {renderSectionControls(section.id)}
      <Container>
        <div className="text-center">
          <input
            type="text"
            value={section.title || ''}
            onChange={(e) => handleSectionUpdate(section.id, { title: e.target.value })}
            className="block w-full bg-transparent text-center font-display text-3xl font-bold focus:outline-none"
            placeholder="Sektionsüberschrift"
          />
          <input
            type="text"
            value={section.subtitle || ''}
            onChange={(e) => handleSectionUpdate(section.id, { subtitle: e.target.value })}
            className="mt-4 block w-full bg-transparent text-center text-lg text-gray-600 focus:outline-none"
            placeholder="Untertitel"
          />
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {section.images?.map((image) => (
            <div key={image.id} className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg">
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleDeleteImage(section.id, image.id)}
                  className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <label className="flex aspect-[4/3] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            <div className="text-center">
              <Plus className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-600">
                Bild hinzufügen
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(section.id, file);
              }}
            />
          </label>
        </div>
      </Container>
    </section>
  );

  const renderCtaSection = (section: PageSection) => (
    <section className="relative bg-accent py-16 text-white sm:py-24">
      {renderSectionControls(section.id)}
      <Container>
        <div className="text-center">
          <input
            type="text"
            value={section.title || ''}
            onChange={(e) => handleSectionUpdate(section.id, { title: e.target.value })}
            className="block w-full bg-transparent text-center font-display text-3xl font-bold focus:outline-none sm:text-4xl"
            placeholder="CTA Überschrift"
          />
          <textarea
            value={section.content || ''}
            onChange={(e) => handleSectionUpdate(section.id, { content: e.target.value })}
            className="mx-auto mt-4 block w-full max-w-2xl bg-transparent text-center text-lg focus:outline-none"
            placeholder="CTA Beschreibung"
            rows={3}
          />
          <div className="mt-8">
            <input
              type="text"
              value={section.buttonText || ''}
              onChange={(e) => handleSectionUpdate(section.id, { buttonText: e.target.value })}
              className="mx-auto block w-auto bg-transparent text-center font-semibold focus:outline-none"
              placeholder="Button Text"
            />
          </div>
        </div>
      </Container>
    </section>
  );

  return (
    <div className="min-h-screen bg-white">
      <Reorder.Group
        axis="y"
        values={content.sections}
        onReorder={handleSectionReorder}
      >
        {content.sections.map((section) => (
          <Reorder.Item
            key={section.id}
            value={section}
            className={`relative ${
              draggingSection === section.id ? 'cursor-grabbing' : ''
            }`}
          >
            {section.type === 'hero' && renderHeroSection(section)}
            {section.type === 'stats' && renderStatsSection(section)}
            {section.type === 'services' && renderServicesSection(section)}
            {section.type === 'gallery' && renderGallerySection(section)}
            {section.type === 'cta' && renderCtaSection(section)}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
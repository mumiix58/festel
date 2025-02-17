import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SlideContent } from '@/types';
import { getAllSlides } from '@/lib/slider';
import { useSettings } from '@/hooks/useSettings';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function HeroSlider() {
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSlides = await getAllSlides();
      setSlides(loadedSlides.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Error loading slides:', err);
      setError('Failed to load slides');
      setSlides([{
        id: 'default',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
        title: 'Erstklassiges Catering',
        subtitle: 'Für jeden Anlass die perfekte Lösung',
        buttonText: 'Jetzt anfragen',
        buttonLink: '/kontakt',
        order: 0,
        showLogo: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-screen bg-gray-100" />;
  }

  if (error || slides.length === 0) {
    return (
      <div className="relative h-screen">
        <img
          src="https://images.unsplash.com/photo-1555244162-803834f70033"
          alt="Catering Service"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50">
          <Container className="flex h-full items-center">
            <div className="hero-content max-w-2xl text-white">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display text-4xl font-bold sm:text-5xl"
              >
                Erstklassiges Catering
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-xl"
              >
                Für jeden Anlass die perfekte Lösung
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/kontakt"
                  className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  Jetzt anfragen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <section className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={true}
        className="hero-slider"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50">
                <Container className="flex h-full items-center">
                  <div className="hero-content max-w-2xl text-white">
                    <AnimatePresence mode="wait">
                      {slide.showLogo && settings?.logo && (
                        <motion.img
                          key={`logo-${slide.id}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.5 }}
                          src={settings.logo}
                          alt={settings.company.name}
                          className="mb-8 h-32 w-auto"
                        />
                      )}
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      <motion.h1 
                        key={`title-${slide.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="font-display text-4xl font-bold sm:text-5xl"
                      >
                        {slide.title}
                      </motion.h1>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={`subtitle-${slide.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 text-xl"
                      >
                        {slide.subtitle}
                      </motion.p>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      {slide.buttonText && slide.buttonLink && (
                        <motion.div
                          key={`button-${slide.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <Link
                            to={slide.buttonLink}
                            className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-dark"
                          >
                            {slide.buttonText}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Container>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
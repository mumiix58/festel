import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroSlider } from '@/components/HeroSlider';
import { Gallery } from '@/components/Gallery';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useServices } from '@/hooks/useServices';
import { getHomeContent } from '@/lib/home';
import { HomeContent } from '@/types';
import { SEO } from '@/components/SEO';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function Home() {
  const { content: servicesContent } = useServices();
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const content = await getHomeContent();
        setHomeContent(content);
        setError(null);
      } catch (error) {
        console.error('Error loading home content:', error);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  if (loading || !homeContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Laden...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SEO metadata={homeContent.seo} />

      {/* Hero Section */}
      <HeroSlider />

      {/* Stats Section */}
      <motion.section 
        variants={itemVariants}
        className="bg-accent py-8 text-white sm:py-12"
      >
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homeContent.stats
              .filter(stat => stat.isActive)
              .sort((a, b) => a.order - b.order)
              .map((stat) => (
                <motion.div 
                  key={stat.id}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="text-3xl font-bold sm:text-4xl">{stat.value}</div>
                  <div className="mt-2 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
          </div>
        </Container>
      </motion.section>

      {/* Services Section */}
      {servicesContent && (
        <section className="bg-gray-50 py-16 sm:py-24">
          <Container>
            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <h2 className="font-display text-3xl font-bold">
                {servicesContent.hero.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {servicesContent.hero.subtitle}
              </p>
            </motion.div>

            <div className="mt-16 services-slider">
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
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 30 }
                }}
                slidesPerView={1}
                spaceBetween={16}
              >
                {servicesContent.services
                  .sort((a, b) => a.order - b.order)
                  .map((service) => (
                    <SwiperSlide key={service.id}>
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <div className="h-full overflow-hidden rounded-lg bg-white shadow-lg">
                          <div className="aspect-[4/3]">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="font-display text-xl font-semibold">
                              {service.title}
                            </h3>
                            <p className="mt-2 text-gray-600">
                              {service.description}
                            </p>
                            <Link
                              to={`/dienstleistungen#${service.id}`}
                              className="mt-4 inline-flex items-center text-accent hover:text-accent-dark"
                            >
                              Mehr erfahren
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </Container>
        </section>
      )}

      {/* Gallery Section */}
      <motion.section 
        variants={itemVariants}
        className="py-16 sm:py-24"
      >
        <Container>
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold">Impressionen</h2>
            <p className="mt-4 text-lg text-gray-600">
              Einblicke in unsere Arbeit
            </p>
          </div>
          <div className="mt-16">
            <Gallery />
          </div>
        </Container>
      </motion.section>

      {/* CTA Section */}
      {servicesContent && (
        <motion.section 
          variants={itemVariants}
          className="bg-accent py-16 text-white sm:py-24"
        >
          <Container>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                {servicesContent.cta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg">
                {servicesContent.cta.description}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={servicesContent.cta.buttonLink}
                  className="mt-8 inline-flex items-center rounded-full bg-white px-8 py-3 font-semibold text-accent transition-colors hover:bg-gray-100"
                >
                  {servicesContent.cta.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </Container>
        </motion.section>
      )}
    </motion.div>
  );
}
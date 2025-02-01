import { Container } from '@/components/ui/Container';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useReferences } from '@/hooks/useReferences';
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

export function References() {
  const { content, loading } = useReferences();

  if (loading || !content) {
    return (
      <div className="py-24">
        <Container>
          <div className="text-center">Laden...</div>
        </Container>
      </div>
    );
  }

  const activeTestimonials = content.testimonials
    .filter(testimonial => testimonial.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-24"
    >
      <Container>
        <motion.div variants={itemVariants} className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {content.hero.subtitle}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-16">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            slidesPerView={1}
            spaceBetween={32}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="!pb-12"
          >
            {activeTestimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="h-full rounded-lg bg-white p-6 shadow-lg"
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={testimonial.image}
                      alt={testimonial.event}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="mt-4 flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4">
                    <p className="text-gray-600">{testimonial.quote}</p>
                  </blockquote>
                  <div className="mt-4">
                    <p className="font-display text-lg font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.event}</p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 rounded-lg bg-accent p-8 text-center text-white sm:p-16"
        >
          <h2 className="font-display text-3xl font-bold">
            {content.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg">
            {content.cta.description}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={content.cta.buttonLink}
              className="mt-8 inline-flex items-center rounded-full bg-white px-8 py-3 font-semibold text-accent transition-colors hover:bg-gray-100"
            >
              {content.cta.buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </motion.div>
  );
}
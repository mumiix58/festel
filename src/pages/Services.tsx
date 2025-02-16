import { Container } from '@/components/ui/Container';
import { Check, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useServices } from '@/hooks/useServices';
import { RelatedLinks } from '@/components/RelatedLinks';

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

export function Services() {
  const location = useLocation();
  const servicesRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const { content, loading, error } = useServices();

  const relatedLinks = [
    {
      title: 'Equipment',
      description: 'Entdecken Sie unsere professionelle Ausstattung für Ihre Veranstaltung',
      href: '/catering-and-more/equipment'
    },
    {
      title: 'Tischwäsche',
      description: 'Hochwertige Tischwäsche für jeden Anlass',
      href: '/catering-and-more/tischwasche'
    },
    {
      title: 'Bio & Nachhaltigkeit',
      description: 'Erfahren Sie mehr über unser Engagement für Nachhaltigkeit',
      href: '/bio-nachhaltigkeit'
    }
  ];

  useEffect(() => {
    const hash = location.hash.slice(1);
    
    if (hash && location.state?.scrollToService) {
      const element = servicesRef.current[hash];
      if (element) {
        setTimeout(() => {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location]);

  if (loading) {
    return (
      <div className="py-24">
        <Container>
          <div className="text-center">Laden...</div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24">
        <Container>
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        </Container>
      </div>
    );
  }

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

        <motion.div variants={containerVariants} className="mt-16 space-y-16">
          {content.services
            .sort((a, b) => a.order - b.order)
            .map((service, index) => (
              <motion.section
                key={service.id}
                id={service.id}
                ref={el => servicesRef.current[service.id] = el}
                variants={itemVariants}
                className={`grid gap-8 lg:grid-cols-2 lg:items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <h2 className="font-display text-3xl font-bold">{service.title}</h2>
                  <p className="mt-4 text-lg text-gray-600">{service.description}</p>
                  <ul className="mt-8 space-y-4">
                    {service.features.map((feature) => (
                      <motion.li
                        key={feature}
                        whileHover={{ x: 10 }}
                        className="flex items-center"
                      >
                        <Check className="h-5 w-5 text-accent" />
                        <span className="ml-3">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <Link
                    to={service.buttonLink}
                    className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-3 text-white transition-colors hover:bg-accent-dark"
                  >
                    {service.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                <motion.div
                  className={index % 2 === 1 ? 'lg:col-start-1' : ''}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-lg object-cover shadow-lg transition-transform duration-300 hover:scale-105"
                  />
                </motion.div>
              </motion.section>
            ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 rounded-lg bg-accent p-8 text-center text-white"
        >
          <h2 className="font-display text-3xl font-bold">
            {content.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg">
            {content.cta.description}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
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

        <Container>
          <RelatedLinks links={relatedLinks} />
        </Container>
      </Container>
    </motion.div>
  );
}
import { Container } from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

const equipmentItems = [
  {
    title: 'Geschirr & Besteck',
    description: 'Hochwertiges Porzellan und edles Besteck für jeden Anlass',
    image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800'
  },
  {
    title: 'Gläser',
    description: 'Verschiedene Gläserserien für Wein, Champagner und Cocktails',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'
  },
  {
    title: 'Möbel',
    description: 'Tische, Stühle und Loungemöbel für Ihre Veranstaltung',
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800'
  },
  {
    title: 'Buffet-Ausstattung',
    description: 'Professionelle Buffet-Systeme und Warmhaltegeräte',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
  },
  {
    title: 'Bar-Equipment',
    description: 'Komplette Bar-Ausstattung für Cocktails und Getränkeservice',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'
  },
  {
    title: 'Dekoration',
    description: 'Stilvolle Dekorationselemente für jeden Anlass',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'
  }
];

export function Equipment() {
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
            Equipment
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Professionelle Ausstattung für Ihre Veranstaltung
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {equipmentItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-lg bg-white shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 rounded-lg bg-accent p-8 text-center text-white sm:p-16"
        >
          <h2 className="font-display text-3xl font-bold">
            Professionelle Ausstattung für Ihren Event
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg">
            Kontaktieren Sie uns für ein individuelles Angebot. Wir beraten Sie gerne und stellen Ihnen die perfekte Ausstattung für Ihre Veranstaltung zusammen.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/kontakt"
              className="mt-8 inline-flex items-center rounded-full bg-white px-8 py-3 font-semibold text-accent transition-colors hover:bg-gray-100"
            >
              Jetzt anfragen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </motion.div>
  );
}
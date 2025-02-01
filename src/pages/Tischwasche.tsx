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

const tischwascheItems = [
  {
    title: 'Tischdecken',
    description: 'Hochwertige Tischdecken in verschiedenen Größen und Farben',
    image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800'
  },
  {
    title: 'Servietten',
    description: 'Stoffservietten passend zu Ihrer Veranstaltung',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800'
  },
  {
    title: 'Tischläufer',
    description: 'Elegante Tischläufer für besondere Akzente',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'
  },
  {
    title: 'Stuhlhussen',
    description: 'Passende Stuhlhussen für einen einheitlichen Look',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'
  },
  {
    title: 'Skirting',
    description: 'Professionelle Verkleidung für Buffets und Tische',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'
  },
  {
    title: 'Dekostoffe',
    description: 'Dekorative Stoffe für Ihre individuelle Raumgestaltung',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'
  }
];

export function Tischwasche() {
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
            Tischwäsche
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Hochwertige Tischwäsche für Ihre Veranstaltung
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tischwascheItems.map((item, index) => (
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
            Stilvolle Tischwäsche für jeden Anlass
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg">
            Kontaktieren Sie uns für ein individuelles Angebot. Wir beraten Sie gerne und finden die perfekte Tischwäsche für Ihre Veranstaltung.
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
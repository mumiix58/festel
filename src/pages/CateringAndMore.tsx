import { Container } from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EquipmentCategory } from '@/types';
import { getAllCategories } from '@/lib/equipment';
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

export function CateringAndMore() {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const relatedLinks = [
    {
      title: 'Dienstleistungen',
      description: 'Entdecken Sie unser umfangreiches Angebot an Catering-Services',
      href: '/dienstleistungen'
    },
    {
      title: 'Referenzen',
      description: 'Erfahren Sie, was unsere Kunden über uns sagen',
      href: '/referenzen'
    },
    {
      title: 'Bio & Nachhaltigkeit',
      description: 'Unser Engagement für eine nachhaltige Zukunft',
      href: '/bio-nachhaltigkeit'
    }
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const loadedCategories = await getAllCategories();
      setCategories(loadedCategories.filter(cat => cat.isActive));
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <Container>
          <div className="text-center">Laden...</div>
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
            Catering AND MORE
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Entdecken Sie unsere professionelle Ausstattung für Ihre Veranstaltung
          </p>
        </motion.div>

        {categories.map((category) => (
          <motion.section
            key={category.id}
            variants={itemVariants}
            className="mt-16"
          >
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">{category.name}</h2>
              <p className="mt-2 text-gray-600">{category.description}</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {category.items
                .filter(item => item.isActive)
                .sort((a, b) => a.order - b.order)
                .slice(0, 3) // Only show first 3 items
                .map((item) => (
                  <motion.div
                    key={item.id}
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
            </div>

            {category.items.filter(item => item.isActive).length > 3 && (
              <div className="mt-8 text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={`/catering-and-more/${category.slug}`}
                    className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-white transition-colors hover:bg-accent-dark"
                  >
                    Mehr {category.name} entdecken
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.section>
        ))}

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

        <Container>
          <RelatedLinks links={relatedLinks} />
        </Container>
      </Container>
    </motion.div>
  );
}
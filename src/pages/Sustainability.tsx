import { Container } from '@/components/ui/Container';
import { Leaf, Recycle, Sun, Wind, Droplets, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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

const initiatives = [
  {
    icon: Leaf,
    title: 'Regionale Produkte',
    description: 'Wir arbeiten eng mit lokalen Bauern und Produzenten zusammen, um frische, saisonale Zutaten zu verwenden.'
  },
  {
    icon: Recycle,
    title: 'Abfallmanagement',
    description: 'Unser umfassendes Recycling-Programm und die Verwendung von kompostierbarem Einweggeschirr reduzieren unseren ökologischen Fußabdruck.'
  },
  {
    icon: Sun,
    title: 'Erneuerbare Energie',
    description: 'Unsere Küche wird mit 100% erneuerbarer Energie betrieben.'
  },
  {
    icon: Wind,
    title: 'CO2-Reduktion',
    description: 'Durch optimierte Logistik und E-Fahrzeuge minimieren wir unseren CO2-Ausstoß.'
  },
  {
    icon: Droplets,
    title: 'Wassermanagement',
    description: 'Wir setzen modernste Technologien ein, um unseren Wasserverbrauch zu reduzieren.'
  },
  {
    icon: Heart,
    title: 'Soziales Engagement',
    description: 'Überschüssige Lebensmittel spenden wir an lokale Wohltätigkeitsorganisationen.'
  }
];

const certifications = [
  {
    name: 'Bio-Zertifizierung',
    description: 'Zertifiziert nach EU-Bio-Verordnung',
    image: 'https://images.unsplash.com/photo-1584283367830-7875dd4543a6?w=800'
  },
  {
    name: 'Österreichisches Umweltzeichen',
    description: 'Ausgezeichnet für nachhaltiges Wirtschaften',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'
  },
  {
    name: 'EMAS',
    description: 'Zertifiziertes Umweltmanagement',
    image: 'https://images.unsplash.com/photo-1590212151175-e58edd96185b?w=800'
  }
];

export function Sustainability() {
  const relatedLinks = [
    {
      title: 'Dienstleistungen',
      description: 'Entdecken Sie unser nachhaltiges Catering-Angebot',
      href: '/dienstleistungen'
    },
    {
      title: 'Equipment',
      description: 'Unsere umweltfreundliche Ausstattung für Ihre Veranstaltung',
      href: '/catering-and-more/equipment'
    },
    {
      title: 'Referenzen',
      description: 'Was unsere Kunden über unser nachhaltiges Konzept sagen',
      href: '/referenzen'
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-24"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-accent text-white">
        <Container className="py-24">
          <motion.div variants={itemVariants} className="mx-auto max-w-4xl text-center">
            <h1 className="font-display text-4xl font-bold sm:text-5xl">
              Bio & Nachhaltigkeit
            </h1>
            <p className="mt-6 text-lg">
              Unser Engagement für eine nachhaltige Zukunft: Wir verbinden erstklassiges Catering mit Umweltverantwortung und sozialer Nachhaltigkeit.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Initiatives Section */}
      <section className="py-24">
        <Container>
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="font-display text-3xl font-bold">
              Unsere Nachhaltigkeitsinitiativen
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Wir setzen uns aktiv für Umweltschutz und Nachhaltigkeit ein. Hier sind einige unserer wichtigsten Initiativen:
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {initiatives.map((initiative, index) => {
              const Icon = initiative.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-lg bg-white p-8 shadow-lg"
                >
                  <div className="mb-4 inline-block rounded-full bg-accent/10 p-3 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">
                    {initiative.title}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {initiative.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* Certifications Section */}
      <section className="bg-gray-50 py-24">
        <Container>
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="font-display text-3xl font-bold">
              Zertifizierungen
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Unsere Bemühungen werden durch verschiedene Zertifizierungen bestätigt:
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="overflow-hidden rounded-lg bg-white shadow-lg"
              >
                <div className="aspect-[4/3]">
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold">
                    {cert.name}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {cert.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-24 text-white">
        <Container>
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="font-display text-3xl font-bold">
              Gemeinsam für eine nachhaltige Zukunft
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg">
              Lassen Sie uns gemeinsam Ihre Veranstaltung nachhaltig gestalten.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8"
            >
              <Link
                to="/kontakt"
                className="inline-flex items-center rounded-full bg-white px-8 py-3 font-semibold text-accent transition-colors hover:bg-gray-100"
              >
                Jetzt anfragen
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <Container>
        <RelatedLinks links={relatedLinks} />
      </Container>
    </motion.div>
  );
}
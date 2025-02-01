import { Container } from '@/components/ui/Container';
import { useLegal } from '@/hooks/useLegal';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

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

export function Impressum() {
  const { content, loading } = useLegal();

  if (loading || !content) {
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
        <motion.div variants={itemVariants} className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold">Impressum</h1>
          
          <div className="mt-12 space-y-12">
            {/* Unternehmensangaben */}
            <motion.section variants={itemVariants}>
              <h2 className="font-display text-2xl font-semibold">Unternehmensangaben</h2>
              <div className="mt-4 space-y-2">
                <p className="text-lg">FEST'LMACHER Gastronomie</p>
                <p>DDSG, Handelskai 265</p>
                <p>1220 Wien</p>
                <p>Österreich</p>
              </div>
            </motion.section>

            {/* Kontakt */}
            <motion.section variants={itemVariants}>
              <h2 className="font-display text-2xl font-semibold">Kontakt</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <a 
                    href="tel:+43-699-1600-2800"
                    className="hover:text-accent"
                  >
                    +43 (0)699 – 1600 2800
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <a 
                    href="mailto:catering@festlmacher.at"
                    className="hover:text-accent"
                  >
                    catering@festlmacher.at
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <a 
                    href="https://maps.google.com/?q=Handelskai+265,1220+Wien"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent"
                  >
                    Handelskai 265, 1220 Wien
                  </a>
                </div>
              </div>
            </motion.section>

            {/* Firmenbuch */}
            <motion.section variants={itemVariants}>
              <h2 className="font-display text-2xl font-semibold">Firmenbuch</h2>
              <div className="mt-4 space-y-2">
                <p>Firmenbuchnummer: [Nummer]</p>
                <p>Firmenbuchgericht: [Gericht]</p>
                <p>UID-Nummer: [Nummer]</p>
              </div>
            </motion.section>

            {/* Geschäftsführung */}
            <motion.section variants={itemVariants}>
              <h2 className="font-display text-2xl font-semibold">Geschäftsführung</h2>
              <p className="mt-4">[Name des Geschäftsführers]</p>
            </motion.section>

            {/* Aufsichtsbehörde */}
            <motion.section variants={itemVariants}>
              <h2 className="font-display text-2xl font-semibold">Aufsichtsbehörde</h2>
              <p className="mt-4">Magistratisches Bezirksamt für den [X]. Bezirk</p>
            </motion.section>

            {/* Berufsrecht */}
            <motion.section variants={itemVariants}>
              <h2 className="font-display text-2xl font-semibold">Berufsrecht</h2>
              <div className="mt-4 space-y-2">
                <p>Gewerbeordnung: <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">www.ris.bka.gv.at</a></p>
                <p>Bezirkshauptmannschaft Wien</p>
              </div>
            </motion.section>

            {/* Verbraucherstreitbeilegung */}
            <motion.section variants={itemVariants}>
              <h2 className="font-display text-2xl font-semibold">Verbraucherstreitbeilegung</h2>
              <div className="mt-4 space-y-4">
                <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
                <p>
                  <a 
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </Container>
    </motion.div>
  );
}
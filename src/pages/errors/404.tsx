import { Container } from '@/components/ui/Container';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="font-display text-9xl font-bold text-accent">404</h1>
          <h2 className="mt-8 font-display text-3xl font-bold">
            Seite nicht gefunden
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
          </p>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white transition-colors hover:bg-accent-dark"
              >
                <Home className="h-4 w-4" />
                Zur Startseite
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück
              </button>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
import { Container } from '@/components/ui/Container';
import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFAQ } from '@/hooks/useFAQ';

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

const contentVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { content, loading } = useFAQ();

  if (loading || !content) {
    return (
      <div className="py-24">
        <Container>
          <div className="text-center">Laden...</div>
        </Container>
      </div>
    );
  }

  const activeFAQs = content.faqs
    .filter(faq => faq.isActive)
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

        <motion.div variants={containerVariants} className="mx-auto mt-16 max-w-3xl space-y-4">
          {activeFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              variants={itemVariants}
              className="overflow-hidden rounded-lg bg-white shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                className="flex w-full items-center justify-between p-6 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-display text-lg font-semibold">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-accent" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-accent" />
                  )}
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                  >
                    <div className="border-t border-gray-200 p-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mx-auto mt-16 max-w-2xl text-center"
        >
          <h2 className="font-display text-2xl font-bold">
            {content.cta.title}
          </h2>
          <p className="mt-4 text-gray-600">
            {content.cta.description}
          </p>
           <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={content.cta.buttonLink}
              className="mt-8 inline-flex items-center rounded-full bg-accent px-8 py-3 font-semibold text-white transition-colors hover:bg-accent-dark"
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
import { Container } from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAbout } from '@/hooks/useAbout';

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

export function About() {
  const { content, loading } = useAbout();
  const [ref] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

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
        <motion.div variants={itemVariants} className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {content.hero.subtitle}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-16">
          {/* Story Section */}
          <motion.section 
            ref={ref}
            variants={itemVariants}
            className="grid gap-8 lg:grid-cols-2 lg:items-center"
          >
            <div>
              <h2 className="font-display text-3xl font-bold">{content.story.title}</h2>
              <div className="mt-4 whitespace-pre-wrap text-gray-600">
                {content.story.content}
              </div>
            </div>
            <motion.img
              variants={itemVariants}
              src={content.story.image}
              alt={content.story.title}
              className="rounded-lg object-cover shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </motion.section>

          {/* Values Section */}
          <motion.section 
            variants={itemVariants}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold">Unsere Werte</h2>
            <motion.div 
              variants={containerVariants}
              className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {content.values.map((value) => (
                <motion.div
                  key={value.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg bg-white p-8 shadow-lg"
                >
                  <h3 className="font-display text-xl font-semibold">{value.title}</h3>
                  <p className="mt-4 text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Team Section */}
          <motion.section
            variants={itemVariants}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold">Unser Team</h2>
            <motion.div 
              variants={containerVariants}
              className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {content.team.map((member) => (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="mx-auto h-32 w-32 rounded-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {member.name}
                  </h3>
                  <p className="text-gray-600">{member.role}</p>
                  {member.description && (
                    <p className="mt-2 text-sm text-gray-500">{member.description}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </Container>
    </motion.div>
  );
}
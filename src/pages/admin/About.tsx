import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAbout } from '@/hooks/useAbout';
import { v4 as uuidv4 } from 'uuid';
import { SectionSaveButton } from '@/components/admin/SectionSaveButton';

export function About() {
  const { content, loading, error, updateContent } = useAbout();
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (loading || !content) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center">Laden...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Über Uns verwalten</h1>
        </div>

        {saveMessage && (
          <div
            className={`mt-4 rounded-lg p-4 ${
              saveMessage.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <div className="mt-8 space-y-8">
          {/* Hero Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Hero Bereich</h2>
              <SectionSaveButton
                endpoint="/api/content/about/hero"
                data={content.hero}
                sectionName="Hero"
              />
            </div>
            {/* Hero content fields */}
          </section>

          {/* Story Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Geschichte</h2>
              <SectionSaveButton
                endpoint="/api/content/about/story"
                data={content.story}
                sectionName="Geschichte"
              />
            </div>
            {/* Story content fields */}
          </section>

          {/* Values Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Unsere Werte</h2>
              <SectionSaveButton
                endpoint="/api/content/about/values"
                data={content.values}
                sectionName="Werte"
              />
            </div>
            {/* Values content fields */}
          </section>

          {/* Team Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Team</h2>
              <SectionSaveButton
                endpoint="/api/content/about/team"
                data={content.team}
                sectionName="Team"
              />
            </div>
            {/* Team content fields */}
          </section>

          {/* SEO Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">SEO Einstellungen</h2>
              <SectionSaveButton
                endpoint="/api/content/about/seo"
                data={content.seo}
                sectionName="SEO"
              />
            </div>
            {/* SEO content fields */}
          </section>
        </div>
      </Container>
    </div>
  );
}
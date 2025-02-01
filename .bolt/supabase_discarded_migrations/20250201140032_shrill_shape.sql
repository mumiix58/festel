/*
  # Insert Default Content

  1. Default Content
    - Settings with company info
    - Home page content with stats
    - About page content
    - Services page content
    - FAQ page content
    - References page content

  2. Notes
    - Using jsonb for structured content
    - ON CONFLICT DO NOTHING to prevent duplicate entries
*/

-- Insert default settings
INSERT INTO settings (content)
VALUES (
  jsonb_build_object(
    'logo', 'https://festlmacher.at/logo.webp',
    'company', jsonb_build_object(
      'name', 'FEST''LMACHER Gastronomie',
      'address', jsonb_build_object(
        'street', 'Handelskai 265',
        'city', 'Wien',
        'postalCode', '1020',
        'country', 'Österreich'
      ),
      'contact', jsonb_build_object(
        'phone', '+43 (0)699 – 1600 2800',
        'email', 'catering@festlmacher.at'
      )
    ),
    'social', jsonb_build_object(
      'facebook', 'https://facebook.com/festlmacher',
      'instagram', 'https://instagram.com/festlmacher',
      'linkedin', 'https://linkedin.com/company/festlmacher'
    ),
    'seo', jsonb_build_object(
      'title', 'Fest''lmacher Gastronomie | Ihr Catering Partner in Wien',
      'description', 'Professioneller Catering-Service in Wien für Ihre Veranstaltungen.',
      'keywords', 'catering wien, event catering, hochzeit catering'
    )
  )
) ON CONFLICT DO NOTHING;

-- Insert default home content
INSERT INTO content (page, content)
VALUES (
  'home',
  jsonb_build_object(
    'stats', jsonb_build_array(
      jsonb_build_object(
        'id', 'stat-1',
        'value', '2.500+',
        'label', 'Zufriedene Kunden',
        'order', 0,
        'isActive', true
      ),
      jsonb_build_object(
        'id', 'stat-2',
        'value', '15.000+',
        'label', 'Events durchgeführt',
        'order', 1,
        'isActive', true
      ),
      jsonb_build_object(
        'id', 'stat-3',
        'value', '50+',
        'label', 'Professionelle Mitarbeiter',
        'order', 2,
        'isActive', true
      ),
      jsonb_build_object(
        'id', 'stat-4',
        'value', '20+',
        'label', 'Jahre Erfahrung',
        'order', 3,
        'isActive', true
      )
    ),
    'seo', jsonb_build_object(
      'title', 'FEST''LMACHER Gastronomie | Professionelles Catering in Wien',
      'description', 'Ihr Partner für erstklassiges Catering in Wien. ✓ 20+ Jahre Erfahrung ✓ 2.500+ zufriedene Kunden',
      'keywords', 'catering wien, event catering, hochzeit catering'
    )
  )
) ON CONFLICT DO NOTHING;

-- Insert other default content (about, services, faq, references)
INSERT INTO content (page, content)
SELECT * FROM (
  VALUES 
    ('about', '{"hero":{"title":"Über Uns","subtitle":"Ihr vertrauenswürdiger Partner für erstklassiges Catering","image":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0"},"story":{"title":"Unsere Geschichte","content":"FEST''LMACHER steht seit über 20 Jahren für erstklassiges Catering und perfekten Service in Wien.","image":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0"},"values":[{"id":"value-1","title":"Qualität","description":"Wir verwenden nur die besten Zutaten und arbeiten mit lokalen Lieferanten zusammen."}],"team":[{"id":"team-1","name":"Michael Weber","role":"Küchenchef","image":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80","description":"Experte für internationale Küche mit über 15 Jahren Erfahrung."}],"seo":{"title":"Über Uns - FEST''LMACHER Catering Wien","description":"Lernen Sie FEST''LMACHER kennen - Ihr professioneller Catering Service in Wien.","keywords":"catering wien, über uns, catering service"}}'::jsonb),
    ('services', '{"hero":{"title":"Unsere Dienstleistungen","subtitle":"Professionelles Catering für jeden Anlass"},"services":[],"cta":{"title":"Maßgeschneiderte Lösungen","description":"Kontaktieren Sie uns für ein individuelles Angebot.","buttonText":"Jetzt anfragen","buttonLink":"/kontakt"},"seo":{"title":"Catering Services Wien | FEST''LMACHER","description":"Professionelles Catering für Hochzeiten, Firmenfeiern und Events in Wien.","keywords":"catering wien, hochzeit catering, firmen catering"}}'::jsonb),
    ('faq', '{"hero":{"title":"Häufig gestellte Fragen","subtitle":"Hier finden Sie Antworten auf die häufigsten Fragen"},"faqs":[],"cta":{"title":"Noch Fragen?","description":"Kontaktieren Sie uns gerne für weitere Informationen.","buttonText":"Kontakt aufnehmen","buttonLink":"/kontakt"},"seo":{"title":"FAQ - FEST''LMACHER Catering Wien","description":"Häufig gestellte Fragen zu unserem Catering-Service in Wien.","keywords":"catering wien faq, catering fragen"}}'::jsonb),
    ('references', '{"hero":{"title":"Referenzen","subtitle":"Was unsere Kunden über uns sagen"},"testimonials":[],"cta":{"title":"Werden Sie unser nächster zufriedener Kunde","description":"Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch.","buttonText":"Jetzt anfragen","buttonLink":"/kontakt"},"seo":{"title":"Referenzen - FEST''LMACHER Catering Wien","description":"Kundenstimmen zu unserem Catering-Service in Wien.","keywords":"catering wien referenzen, catering bewertungen"}}'::jsonb)
) AS v(page, content)
WHERE NOT EXISTS (
  SELECT 1 FROM content c WHERE c.page = v.page
);
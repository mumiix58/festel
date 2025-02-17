import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import Slider from '../models/Slider.js';
import Content from '../models/Content.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dlilqh3pb',
  api_key: process.env.CLOUDINARY_API_KEY || '762563471959457',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'J49GcglEgkV9bFeOeXc459GRfzE'
});

// Default content
const defaultContent = {
  legal: {
    impressum: `# Impressum

## Unternehmensangaben

FEST'LMACHER Gastronomie
DDSG, Handelskai 265
1220 Wien
Österreich

## Kontakt
Tel: +43 (0)699 – 1600 2800
E-Mail: catering@festlmacher.at

## Firmenbuch
Firmenbuchnummer: [Nummer]
Firmenbuchgericht: [Gericht]
UID-Nummer: [Nummer]

## Geschäftsführung
[Name des Geschäftsführers]

## Aufsichtsbehörde
Magistratisches Bezirksamt für den [X]. Bezirk

## Berufsrecht
Gewerbeordnung: www.ris.bka.gv.at
Bezirkshauptmannschaft Wien

## Verbraucherstreitbeilegung
Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
https://ec.europa.eu/consumers/odr/

Unsere E-Mail-Adresse finden Sie oben im Impressum.

## Haftungsausschluss
Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.`,

    datenschutz: `# Datenschutzerklärung

## 1. Datenschutz auf einen Blick

### Allgemeine Hinweise
Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.`,

    agb: `# Allgemeine Geschäftsbedingungen

## 1. Geltungsbereich
Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Geschäftsbeziehungen zwischen FEST'LMACHER Gastronomie und unseren Kunden.`
  }
};

// Add this function after the existing imports
async function initializeSlider() {
  try {
    console.log('Checking for existing slides...');
    const count = await Slider.countDocuments();
    
    if (count === 0) {
      console.log('No slides found. Creating defaults...');
      
      const defaultSlides = [
        {
          title: 'Erstklassiges Catering',
          subtitle: 'Für jeden Anlass die perfekte Lösung',
          image: 'https://images.unsplash.com/photo-1555244162-803834f70033',
          buttonText: 'Jetzt anfragen',
          buttonLink: '/kontakt',
          order: 0,
          showLogo: true,
          isActive: true
        },
        {
          title: 'Hochzeits-Catering',
          subtitle: 'Machen Sie Ihren besonderen Tag unvergesslich',
          image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
          buttonText: 'Mehr erfahren',
          buttonLink: '/dienstleistungen',
          order: 1,
          showLogo: false,
          isActive: true
        },
        {
          title: 'Business Catering',
          subtitle: 'Professioneller Service für Ihre Firmenveranstaltung',
          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
          buttonText: 'Jetzt anfragen',
          buttonLink: '/kontakt',
          order: 2,
          showLogo: false,
          isActive: true
        },
        {
          title: 'Event Catering',
          subtitle: 'Unvergessliche Momente mit perfektem Service',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
          buttonText: 'Mehr erfahren',
          buttonLink: '/dienstleistungen',
          order: 3,
          showLogo: false,
          isActive: true
        },
        {
          title: 'Gourmet Catering',
          subtitle: 'Erstklassige Küche für höchste Ansprüche',
          image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
          buttonText: 'Kontaktieren Sie uns',
          buttonLink: '/kontakt',
          order: 4,
          showLogo: true,
          isActive: true
        },
        {
          title: 'Nachhaltiges Catering',
          subtitle: 'Verantwortungsvoll genießen',
          image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
          buttonText: 'Erfahren Sie mehr',
          buttonLink: '/bio-nachhaltigkeit',
          order: 5,
          showLogo: false,
          isActive: true
        }
      ];

      // Create slides directly without Cloudinary upload
      for (const slideData of defaultSlides) {
        try {
          await Slider.create({
            ...slideData,
            cloudinaryPublicId: `slider/${uuidv4()}`
          });
          console.log(`Created slide: ${slideData.title}`);
        } catch (error) {
          console.error(`Error creating slide ${slideData.title}:`, error);
        }
      }

      console.log('Default slides initialized');
    } else {
      console.log(`Found ${count} existing slides`);
    }
  } catch (error) {
    console.error('Error initializing slides:', error);
  }
}

async function initializeLegalContent() {
  try {
    console.log('Checking for existing legal content...');
    const legalContent = await Content.findOne({ page: 'legal' });
    
    if (!legalContent) {
      console.log('No legal content found. Creating defaults...');
      await Content.create({
        page: 'legal',
        content: defaultContent.legal
      });
      console.log('Default legal content initialized');
    } else {
      // Update existing legal content to match defaults
      console.log('Updating existing legal content...');
      await Content.findOneAndUpdate(
        { page: 'legal' },
        { content: defaultContent.legal },
        { new: true }
      );
      console.log('Legal content updated');
    }
  } catch (error) {
    console.error('Error initializing legal content:', error);
  }
}

// Export the initialization function
export async function initializeContent() {
  try {
    console.log('Initializing default content...');

    // Initialize slides and legal content
    await Promise.all([
      initializeSlider(),
      initializeLegalContent()
    ]);

    console.log('Content initialization complete');
  } catch (error) {
    console.error('Error initializing content:', error);
    throw error;
  }
}
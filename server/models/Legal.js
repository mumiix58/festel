import mongoose from 'mongoose';
import Content from './Content.js';

const legalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['impressum', 'datenschutz', 'agb'],
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
legalSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

const Legal = mongoose.model('Legal', legalSchema);

// Initialize default legal content if none exists
export async function initializeLegalContent() {
  try {
    // Check if content exists in Content collection
    const legalContent = await Content.findOne({ page: 'legal' });
    
    if (!legalContent) {
      // Create default content in Content collection
      await Content.create({
        page: 'legal',
        content: {
          impressum: `# Impressum

FEST'LMACHER Gastronomie
DDSG, Handelskai 265
1220 Wien
Österreich

**Kontakt:**
Tel: +43 (0)699 – 1600 2800
E-Mail: catering@festlmacher.at`,

          datenschutz: `# Datenschutzerklärung

## 1. Datenschutz auf einen Blick

### Allgemeine Hinweise
Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.`,

          agb: `# Allgemeine Geschäftsbedingungen

## 1. Geltungsbereich
Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Geschäftsbeziehungen zwischen FEST'LMACHER Gastronomie und unseren Kunden.`
        }
      });
      console.log('Default legal content initialized in Content collection');
    }
  } catch (error) {
    console.error('Error initializing legal content:', error);
  }
}

export default Legal;
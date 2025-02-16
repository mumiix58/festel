import { LegalContent } from '@/types';
import api from '@/lib/api';

// Default legal content with placeholder text
const defaultLegalContent: LegalContent = {
  impressum: `# Impressum

FEST'LMACHER Gastronomie
DDSG, Handelskai 265
1220 Wien
Österreich

**Kontakt:**
Tel: +43 (0)699 – 1600 2800
E-Mail: catering@festlmacher.at

**Firmenbuchdaten:**
[Firmenbuchnummer]
[Firmenbuchgericht]
[UID-Nummer]

**Geschäftsführung:**
[Name des Geschäftsführers]

**Aufsichtsbehörde:**
Magistratisches Bezirksamt für den [X]. Bezirk

**Berufsrecht:**
Gewerbeordnung: www.ris.bka.gv.at
Bezirkshauptmannschaft Wien`,

  datenschutz: `# Datenschutzerklärung

## 1. Datenschutz auf einen Blick

### Allgemeine Hinweise
Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.

### Datenerfassung auf dieser Website
- **Verantwortlich für die Datenerfassung:**
  FEST'LMACHER Gastronomie
  Handelskai 265, 1220 Wien

- **Wie erfassen wir Ihre Daten?**
  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.

- **Wofür nutzen wir Ihre Daten?**
  - Zur Beantwortung von Kontaktanfragen
  - Zur Abwicklung von Bestellungen und Verträgen
  - Zur Bereitstellung unserer Online-Dienste

## 2. Ihre Rechte
Sie haben jederzeit das Recht:
- Auskunft über Ihre gespeicherten personenbezogenen Daten zu erhalten
- Diese berichtigen oder löschen zu lassen
- Die Verarbeitung einzuschränken
- Der Verarbeitung zu widersprechen
- Ihre Daten übertragen zu lassen`,

  agb: `# Allgemeine Geschäftsbedingungen

## 1. Geltungsbereich
Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Geschäftsbeziehungen zwischen FEST'LMACHER Gastronomie und unseren Kunden.

## 2. Vertragsschluss
Der Vertrag kommt durch schriftliche Auftragsbestätigung zustande.

## 3. Leistungen
- Detaillierte Beschreibung der Catering-Leistungen
- Qualitätsstandards
- Lieferbedingungen

## 4. Preise und Zahlung
- Preisangaben
- Zahlungsbedingungen
- Verzugsregelungen

## 5. Stornierung
- Stornierungsfristen
- Stornogebühren
- Ausnahmeregelungen

## 6. Haftung
- Haftungsumfang
- Haftungsausschlüsse
- Versicherung`
};

// Validate legal content structure
function isValidLegalContent(content: any): content is LegalContent {
  return (
    content &&
    typeof content.impressum === 'string' &&
    typeof content.datenschutz === 'string' &&
    typeof content.agb === 'string' &&
    content.impressum.trim() !== '' &&
    content.datenschutz.trim() !== '' &&
    content.agb.trim() !== ''
  );
}

// Get legal content from backend with fallback
export async function getLegalContent(): Promise<LegalContent> {
  try {
    // Use content endpoint instead of legal
    const content = await api.get('/content/legal');
    
    // Validate content structure
    if (content && isValidLegalContent(content)) {
      return content;
    }
    
    console.log('Using default legal content due to invalid API response');
    return defaultLegalContent;
  } catch (error) {
    console.error('Error loading legal content:', error);
    // Return default content as fallback
    return defaultLegalContent;
  }
}

// Update legal content with retry mechanism
export async function updateLegalContent(content: LegalContent): Promise<boolean> {
  try {
    // Validate content before sending
    if (!isValidLegalContent(content)) {
      throw new Error('Invalid legal content structure');
    }

    // Use content endpoint instead of legal
    const response = await api.put('/content/legal', content);
    
    // Verify response
    if (!response) {
      throw new Error('Failed to update legal content');
    }

    return true;
  } catch (error) {
    console.error('Error updating legal content:', error);
    throw new Error('Failed to update legal content. Please try again later.');
  }
}
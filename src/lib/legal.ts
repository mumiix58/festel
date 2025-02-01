import { LegalContent } from '@/types';
import localforage from 'localforage';

// Initialize localforage instance for legal content
const legalStore = localforage.createInstance({
  name: 'legal',
  storeName: 'content'
});

// Default legal content
const defaultLegalContent: LegalContent = {
  impressum: `# Impressum

## Unternehmensangaben
FEST'LMACHER Gastronomie
DDSG, Handelskai 265
1220 Wien
Österreich

## Kontakt
Tel: +43 (0)699 – 1600 2800
E-Mail: info@festlmacher.at

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
Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/
Unsere E-Mail-Adresse finden Sie oben im Impressum.`,

  datenschutz: `# Datenschutzerklärung

## 1. Datenschutz auf einen Blick
Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.

## 2. Allgemeine Hinweise und Pflichtinformationen
Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.

## 3. Datenerfassung auf dieser Website
### Cookies
Unsere Internetseiten verwenden so genannte "Cookies". Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an.

## 4. Analyse-Tools und Werbung
### Google Analytics
Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics.

## 5. Newsletter
### Newsletter-Daten
Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse sind.`,

  agb: `# Allgemeine Geschäftsbedingungen

## 1. Geltungsbereich
Diese Allgemeinen Geschäftsbedingungen gelten für alle Geschäftsbeziehungen zwischen FEST'LMACHER Gastronomie und unseren Kunden.

## 2. Vertragsabschluss
Der Vertrag kommt durch die Annahme der Bestellung des Kunden durch uns zustande. Die Annahme erfolgt durch schriftliche Auftragsbestätigung.

## 3. Preise und Zahlung
Alle Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt per Rechnung oder nach vereinbarten Zahlungsbedingungen.

## 4. Stornierung
Bei Stornierung eines bestätigten Auftrags gelten folgende Bedingungen:
- Bis 30 Tage vor dem Event: kostenfrei
- 29-15 Tage vor dem Event: 30% des Auftragswertes
- 14-7 Tage vor dem Event: 50% des Auftragswertes
- 6-3 Tage vor dem Event: 75% des Auftragswertes
- Ab 2 Tage vor dem Event: 100% des Auftragswertes

## 5. Haftung
Wir haften für Schäden nur bei Vorsatz oder grober Fahrlässigkeit. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen.

## 6. Datenschutz
Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den geltenden gesetzlichen Bestimmungen.

## 7. Schlussbestimmungen
Es gilt österreichisches Recht. Gerichtsstand ist Wien. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.`
};

// Get legal content
export async function getLegalContent(): Promise<LegalContent> {
  try {
    const content = await legalStore.getItem<LegalContent>('content');
    return content || defaultLegalContent;
  } catch (error) {
    console.error('Error loading legal content:', error);
    return defaultLegalContent;
  }
}

// Update legal content
export async function updateLegalContent(content: LegalContent): Promise<void> {
  try {
    await legalStore.setItem('content', content);
  } catch (error) {
    console.error('Error updating legal content:', error);
    throw new Error('Fehler beim Speichern der rechtlichen Inhalte');
  }
}
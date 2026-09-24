import { Container } from '@/components/ui/Container';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Loader } from '@googlemaps/js-api-loader';
import { sendEmail } from '@/lib/email';
import { saveContactMessage } from '@/lib/analytics';
import { defaultSettings } from '@/lib/defaults';

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

export function Contact() {
  const [mapError, setMapError] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { settings: savedSettings } = useSettings();
  const settings = savedSettings || defaultSettings;

  useEffect(() => {
    if (!settings?.seo?.googleMapsApiKey) {
      setMapError('Google Maps API key is not configured');
      return;
    }

    const loader = new Loader({
      apiKey: settings.seo.googleMapsApiKey,
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then((google) => {
      if (!mapRef.current) return;

      const location = { lat: 48.2244928, lng: 16.4075976 }; // Handelskai 265, 1020 Wien
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      new google.maps.Marker({
        position: location,
        map,
        title: 'FEST\'LMACHER'
      });
    }).catch((err) => {
      console.error('Error loading Google Maps:', err);
      setMapError('Failed to load Google Maps');
    });
  }, [settings?.seo?.googleMapsApiKey]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const templateParams = {
      from_name: formData.get('name') as string,
      from_email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      date: formData.get('date') as string,
      start_time: formData.get('startTime') as string,
      end_time: formData.get('endTime') as string
    };

    try {
      await sendEmail(templateParams);

      // Dashboard availability must not change the email delivery result.
      void saveContactMessage({
        email: templateParams.from_email,
        subject: templateParams.subject,
        message: `${templateParams.message}\n\nDatum: ${templateParams.date}\nBeginn: ${templateParams.start_time}\nEnde: ${templateParams.end_time}`
      }).catch(() => console.warn('Dashboard copy could not be saved.'));

      setFormStatus({
        type: 'success',
        message: 'Ihre Nachricht wurde erfolgreich gesendet!'
      });
      
      form.reset();
    } catch (error: any) {
      setFormStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split('T')[0];

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
            Kontakt
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Wir freuen uns auf Ihre Nachricht
          </p>
        </motion.div>

        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h2 className="font-display text-2xl font-bold">
                Kontaktinformationen
              </h2>
              <div className="mt-6 space-y-4">
                <motion.a
                  href={`tel:${settings.company.contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-4 transition-colors hover:text-accent"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="h-4 w-4 text-accent" />
                  <span>{settings.company.contact.phone}</span>
                </motion.a>
                <motion.a
                  href={`mailto:${settings.company.contact.email}`}
                  className="flex items-center gap-4 transition-colors hover:text-accent"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="h-4 w-4 text-accent" />
                  <span>{settings.company.contact.email}</span>
                </motion.a>
                <motion.a
                  href={`https://maps.google.com/?q=${settings.company.address.street},${settings.company.address.postalCode} ${settings.company.address.city}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 transition-colors hover:text-accent"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>
                    {settings.company.address.street}, {settings.company.address.postalCode} {settings.company.address.city}
                  </span>
                </motion.a>
              </div>
            </div>

            <div className="h-[400px] overflow-hidden rounded-lg">
              {mapError ? (
                <div className="flex h-full items-center justify-center bg-gray-100">
                  <p className="text-gray-600">{mapError}</p>
                </div>
              ) : (
                <div ref={mapRef} className="h-full w-full"></div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow-lg">
              <h2 className="font-display text-2xl font-bold">
                Nachricht senden
              </h2>

              {formStatus.type && (
                <div
                  className={`mt-4 rounded-md p-4 ${
                    formStatus.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {formStatus.message}
                </div>
              )}

              <div className="mt-6 space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Betreff *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                    required
                  />
                </div>

                {/* Event Details */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Datum der Veranstaltung
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    min={today}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="startTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Beginn
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ende
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                    required
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-accent px-8 py-3 font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
                >
                  {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </Container>
    </motion.div>
  );
}
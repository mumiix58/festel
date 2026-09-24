import { Container } from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { saveContactMessage } from '@/lib/analytics';
import { sendEmail } from '@/lib/email';

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

export function Booking() {
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    startTime: '',
    endTime: '',
    guests: '',
    message: ''
  });

  const { content: servicesContent } = useServices();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    const type = searchParams.get('type');
    if (type) {
      setSelectedType(type);
    }
  }, [searchParams, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      const selectedService = servicesContent?.services.find(s => s.id === selectedType);
      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        phone: formData.phone,
        eventType: selectedService?.title || selectedType,
        date: new Date(formData.date).toLocaleDateString('de-DE'),
        start_time: formData.startTime,
        end_time: formData.endTime,
        guests: formData.guests,
        message: formData.message || 'Keine Nachricht'
      };

      await sendEmail(templateParams, 'booking');

      // Dashboard availability must not change the email delivery result.
      void saveContactMessage({
        email: formData.email,
        subject: `Terminanfrage: ${selectedService?.title || selectedType}`,
        message: `Name: ${formData.firstName} ${formData.lastName}
                 Telefon: ${formData.phone}
                 Datum: ${templateParams.date}
                 Beginn: ${formData.startTime}
                 Ende: ${formData.endTime}
                 Gäste: ${formData.guests}
                 Nachricht: ${formData.message || 'Keine Nachricht'}`
      }).catch(() => console.warn('Dashboard copy could not be saved.'));

      setFormStatus({
        type: 'success',
        message: 'Ihre Anfrage wurde erfolgreich gesendet! Wir werden uns in Kürze bei Ihnen melden.'
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        date: '',
        startTime: '',
        endTime: '',
        guests: '',
        message: ''
      });
      setSelectedType('');
      
    } catch (error: any) {
      console.error('Failed to send booking request:', error);
      setFormStatus({
        type: 'error',
        message: error.message || 'Es gab einen Fehler beim Senden Ihrer Anfrage. Bitte versuchen Sie es später erneut.'
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
            Online Vereinbarung
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Vereinbaren Sie einen Termin für Ihre Veranstaltung
          </p>
        </motion.div>

        <motion.div 
          ref={formRef}
          variants={itemVariants} 
          className="mx-auto mt-16 max-w-2xl"
        >
          {formStatus.type && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                formStatus.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {formStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Vorname *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nachname *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefon *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                required
              />
            </div>

            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                Art der Veranstaltung *
              </label>
              <select
                id="eventType"
                name="eventType"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                required
              >
                <option value="">Bitte wählen</option>
                {servicesContent?.services
                  .sort((a, b) => a.order - b.order)
                  .map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                <option value="other">Sonstiges</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Datum *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={today}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Beginn *
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  Ende *
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                Anzahl der Gäste *
              </label>
              <input
                type="number"
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Nachricht
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
              ></textarea>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full rounded-full bg-accent px-8 py-3 font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
            >
              {isSubmitting ? 'Wird gesendet...' : 'Termin anfragen'}
            </motion.button>
          </form>
        </motion.div>
      </Container>
    </motion.div>
  );
}
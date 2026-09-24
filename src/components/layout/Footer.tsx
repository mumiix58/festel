import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useFooter } from '@/hooks/useFooter';

export function Footer() {
  const { settings } = useSettings();
  const { content, loading, error } = useFooter();

  if (loading || !content || !settings) {
    return (
      <footer className="bg-primary-900 text-white">
        <Container className="py-12">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-700 rounded"></div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-48 bg-gray-700 rounded"></div>
              <div className="h-4 w-40 bg-gray-700 rounded"></div>
              <div className="h-4 w-44 bg-gray-700 rounded"></div>
            </div>
          </div>
        </Container>
      </footer>
    );
  }

  if (error) {
    console.error('Footer error:', error);
    return null;
  }

  return (
    <footer className="bg-primary-900 text-white">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div>
            <Link to="/" className="block">
              <div className="inline-block rounded-lg bg-white p-6">
                <img
                  src={settings.logo || "/logo.png"}
                  alt={settings.company.name}
                  className="h-24 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              {content.description}
            </p>
          </div>
          
          <div>
            <h4 className="font-display text-lg font-semibold">Kontakt</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a 
                  href={`tel:${settings.company.contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4" />
                  <span>{settings.company.contact.phone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${settings.company.contact.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4" />
                  <span>{settings.company.contact.email}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${settings.company.address.street}, ${settings.company.address.postalCode} ${settings.company.address.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <MapPin className="h-4 w-4" />
                  <span>
                    {settings.company.address.street}, {settings.company.address.postalCode} {settings.company.address.city}
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h5 className="font-semibold">Folgen Sie uns</h5>
              <div className="mt-3 flex space-x-4">
                {settings.social.facebook && (
                  <a
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/10 p-2 transition-colors hover:bg-accent"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {settings.social.instagram && (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/10 p-2 transition-colors hover:bg-accent"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {settings.social.linkedin && (
                  <a
                    href={settings.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/10 p-2 transition-colors hover:bg-accent"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold">Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {content.quickLinks.map((link, index) => (
                <li key={index}>
                  {link.isExternal ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {link.text}
                    </a>
                  ) : (
                    <Link
                      to={link.url}
                      className="transition-colors hover:text-accent"
                    >
                      {link.text}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold">Öffnungszeiten</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {content.openingHours.map((item, index) => (
                <li key={index}>
                  <span className="font-semibold">{item.day}:</span> {item.hours}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} {settings.company.name}. Alle Rechte vorbehalten.</p>
        </div>

      </Container>
    </footer>
  );
}
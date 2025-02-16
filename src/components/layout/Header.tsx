import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useSettings } from '@/hooks/useSettings';
import { getNavigationCategories } from '@/lib/equipment';
import { EquipmentCategory } from '@/types';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const { settings, loading: settingsLoading } = useSettings();
  const [logoError, setLogoError] = useState(false);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const navCategories = await getNavigationCategories();
      setCategories(navCategories);
    } catch (err) {
      console.error('Error loading navigation categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();

    // Listen for category updates
    window.addEventListener('equipmentCategoriesUpdated', loadCategories);

    return () => {
      window.removeEventListener('equipmentCategoriesUpdated', loadCategories);
    };
  }, [loadCategories]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [mobileMenuOpen, closeTimeout]);

  const handleLogoError = () => {
    setLogoError(true);
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleMouseEnter = (itemId: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
    setCloseTimeout(timeout);
  };

  const navigation = [
    { id: 'home', name: 'Startseite', href: '/' },
    { id: 'about', name: 'Über Uns', href: '/uber-uns' },
    { id: 'services', name: 'Dienstleistungen', href: '/dienstleistungen' },
    { 
      id: 'catering-and-more',
      name: 'Catering AND MORE',
      href: '/catering-and-more',
      submenu: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        href: `/catering-and-more/${cat.slug}`
      }))
    },
    { id: 'sustainability', name: 'Bio & Nachhaltigkeit', href: '/bio-nachhaltigkeit' },
    { id: 'references', name: 'Referenzen', href: '/referenzen' },
    { id: 'faq', name: 'SSS', href: '/sss' },
    { id: 'contact', name: 'Kontakt', href: '/kontakt' }
  ];

  // Default logo path as fallback
  const defaultLogo = '/logo.png';
  const logoSrc = settings?.logo && !logoError ? settings.logo : defaultLogo;
  const companyName = settings?.company?.name || "FEST'LMACHER";

  if (settingsLoading || loading) {
    return (
      <header className="fixed inset-x-0 top-0 z-50 bg-white/95 shadow-sm backdrop-blur-sm">
        <Container>
          <div className="flex h-24 items-center justify-between">
            <div className="h-16 w-32 animate-pulse bg-gray-200"></div>
          </div>
        </Container>
      </header>
    );
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/95 shadow-sm backdrop-blur-sm">
      <Container>
        <nav className="flex h-24 items-center justify-between" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <div className="flex h-20 items-center">
                <img
                  src={logoSrc}
                  alt={companyName}
                  className="h-16 w-auto object-contain"
                  onError={handleLogoError}
                  loading="eager"
                />
              </div>
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="relative z-[60] -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Menü öffnen</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={item.href}
                  className={`text-sm font-semibold leading-6 ${
                    isActive(item.href)
                      ? 'text-accent'
                      : 'text-gray-900 hover:text-accent'
                  }`}
                >
                  {item.name}
                </Link>
                {item.submenu && activeDropdown === item.id && item.submenu.length > 0 && (
                  <div 
                    className="absolute left-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActive(subItem.href)
                            ? 'bg-accent/10 text-accent'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </Container>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 bg-white transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ height: '100vh', overflowY: 'auto' }}
      >
        <Container className="flex min-h-screen flex-col justify-between py-24">
          <div className="space-y-2">
            {navigation.map((item) => (
              <div key={item.id}>
                <Link
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-base font-semibold ${
                    isActive(item.href)
                      ? 'bg-accent text-white'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
                {item.submenu && item.submenu.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block rounded-lg px-4 py-2 text-sm ${
                          isActive(subItem.href)
                            ? 'bg-accent/10 text-accent'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {settings?.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium">Facebook</span>
                </a>
              )}
              {settings?.social?.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium">Instagram</span>
                </a>
              )}
              {settings?.social?.linkedin && (
                <a
                  href={settings.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
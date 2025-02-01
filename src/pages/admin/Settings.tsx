import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Save, Upload } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { optimizeImage } from '@/lib/imageUtils';
import storage from '@/lib/storage';
import { Settings as SettingsType } from '@/types';

export function Settings() {
  const { settings: initialSettings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<SettingsType | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // User profile state
  const currentUser = storage.getCurrentUser();
  const [profileData, setProfileData] = useState({
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (initialSettings) {
      setLocalSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleSettingsChange = (path: string[], value: any) => {
    if (!localSettings) return;

    setLocalSettings(prevSettings => {
      if (!prevSettings) return prevSettings;

      const newSettings = { ...prevSettings };
      let current = newSettings;
      
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setSaveMessage({
        type: 'error',
        text: 'Die Passwörter stimmen nicht überein'
      });
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      // Update local storage if email changed
      if (profileData.email !== currentUser?.email) {
        const user = storage.getCurrentUser();
        if (user) {
          user.email = profileData.email;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }

      setSaveMessage({
        type: 'success',
        text: 'Profil erfolgreich aktualisiert'
      });

      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      setSaveMessage({
        type: 'error',
        text: err.message || 'Fehler beim Aktualisieren des Profils'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedFile = await optimizeImage(file);
      setLogoFile(optimizedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(optimizedFile);
    } catch (error) {
      console.error('Error processing logo:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Verarbeiten des Logos'
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!localSettings) return;
    
    setSaving(true);
    setSaveMessage(null);

    try {
      let updatedSettings = { ...localSettings };

      if (logoFile) {
        const reader = new FileReader();
        const logoData = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(logoFile);
        });
        
        updatedSettings = {
          ...updatedSettings,
          logo: logoData
        };
      }

      await updateSettings(updatedSettings);
      
      setSaveMessage({
        type: 'success',
        text: 'Einstellungen erfolgreich gespeichert'
      });
      
      setLogoFile(null);
      setLogoPreview(null);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({
        type: 'error',
        text: 'Fehler beim Speichern der Einstellungen'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!localSettings) {
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
          <h1 className="font-display text-3xl font-bold">Einstellungen</h1>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
          </button>
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
          {/* User Profile Section */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Benutzerprofil</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-Mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Aktuelles Passwort
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Neues Passwort
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Passwort bestätigen
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="mt-4 flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Wird aktualisiert...' : 'Profil aktualisieren'}
              </button>
            </div>
          </section>

          {/* Logo Settings */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Logo</h2>
            <div className="mt-4">
              <div className="flex items-start gap-8">
                <div className="w-64">
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                    {(logoPreview || localSettings.logo) ? (
                      <img
                        src={logoPreview || localSettings.logo}
                        alt="Logo Vorschau"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        Kein Logo vorhanden
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Logo hochladen (PNG, JPG, SVG)
                  </label>
                  <div className="mt-1">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                      <Upload className="h-4 w-4" />
                      <span>Logo auswählen</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Empfohlene Größe: 200x200 Pixel. Maximale Größe: 2MB.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Company Information */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Unternehmensinformationen</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Firmenname
                </label>
                <input
                  type="text"
                  value={localSettings.company.name}
                  onChange={(e) => handleSettingsChange(['company', 'name'], e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Straße
                  </label>
                  <input
                    type="text"
                    value={localSettings.company.address.street}
                    onChange={(e) => handleSettingsChange(['company', 'address', 'street'], e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    PLZ
                  </label>
                  <input
                    type="text"
                    value={localSettings.company.address.postalCode}
                    onChange={(e) => handleSettingsChange(['company', 'address', 'postalCode'], e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stadt
                  </label>
                  <input
                    type="text"
                    value={localSettings.company.address.city}
                    onChange={(e) => handleSettingsChange(['company', 'address', 'city'], e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Land
                  </label>
                  <input
                    type="text"
                    value={localSettings.company.address.country}
                    onChange={(e) => handleSettingsChange(['company', 'address', 'country'], e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={localSettings.company.contact.phone}
                    onChange={(e) => handleSettingsChange(['company', 'contact', 'phone'], e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={localSettings.company.contact.email}
                    onChange={(e) => handleSettingsChange(['company', 'contact', 'email'], e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Social Media */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Social Media</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={localSettings.social.facebook}
                  onChange={(e) => handleSettingsChange(['social', 'facebook'], e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={localSettings.social.instagram}
                  onChange={(e) => handleSettingsChange(['social', 'instagram'], e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={localSettings.social.linkedin}
                  onChange={(e) => handleSettingsChange(['social', 'linkedin'], e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>
          </section>

          {/* SEO Settings */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">SEO Einstellungen</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={localSettings.seo.title}
                  onChange={(e) => handleSettingsChange(['seo', 'title'], e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  value={localSettings.seo.description}
                  onChange={(e) => handleSettingsChange(['seo', 'description'], e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={localSettings.seo.keywords}
                  onChange={(e) => handleSettingsChange(['seo', 'keywords'], e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>
            </div>
          </section>

          {/* Google Integrations */}
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">Google Integrationen</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={localSettings.seo.googleAnalyticsId}
                  onChange={(e) => handleSettingsChange(['seo', 'googleAnalyticsId'], e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Geben Sie Ihre Google Analytics 4 Measurement ID ein
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Google Maps API Key
                </label>
                <input
                  type="text"
                  value={localSettings.seo.googleMapsApiKey}
                  onChange={(e) => handleSettingsChange(['seo', 'googleMapsApiKey'], e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Google Place ID
                </label>
                <input
                  type="text"
                  value={localSettings.seo.googlePlaceId}
                  onChange={(e) => handleSettingsChange(['seo', 'googlePlaceId'], e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Finden Sie Ihre Place ID auf der{' '}
                  <a
                    href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Google Maps Place ID Finder
                  </a>{' '}
                  Seite
                </p>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
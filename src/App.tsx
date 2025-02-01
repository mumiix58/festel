{/* Update App.tsx to fix admin routes */}
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import storage from '@/lib/storage';

// Public Pages
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Services } from '@/pages/Services';
import { CateringAndMore } from '@/pages/CateringAndMore';
import { CategoryPage } from '@/pages/CategoryPage';
import { FAQ } from '@/pages/FAQ';
import { References } from '@/pages/References';
import { Contact } from '@/pages/Contact';
import { Impressum } from '@/pages/legal/Impressum';
import { Datenschutz } from '@/pages/legal/Datenschutz';
import { AGB } from '@/pages/legal/AGB';
import { Sustainability } from '@/pages/Sustainability';

// Error Pages
import { NotFound } from '@/pages/errors/404';
import { ServerError } from '@/pages/errors/500';

// Admin Pages
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Login } from '@/pages/admin/Login';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Settings } from '@/pages/admin/Settings';
import { Gallery } from '@/pages/admin/Gallery';
import { Slider } from '@/pages/admin/Slider';
import { Footer as FooterAdmin } from '@/pages/admin/Footer';
import { About as AboutAdmin } from '@/pages/admin/About';
import { Services as ServicesAdmin } from '@/pages/admin/Services';
import { CateringAndMore as CateringAndMoreAdmin } from '@/pages/admin/CateringAndMore';
import { Equipment } from '@/pages/admin/Equipment';
import { Tischwasche } from '@/pages/admin/Tischwasche';
import { FAQ as FAQAdmin } from '@/pages/admin/FAQ';
import { References as ReferencesAdmin } from '@/pages/admin/References';
import { ImpressumAdmin } from '@/pages/admin/legal/Impressum';
import { DatenschutzAdmin } from '@/pages/admin/legal/Datenschutz';
import { AGBAdmin } from '@/pages/admin/legal/AGB';
import { Sustainability as SustainabilityAdmin } from '@/pages/admin/Sustainability';
import { Home as HomeAdmin } from '@/pages/admin/Home';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = storage.getCurrentUser();
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminLayout />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="home" element={<HomeAdmin />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="slider" element={<Slider />} />
              <Route path="footer" element={<FooterAdmin />} />
              <Route path="about" element={<AboutAdmin />} />
              <Route path="services" element={<ServicesAdmin />} />
              <Route path="catering-and-more" element={<CateringAndMoreAdmin />} />
              <Route path="equipment" element={<Equipment />} />
              <Route path="tischwasche" element={<Tischwasche />} />
              <Route path="faq" element={<FAQAdmin />} />
              <Route path="references" element={<ReferencesAdmin />} />
              <Route path="settings" element={<Settings />} />
              <Route path="sustainability" element={<SustainabilityAdmin />} />
              <Route path="legal/impressum" element={<ImpressumAdmin />} />
              <Route path="legal/datenschutz" element={<DatenschutzAdmin />} />
              <Route path="legal/agb" element={<AGBAdmin />} />
            </Route>

            {/* Public Routes */}
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <main className="min-h-screen pt-20">
                    <ErrorBoundary>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/uber-uns" element={<About />} />
                        <Route path="/dienstleistungen" element={<Services />} />
                        <Route path="/catering-and-more" element={<CateringAndMore />} />
                        <Route path="/catering-and-more/:slug" element={<CategoryPage />} />
                        <Route path="/bio-nachhaltigkeit" element={<Sustainability />} />
                        <Route path="/sss" element={<FAQ />} />
                        <Route path="/referenzen" element={<References />} />
                        <Route path="/kontakt" element={<Contact />} />
                        <Route path="/nachhaltigkeit" element={<Sustainability />} />
                        <Route path="/impressum" element={<Impressum />} />
                        <Route path="/datenschutz" element={<Datenschutz />} />
                        <Route path="/agb" element={<AGB />} />
                        <Route path="/500" element={<ServerError />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ErrorBoundary>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { seoAliases } from "./lib/seo";
import { PublicSite } from "./site/PublicSite";
import { SiteDataProvider } from "./site/data";
import "./site/site.css";
const CmsAdmin = lazy(() => import("./site/CmsAdmin"));
export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <SiteDataProvider>
            <Routes>
              {Object.entries(seoAliases).map(([from, to]) => (
                <Route
                  key={from}
                  path={from}
                  element={<Navigate to={to} replace />}
                />
              ))}
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<p>Verwaltung wird geladen …</p>}>
                    <CmsAdmin />
                  </Suspense>
                }
              />
              <Route path="*" element={<PublicSite />} />
            </Routes>
          </SiteDataProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

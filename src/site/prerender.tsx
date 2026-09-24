import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { PublicSite } from "./PublicSite";
import { SiteDataProvider, SiteData, initialData } from "./data";
export function renderPage(path: string, initial: SiteData = initialData) {
  const context: any = {};
  const html = renderToString(
    <HelmetProvider context={context}>
      <StaticRouter location={path}>
        <SiteDataProvider refresh={false} initial={initial}>
          <PublicSite />
        </SiteDataProvider>
      </StaticRouter>
    </HelmetProvider>,
  );
  const h = context.helmet;
  return {
    html,
    head: [h.title, h.meta, h.link, h.script]
      .map((x) => x.toString())
      .join("\n"),
  };
}

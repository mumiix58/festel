import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import snapshot from "../content/live-site.json";
import backend from "../content/public-backend.json";
export type RecordData = { id: string; [field: string]: any };
export type SiteData = Record<string, RecordData[]>;
export const initialData: SiteData = snapshot;
export const contentTables = Object.keys(snapshot);
export const publicBackend = backend;
const DataContext = createContext<SiteData>(initialData);
export const useSiteData = () => useContext(DataContext);
export const ordered = (rows: RecordData[] = []) =>
  [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
export const uniqueServices = (rows: RecordData[]) =>
  [
    ...new Map(
      ordered(rows)
        .sort(
          (a, b) => String(b.description).length - String(a.description).length,
        )
        .map((r) => [r.title, r]),
    ).values(),
  ].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
export const imageUrl = (url: string, width = 1200) => {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname === "images.unsplash.com") {
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      u.searchParams.set("w", String(width));
      u.searchParams.set("q", "80");
    }
    return ["https:", "http:"].includes(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
};
export const plainContent = (value: string) =>
  value.replace(/<\/?div\b[^>]*>/g, "").trim();
export function SiteDataProvider({
  children,
  refresh = true,
  initial = initialData,
}: {
  children: ReactNode;
  refresh?: boolean;
  initial?: SiteData;
}) {
  const [data, setData] = useState<SiteData>(() => {
    if (typeof document === "undefined") return initial;
    const bootstrap = document.getElementById("site-data")?.textContent;
    if (bootstrap) {
      try {
        return { ...initial, ...JSON.parse(bootstrap) };
      } catch {
        /* Use the build snapshot if bootstrap data is damaged. */
      }
    }
    return initial;
  });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const reload = () => setRevision((value) => value + 1);
    window.addEventListener("festel:content-updated", reload);
    return () => window.removeEventListener("festel:content-updated", reload);
  }, []);
  useEffect(() => {
    if (!refresh) return;
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    void Promise.allSettled(
      contentTables.map(async (table) => {
        const query =
          table === "blog_posts" ? "select=*&published=eq.true" : "select=*";
        const response = await fetch(
          `${backend.url}/rest/v1/${table}?${query}`,
          {
            headers: {
              apikey: backend.anonKey,
              Authorization: `Bearer ${backend.anonKey}`,
            },
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error("Content unavailable");
        const rows = await response.json();
        if (
          Array.isArray(rows) &&
          rows.every((row) => row && typeof row.id === "string")
        )
          return [table, rows] as const;
        throw new Error("Invalid content");
      }),
    )
      .then((results) => {
        if (!active) return;
        setData((previous) =>
          Object.fromEntries([
            ...Object.entries(previous),
            ...results.flatMap((result) =>
              result.status === "fulfilled" ? [result.value] : [],
            ),
          ]),
        );
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [refresh, revision]);
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

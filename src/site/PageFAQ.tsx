import { Link, useLocation } from "react-router-dom";
import { canonicalPath } from "../lib/seo";
import { pageFAQs } from "../content/page-faq";
export function PageFAQ() {
  const { pathname } = useLocation();
  const questions = pageFAQs[canonicalPath(pathname)];
  if (!questions?.length) return null;
  return (
    <section className="fm-page-faq fm-wrap" aria-labelledby="page-faq-title">
      <div className="fm-section-heading">
        <div>
          <span className="fm-eyebrow">IHRE FRAGEN, KONKRET BEANTWORTET</span>
          <h2 id="page-faq-title">Was möchten Sie wissen?</h2>
        </div>
        <p>
          Antworten für Ihre Planung. Für die Details Ihrer Veranstaltung
          sprechen wir gerne persönlich mit Ihnen.
        </p>
      </div>
      <div className="fm-faq fm-page-faq-list">
        {questions.map(({ question, answer }) => (
          <details key={question}>
            <summary>
              {question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
      <Link to="/faq" className="fm-text-link">
        Weitere Fragen & Antworten →
      </Link>
    </section>
  );
}

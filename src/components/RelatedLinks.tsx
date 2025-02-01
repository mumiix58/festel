import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface RelatedLink {
  title: string;
  description: string;
  href: string;
}

interface RelatedLinksProps {
  links: RelatedLink[];
}

export function RelatedLinks({ links }: RelatedLinksProps) {
  return (
    <section className="border-t border-gray-200 py-8">
      <h2 className="font-display text-2xl font-semibold">Verwandte Themen</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.href}
            className="group rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <h3 className="font-display text-lg font-semibold group-hover:text-accent">
              {link.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{link.description}</p>
            <div className="mt-4 flex items-center text-sm text-accent">
              <span>Mehr erfahren</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
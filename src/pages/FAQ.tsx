import { Container } from '@/components/ui/Container';
import { Link } from 'react-router-dom';
import { useFAQ } from '@/hooks/useFAQ';
import { SEO } from '@/components/SEO';
import { defaultFAQContent } from '@/lib/faq';

export function FAQ() {
  const { content } = useFAQ();
  const page = content || defaultFAQContent;
  const faqs = page.faqs.filter(f => f.isActive).sort((a,b) => a.order-b.order);
  return <section className="py-24" aria-labelledby="faq-heading">
    <SEO metadata={page.seo} faqs={faqs} />
    <Container>
      <header className="mx-auto max-w-4xl text-center">
        <h1 id="faq-heading" className="font-display text-4xl font-bold sm:text-5xl">{page.hero.title}</h1>
        <p className="mt-4 text-lg text-gray-600">{page.hero.subtitle}</p>
      </header>
      <div className="mx-auto mt-16 max-w-3xl space-y-4">
        {faqs.map(f => <details key={f.id} className="rounded-lg bg-white shadow-lg">
          <summary className="cursor-pointer p-6 font-display text-lg font-semibold">{f.question}</summary>
          <div className="border-t border-gray-200 p-6"><p className="text-gray-600">{f.answer}</p></div>
        </details>)}
      </div>
      <section className="mx-auto mt-16 max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold">{page.cta.title}</h2>
        <p className="mt-4 text-gray-600">{page.cta.description}</p>
        <Link to={page.cta.buttonLink} className="mt-8 inline-flex rounded-full bg-accent px-8 py-3 font-semibold text-white">{page.cta.buttonText}</Link>
      </section>
    </Container>
  </section>;
}

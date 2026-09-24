import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Container } from '@/components/ui/Container';
import { SEO } from '@/components/SEO';
import { blogPosts } from '@/lib/seo';

export function Blog() {
  return <section className="py-20"><Container>
    <h1 className="font-display text-4xl font-bold">Blog</h1>
    <p className="mt-4 text-gray-600">Beiträge und Artikel aus unserem Blog.</p>
    <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogPosts.map(post => <article key={post.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {post.image_url && <img src={post.image_url} alt={post.title} loading="lazy" className="aspect-video w-full object-cover" />}
        <div className="p-6"><h2 className="font-display text-xl font-semibold"><Link to={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link></h2>
          <p className="mt-3 text-gray-600">{post.description}</p>
          <Link to={`/blog/${post.slug}`} className="mt-5 inline-block font-semibold text-accent">Artikel lesen<span className="sr-only">: {post.title}</span> →</Link>
        </div>
      </article>)}
    </div>
  </Container></section>;
}

export function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return <section className="py-20"><SEO noindex /><Container><h1 className="font-display text-4xl">Artikel nicht gefunden</h1><Link to="/blog">Zurück zum Blog</Link></Container></section>;
  return <article className="py-20"><Container>
    <nav aria-label="Brotkrümelnavigation" className="mb-8 text-sm"><Link to="/">Startseite</Link> / <Link to="/blog">Blog</Link> / <span>{post.title}</span></nav>
    <header className="mx-auto max-w-3xl"><h1 className="font-display text-4xl font-bold">{post.title}</h1>
      <p className="mt-4 text-sm text-gray-500"><time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString('de-AT',{year:'numeric',month:'long',day:'numeric',timeZone:'Europe/Vienna'})}</time></p>
      {post.image_url && <img src={post.image_url} alt={post.title} className="mt-8 max-h-[28rem] w-full rounded-xl object-cover" />}
    </header>
    <div className="prose prose-lg mx-auto mt-10 max-w-3xl prose-headings:font-display prose-a:text-accent">
      <ReactMarkdown components={{h1: ({children}) => <h2>{children}</h2>, img: ({src,alt}) => <img src={src} alt={alt || ''} loading="lazy" />}}>{post.body}</ReactMarkdown>
    </div>
    <div className="mx-auto mt-12 max-w-3xl"><Link to="/blog" className="font-semibold text-accent">← Alle Beiträge</Link></div>
  </Container></article>;
}

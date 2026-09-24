import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
const result = await build({entryPoints:['src/lib/seo.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const code=result.outputFiles[0].text;
const {seoPages,seoAliases,SITE_URL,SITE_NAME,SITE_LOGO,canonicalUrl,pageGraph,serializeJsonLd} = await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const faqs = JSON.parse(await readFile('src/content/faq.json','utf8')).filter(f=>f.isActive);
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// All routes use the same manifest for canonical URLs, initial HTML and sitemap.
const base = (await readFile('dist/index.html','utf8'))
  .replace(/<title>[\s\S]*?<\/title>/gi,'')
  .replace(/<meta\b(?=[^>]*(?:name=["'](?:description|keywords|robots|twitter:[^"']+)|property=["']og:))[^>]*>/gi,'')
  .replace(/<link\b(?=[^>]*rel=["']canonical)[^>]*>/gi,'');
const head = (page,noindex=page.noindex || false) => {
 const image = SITE_LOGO;
 const tags = [
  ['name','description',page.description],['name','robots',noindex?'noindex,follow':'index,follow,max-image-preview:large'],
  ['property','og:title',page.title],['property','og:description',page.description],['property','og:type','website'],['property','og:site_name',SITE_NAME],['property','og:locale','de_AT'],['property','og:url',canonicalUrl(page.path)],['property','og:image',image],['property','og:image:alt',SITE_NAME+' – catering and more'],
  ['name','twitter:card','summary_large_image'],['name','twitter:title',page.title],['name','twitter:description',page.description],['name','twitter:image',image]
 ];
 return `<title>${escape(page.title)}</title>\n<link rel="canonical" href="${escape(canonicalUrl(page.path))}" data-rh="true">\n`+tags.map(([attr,key,value])=>`<meta ${attr}="${key}" content="${escape(value)}" data-rh="true">`).join('\n')+(noindex?'':`\n<script type="application/ld+json" id="seo-graph" data-rh="true">${serializeJsonLd(pageGraph(page,page.path==='/sss'?faqs:[]))}</script>`);
};
const links = seoPages.filter(p=>p.path!=='/').map(p=>`<li><a href="${p.path}">${escape(p.label)}</a></li>`).join('');
for(const page of seoPages) {
 const dir = 'dist'+(page.path==='/'?'':page.path);
 await mkdir(dir,{recursive:true});
 // Honest, visible initial content. React replaces this with the full interactive page.
 const content = `<main style="max-width:960px;margin:48px auto;padding:24px;font-family:Arial,sans-serif"><a href="/">${escape(SITE_NAME)}</a><h1>${escape(page.label==='Startseite'?'Catering in Wien':page.label)}</h1><p>${escape(page.description)}</p>${page.article?renderToStaticMarkup(React.createElement(ReactMarkdown,{components:{h1:({children})=>React.createElement('h2',null,children)}},page.article.body)):''}${page.path==='/sss'?faqs.map(f=>`<details><summary>${escape(f.question)}</summary><p>${escape(f.answer)}</p></details>`).join(''):''}<nav aria-label="Seitenübersicht"><ul>${links}</ul></nav><noscript><p>Für interaktive Funktionen und das Kontaktformular aktivieren Sie bitte JavaScript. Telefon: <a href="tel:+4369916002800">+43 699 1600 2800</a>.</p></noscript></main>`;
 const html=base.replace('<html lang="de">','<html lang="de-AT">').replace('</head>',head(page)+'\n</head>').replace('<div id="root"></div>',`<div id="root">${content}</div>`);
 await writeFile(dir+'/index.html',html);
}
const missing={path:'/404',title:'Seite nicht gefunden | '+SITE_NAME,description:'Die gesuchte Seite existiert nicht oder wurde verschoben.'};
await writeFile('dist/404.html',base.replace('</head>',head(missing,true)+'</head>').replace('<div id="root"></div>','<div id="root"><main><h1>Seite nicht gefunden</h1><p>Die gesuchte Seite existiert nicht.</p><a href="/">Zur Startseite</a></main></div>'));
const admin=base.replace('</head>',head({path:'/admin',title:'Administration | '+SITE_NAME,description:'Geschützter Verwaltungsbereich'},true)+'</head>');
await writeFile('dist/admin.html',admin);
// CMS categories are dynamic: preserve direct access instead of returning a false 404.
await writeFile('dist/category.html',base);
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+seoPages.filter(p=>!p.noindex).map(p=>`  <url><loc>${canonicalUrl(p.path)}</loc></url>`).join('\n')+'\n</urlset>\n';
await writeFile('dist/sitemap.xml',sitemap);
await writeFile('public/sitemap.xml',sitemap);
const redirects=[
 ...Object.entries(seoAliases).map(([from,to])=>`${from} ${to} 301!`),
 ...seoPages.filter(p=>p.path!=='/').flatMap(p=>[`${p.path}/ ${p.path} 301!`,`${p.path} ${p.path}/index.html 200`]),
 '/catering-and-more/* /category.html 200','/admin /admin.html 200','/admin/* /admin.html 200','/500 /404.html 500','/* /404.html 404'
];
await writeFile('dist/_redirects',redirects.join('\n')+'\n');
console.log(`SEO: ${seoPages.length} pages, sitemap, canonical redirects, FAQ graph and 404 generated for ${SITE_URL}`);

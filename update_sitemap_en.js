const fs = require('fs');
const path = require('path');

const districts = require('./districts_en.json');

const sitemapPath = path.join(__dirname, 'sitemap.xml');
let content = fs.readFileSync(sitemapPath, 'utf8');
let newUrls = '';
let count = 0;

for (const d of districts) {
  const url = `https://stayx.estate/en/blog/${d.slug}.html`;
  if (!content.includes(url)) {
    newUrls += `
  <url>
    <loc>${url}</loc>
    <lastmod>2026-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    count++;
  }
}

if (count > 0) {
  content = content.replace('</urlset>', newUrls + '\n</urlset>');
  fs.writeFileSync(sitemapPath, content, 'utf8');
  console.log(`Added ${count} new English URLs to sitemap.xml`);
} else {
  console.log("No new URLs to add.");
}

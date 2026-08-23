const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Helper to recursively get all HTML files
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.gemini' && file !== 'scratch' && file !== '.agents') {
        getHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html') && !file.endsWith('.bak')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const allHtmls = getHtmlFiles(rootDir);
console.log(`Found ${allHtmls.length} indexable candidate HTML files.`);

// Filter out utility files
const excludeFiles = ['404.html', 'go.html', 'links.html'];
const indexableHtmls = allHtmls.filter(filePath => {
  const baseName = path.basename(filePath);
  return !excludeFiles.includes(baseName);
});

console.log(`Remaining indexable files: ${indexableHtmls.length}`);

// Base site configuration
const siteUrl = 'https://stayx.estate';
const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

// Group files to identify parallel translations for main pages
// For main pages, we will output full hreflang alternates.
// Main paths to group:
const mainPageGroups = {
  'index.html': { uk: '/', en: '/en/', pl: '/pl/', priority: '1.0', changefreq: 'weekly' },
  'rent-in-warsaw-guide-2026.html': { uk: '/rent-in-warsaw-guide-2026', en: '/en/rent-in-warsaw-guide-2026', pl: '/pl/rent-in-warsaw-guide-2026', priority: '0.9', changefreq: 'monthly' },
  'rent-calculator-warsaw.html': { uk: '/rent-calculator-warsaw', en: '/en/rent-calculator-warsaw', pl: '/pl/rent-calculator-warsaw', priority: '0.8', changefreq: 'monthly' },
  'how-it-works.html': { uk: '/how-it-works', en: '/en/how-it-works', pl: '/pl/how-it-works', priority: '0.7', changefreq: 'monthly' },
  'privacy.html': { uk: '/privacy', en: '/en/privacy', pl: '/pl/privacy', priority: '0.3', changefreq: 'yearly' },
  'thank-you.html': { uk: '/thank-you', en: '/en/thank-you', pl: '/pl/thank-you', priority: '0.3', changefreq: 'monthly' },
  'blog/index.html': { uk: '/blog/', en: '/en/blog/', pl: '/pl/blog/', priority: '0.8', changefreq: 'weekly' }
};

// Map each HTML file path to its clean public path relative to site root
const urlsList = [];

// Track which files have been processed as part of a main page group
const processedMainFiles = new Set();

indexableHtmls.forEach(filePath => {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  
  // Check if it fits in any main page group
  let isMainGroup = false;
  for (const [key, paths] of Object.entries(mainPageGroups)) {
    // Check if the relPath matches key (root), 'en/' + key, or 'pl/' + key
    if (relPath === key || relPath === `en/${key}` || relPath === `pl/${key}`) {
      isMainGroup = true;
      if (!processedMainFiles.has(key)) {
        // Output entries for this group (UK, EN, PL)
        const priority = paths.priority;
        const changefreq = paths.changefreq;
        
        // UK
        urlsList.push({
          loc: siteUrl + paths.uk,
          priority,
          changefreq,
          alternates: [
            { hreflang: 'uk', href: siteUrl + paths.uk },
            { hreflang: 'en', href: siteUrl + paths.en },
            { hreflang: 'pl', href: siteUrl + paths.pl }
          ]
        });
        
        // EN
        urlsList.push({
          loc: siteUrl + paths.en,
          priority,
          changefreq,
          alternates: [
            { hreflang: 'uk', href: siteUrl + paths.uk },
            { hreflang: 'en', href: siteUrl + paths.en },
            { hreflang: 'pl', href: siteUrl + paths.pl }
          ]
        });
        
        // PL
        urlsList.push({
          loc: siteUrl + paths.pl,
          priority,
          changefreq,
          alternates: [
            { hreflang: 'uk', href: siteUrl + paths.uk },
            { hreflang: 'en', href: siteUrl + paths.en },
            { hreflang: 'pl', href: siteUrl + paths.pl }
          ]
        });
        
        processedMainFiles.add(key);
      }
      break;
    }
  }
  
  // If not a main page group, it's a blog post / district page
  if (!isMainGroup) {
    // Generate clean path
    let cleanPath = '/' + relPath.replace(/\.html$/, '');
    
    urlsList.push({
      loc: siteUrl + cleanPath,
      priority: '0.8',
      changefreq: 'monthly'
    });
  }
});

// Construct XML content
let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

urlsList.forEach(url => {
  xmlContent += `  <url>\n`;
  xmlContent += `    <loc>${url.loc}</loc>\n`;
  xmlContent += `    <lastmod>${currentDate}</lastmod>\n`;
  xmlContent += `    <changefreq>${url.changefreq}</changefreq>\n`;
  xmlContent += `    <priority>${url.priority}</priority>\n`;
  
  if (url.alternates) {
    url.alternates.forEach(alt => {
      xmlContent += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>\n`;
    });
  }
  
  xmlContent += `  </url>\n`;
});

xmlContent += `</urlset>\n`;

// Write to sitemap.xml
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xmlContent, 'utf8');
console.log(`Generated sitemap.xml successfully with ${urlsList.length} pages indexed!`);

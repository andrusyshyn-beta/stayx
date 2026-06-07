const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const domain = "https://stayx.estate";

// Dictionary for localized names
const langDict = {
  'uk': { home: 'Головна', blog: 'Блог' },
  'en': { home: 'Home', blog: 'Blog' },
  'pl': { home: 'Strona Główna', blog: 'Blog' }
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git') && !filePath.includes('scratch')) {
        results = results.concat(walk(filePath));
      }
    } else {
      if (filePath.endsWith('.html')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const htmlFiles = walk(rootDir);

let updatedCount = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Extract the title
  let titleMatch = content.match(/<title>(.*?)<\/title>/i);
  let pageTitle = titleMatch ? titleMatch[1].split('|')[0].trim() : "STAYX";
  // remove ' - StayX', etc if needed, but split on '|' usually works.
  
  // Determine relative URL and language
  let relPath = file.substring(rootDir.length).replace(/\\/g, '/');
  
  let lang = 'uk';
  if (relPath.startsWith('/en/')) lang = 'en';
  else if (relPath.startsWith('/pl/')) lang = 'pl';
  
  let items = [];
  
  // 1. Home
  let homeUrl = domain + (lang === 'uk' ? '/' : `/${lang}/`);
  items.push(`{"@type":"ListItem","position":1,"name":"${langDict[lang].home}","item":"${homeUrl}"}`);
  
  let position = 2;
  
  // 2. Blog intermediate
  if (relPath.includes('/blog/')) {
    let blogUrl = domain + (lang === 'uk' ? '/blog/' : `/${lang}/blog/`);
    items.push(`{"@type":"ListItem","position":${position},"name":"${langDict[lang].blog}","item":"${blogUrl}"}`);
    position++;
  }
  
  // 3. Current page (if not home or blog index)
  let isIndex = relPath.endsWith('/index.html') || relPath === '/en/index.html' || relPath === '/pl/index.html' || relPath.endsWith('/blog/index.html');
  if (!isIndex) {
    let currentUrl = domain + relPath;
    items.push(`{"@type":"ListItem","position":${position},"name":"${pageTitle}","item":"${currentUrl}"}`);
  }

  const breadcrumbJsonLd = `
<script type="application/ld+json" id="breadcrumb-schema">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[${items.join(',')}]}
</script>`;

  // Check if BreadcrumbList already exists
  if (content.includes('"@type":"BreadcrumbList"') || content.includes('id="breadcrumb-schema"')) {
    // try to replace the existing one
    content = content.replace(/<script[^>]*>[\s\S]*?"@type"\s*:\s*"BreadcrumbList"[\s\S]*?<\/script>/, breadcrumbJsonLd.trim());
    content = content.replace(/<script type="application\/ld\+json" id="breadcrumb-schema">[\s\S]*?<\/script>/, breadcrumbJsonLd.trim());
  } else {
    // Inject before </head>
    content = content.replace('</head>', breadcrumbJsonLd + '\n</head>');
  }

  fs.writeFileSync(file, content, 'utf8');
  updatedCount++;
}

console.log(`Successfully added/updated Breadcrumbs JSON-LD in ${updatedCount} HTML files.`);

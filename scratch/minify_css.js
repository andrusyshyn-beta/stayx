const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Minify CSS helper
function minifyCSS(cssContent) {
  return cssContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s*([{\}:;,])\s*/g, '$1') // Remove spaces around delimiters
    .replace(/\s+/g, ' ') // Collapse whitespaces
    .trim();
}

// Minify styles.css
const stylesPath = path.join(rootDir, 'styles.css');
const stylesSrcPath = path.join(rootDir, 'styles.src.css');

if (fs.existsSync(stylesPath)) {
  if (!fs.existsSync(stylesSrcPath)) {
    fs.copyFileSync(stylesPath, stylesSrcPath);
    console.log('Created styles.src.css backup.');
  }
  
  const originalCSS = fs.readFileSync(stylesSrcPath, 'utf8');
  const minifiedCSS = minifyCSS(originalCSS);
  fs.writeFileSync(stylesPath, minifiedCSS, 'utf8');
  console.log(`Minified styles.css: ${originalCSS.length} bytes -> ${minifiedCSS.length} bytes.`);
}

// Minify blog.css
const blogPath = path.join(rootDir, 'blog.css');
const blogSrcPath = path.join(rootDir, 'blog.src.css');

if (fs.existsSync(blogPath)) {
  if (!fs.existsSync(blogSrcPath)) {
    fs.copyFileSync(blogPath, blogSrcPath);
    console.log('Created blog.src.css backup.');
  }
  
  const originalBlogCSS = fs.readFileSync(blogSrcPath, 'utf8');
  const minifiedBlogCSS = minifyCSS(originalBlogCSS);
  fs.writeFileSync(blogPath, minifiedBlogCSS, 'utf8');
  console.log(`Minified blog.css: ${originalBlogCSS.length} bytes -> ${minifiedBlogCSS.length} bytes.`);
}

// 2. Remove image preloads from index.html, en/index.html, pl/index.html
const homepages = ['index.html', 'en/index.html', 'pl/index.html'];

homepages.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Match both images/ and ../images/
  const galaxyPreloadPattern = /\s*<link rel="preload" href="(?:\.\.\/)?images\/galaxy-bg\.webp" as="image" fetchpriority="high">/;
  const collagePreloadPattern = /\s*<link rel="preload" href="(?:\.\.\/)?images\/collage-main\.webp" as="image" fetchpriority="high">/;
  
  let modified = false;
  if (galaxyPreloadPattern.test(content)) {
    content = content.replace(galaxyPreloadPattern, '');
    modified = true;
  }
  if (collagePreloadPattern.test(content)) {
    content = content.replace(collagePreloadPattern, '');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed image preloads from ${file}`);
  } else {
    console.log(`Preloads not found or already removed in ${file}`);
  }
});

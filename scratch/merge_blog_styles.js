const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Helper to minify CSS
function minifyCSS(cssContent) {
  return cssContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s*([{\}:;,])\s*/g, '$1') // Remove spaces around delimiters
    .replace(/\s+/g, ' ') // Collapse whitespaces
    .trim();
}

// 1. Read blog card styles from blog.src.css
const blogSrcPath = path.join(rootDir, 'blog.src.css');
if (!fs.existsSync(blogSrcPath)) {
  console.error('blog.src.css not found!');
  process.exit(1);
}
const blogSrcContent = fs.readFileSync(blogSrcPath, 'utf8');

// Extract the cards section
const startKeyword = '/* ===== BASE BLOG INDEX CARDS (PRESERVED) ===== */';
const endKeyword = '/* ==========================================================================';

const startIndex = blogSrcContent.indexOf(startKeyword);
// Search for the end keyword starting FROM the startIndex
const endIndex = blogSrcContent.indexOf(endKeyword, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.error('Keywords for slice not found in blog.src.css!', { startIndex, endIndex });
  process.exit(1);
}

const blogCardStyles = blogSrcContent.slice(startIndex, endIndex);
console.log('Extracted blog card preview styles from blog.src.css');

// 2. Append to styles.src.css
const stylesSrcPath = path.join(rootDir, 'styles.src.css');
if (!fs.existsSync(stylesSrcPath)) {
  console.error('styles.src.css not found!');
  process.exit(1);
}
let stylesSrcContent = fs.readFileSync(stylesSrcPath, 'utf8');

if (!stylesSrcContent.includes('.blog-grid')) {
  stylesSrcContent += '\n\n' + blogCardStyles;
  fs.writeFileSync(stylesSrcPath, stylesSrcContent, 'utf8');
  console.log('Appended blog card styles to styles.src.css');
} else {
  console.log('styles.src.css already contains blog card styles.');
}

// 3. Re-minify styles.css
const minifiedCSS = minifyCSS(stylesSrcContent);
// Adapt relative image URLs to absolute for inline support
const absoluteCSS = minifiedCSS.replace(/url\(['"]?images\//g, "url('/images/");
fs.writeFileSync(path.join(rootDir, 'styles.css'), minifiedCSS, 'utf8');
console.log('Re-minified styles.css successfully.');

// 4. Inline CSS and remove blog.css link from homepages
const homepages = ['index.html', 'en/index.html', 'pl/index.html'];

homepages.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the inline style block if it exists
  const inlinePattern = /<!-- Optimization: Inline CSS for 0 Render-Blocking Requests -->[\s\S]*?<\/style>/;
  const inlineStyleTag = `<!-- Optimization: Inline CSS for 0 Render-Blocking Requests -->\n  <style>${absoluteCSS}</style>`;
  
  if (inlinePattern.test(content)) {
    content = content.replace(inlinePattern, inlineStyleTag);
  }
  
  // Remove blog.css stylesheet link if present
  const blogLinkPattern = /\s*<link rel="stylesheet" href="(?:\.\.\/|\/)?blog\.css"[^>]*?>/;
  if (blogLinkPattern.test(content)) {
    content = content.replace(blogLinkPattern, '');
    console.log(`Removed blog.css link from ${file}`);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated HTML in ${file}`);
});

console.log('Successfully completed merging and clean-up of blog styles!');

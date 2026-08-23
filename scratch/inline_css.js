const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Read and prepare minified CSS
const stylesPath = path.join(rootDir, 'styles.css');
if (!fs.existsSync(stylesPath)) {
  console.error('styles.css not found!');
  process.exit(1);
}

let cssContent = fs.readFileSync(stylesPath, 'utf8');

// Replace relative URL with absolute URL for inline support in subfolders
cssContent = cssContent.replace(/url\(['"]?images\//g, "url('/images/");
console.log('Prepared CSS content and adapted relative image URLs to absolute.');

// 2. Perform inlining on homepages
const homepages = ['index.html', 'en/index.html', 'pl/index.html'];

homepages.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to match the block starting from Critical Path comment to styles.css link
  const inlinePattern = /<!-- Optimization: Critical Path CSS -->[\s\S]*?<!-- Optimization: Preload Critical Assets -->\s*<link rel="stylesheet" href="[^"]*?styles\.css">/;
  
  const inlineStyleTag = `<!-- Optimization: Inline CSS for 0 Render-Blocking Requests -->
  <style>${cssContent}</style>`;
  
  if (inlinePattern.test(content)) {
    content = content.replace(inlinePattern, inlineStyleTag);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully inlined CSS into ${file}`);
  } else {
    console.log(`Pattern not found in ${file}`);
  }
});

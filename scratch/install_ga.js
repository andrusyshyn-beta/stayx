const fs = require('fs');
const path = require('path');

// Recursive helper to get all HTML files
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Ignore node_modules, .git, .gemini, and scratch folders
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.gemini' && file !== 'scratch' && file !== '.agents') {
        getHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const rootDir = path.join(__dirname, '..');
const htmlFiles = getHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files to inspect.`);

const gaId = 'G-LE3BY89Z30';
const gaTag = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${gaId}');
</script>`;

let installedCount = 0;
let skippedCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Check if already installed
  if (content.includes(gaId)) {
    skippedCount++;
    return;
  }
  
  // 2. Insert immediately after <head>
  const headPattern = /<head(\s[^>]*)?>/;
  if (headPattern.test(content)) {
    content = content.replace(headPattern, (match) => `${match}\n${gaTag}`);
    fs.writeFileSync(filePath, content, 'utf8');
    const relativePath = path.relative(rootDir, filePath);
    console.log(`Installed Google Analytics tag in: ${relativePath}`);
    installedCount++;
  } else {
    console.log(`Could not find <head> tag in: ${path.relative(rootDir, filePath)}`);
  }
});

console.log(`Google Analytics installation complete! Installed: ${installedCount}, Skipped (already exists): ${skippedCount}`);

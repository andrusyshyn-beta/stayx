const fs = require('fs');
const path = require('path');

// Recursive helper to get all HTML files
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

const rootDir = path.join(__dirname, '..');
const htmlFiles = getHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files to inspect.`);

const gaId = 'G-LE3BY89Z30';

// New Lazy Google Analytics code snippet
const lazyGaTag = `<!-- Google tag (gtag.js) Lazy Optimized -->
<script>
  (function() {
    let gaLoaded = false;
    function loadGA() {
      if (gaLoaded) return;
      gaLoaded = true;
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=${gaId}';
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', '${gaId}');
    }
    
    const triggerEvents = ['mouseover', 'keydown', 'touchstart', 'scroll'];
    triggerEvents.forEach(event => {
      window.addEventListener(event, loadGA, { passive: true, once: true });
    });
    setTimeout(loadGA, 4000);
  })();
</script>`;

let updatedCount = 0;

// Regex to find the old GA tag we inserted previously
const oldGaRegex = /<!-- Google tag \(gtag\.js\) -->\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-LE3BY89Z30"><\/script>\s*<script>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*function\s+gtag\(\)\s*\{\s*dataLayer\.push\(arguments\);\s*\}\s*gtag\('js',\s*new\s+Date\(\)\);\s*gtag\('config',\s*'G-LE3BY89Z30'\);\s*<\/script>/g;

// A fallback simpler regex just in case there are whitespace differences
const oldGaRegexFallback = /<!-- Google tag \(gtag\.js\) -->[\s\S]*?gtag\('config',\s*'G-LE3BY89Z30'\);\s*<\/script>/g;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let replaced = false;

  if (content.includes('G-LE3BY89Z30') && !content.includes('Lazy Optimized')) {
    // Attempt exact match replace first
    if (oldGaRegex.test(content)) {
      content = content.replace(oldGaRegex, lazyGaTag);
      replaced = true;
    } else if (oldGaRegexFallback.test(content)) {
      content = content.replace(oldGaRegexFallback, lazyGaTag);
      replaced = true;
    }
    
    if (replaced) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
    } else {
      console.log(`GA found but regex failed to match in: ${path.relative(rootDir, filePath)}`);
    }
  }
});

console.log(`Deferred GA installation complete! Updated ${updatedCount} files.`);

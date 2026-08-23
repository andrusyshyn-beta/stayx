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
console.log(`Found ${htmlFiles.length} HTML files to check.`);

const hubspotPattern = /<!-- Start of HubSpot Embed Code -->[\s\S]*?<!-- End of HubSpot Embed Code -->/;

const deferredHubSpot = `<!-- Start of HubSpot Embed Code (Deferred Optimization) -->
  <script type="text/javascript">
    (function() {
      let hsLoaded = false;
      function loadHubSpot() {
        if (hsLoaded) return;
        hsLoaded = true;
        
        // Remove event listeners to clean up
        const events = ['mouseover', 'keydown', 'touchstart', 'scroll'];
        events.forEach(e => window.removeEventListener(e, loadHubSpot, { passive: true }));
        
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'hs-script-loader';
        script.async = true;
        script.defer = true;
        script.src = '//js-eu1.hs-scripts.com/148599762.js';
        document.body.appendChild(script);
      }
      
      const events = ['mouseover', 'keydown', 'touchstart', 'scroll'];
      events.forEach(e => window.addEventListener(e, loadHubSpot, { passive: true }));
      
      // Fallback timer: load after 4 seconds if no interaction occurs
      window.addEventListener('load', () => {
        setTimeout(loadHubSpot, 4000);
      });
    })();
  </script>
  <!-- End of HubSpot Embed Code -->`;

let updatedCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (hubspotPattern.test(content)) {
    content = content.replace(hubspotPattern, deferredHubSpot);
    fs.writeFileSync(filePath, content, 'utf8');
    const relativePath = path.relative(rootDir, filePath);
    console.log(`Deferred HubSpot script in: ${relativePath}`);
    updatedCount++;
  }
});

console.log(`Successfully optimized HubSpot loader in ${updatedCount} HTML files!`);

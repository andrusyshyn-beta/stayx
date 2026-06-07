const fs = require('fs');
const path = require('path');

const hubspotCode = `
<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/148599762.js"></script>
<!-- End of HubSpot Embed Code -->
</body>`;

function injectHubspot(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      count += injectHubspot(fullPath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('hs-scripts.com/148599762.js')) {
        content = content.replace('</body>', hubspotCode);
        fs.writeFileSync(fullPath, content, 'utf8');
        count++;
      }
    }
  }
  return count;
}

const rootDir = __dirname;
const updatedFilesCount = injectHubspot(rootDir);
console.log(`Successfully injected HubSpot code into ${updatedFilesCount} HTML files.`);
